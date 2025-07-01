<script setup>
import {nextTick, onMounted, onUnmounted, ref} from "vue";
import {useRoute} from "vue-router";
import {Client} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {useUserStore} from "@/store/useUserStore.js";
import ChatMessage from "@/components/shard/ChatMessage.vue";
import instance from "@/axios.js";
import router from "@/router/router.js";

const store = useUserStore();
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL;
const HTTP_BASE_URL = import.meta.env.VITE_HTTP_BASE_URL;

const fetchUser = async () => {
  await store.getUser();
};

onMounted(fetchUser);

const route = useRoute();
const roomId = route.params.roomId;
const exchangeRequestId = route.params.exchangeRequestId;
const message = ref("");
const chatMessages = ref([]);
const client = ref(null);
const chatMessageWrapper = ref(null);
const page = ref(0);
const pageInfo = ref({});
const loading = ref(false);
const isLoadingOlderMessages = ref(false);
const exchangeRoomWrapper = ref(null);

const connectWebSocket = () => {
  const client = new Client({
    brokerURL: `${WS_BASE_URL}/ws`,
    connectHeaders: {
      Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
      ChatDomain: 'directroom'
    },
    webSocketFactory: () => new SockJS(`${HTTP_BASE_URL}/ws`),
  });

  client.onConnect = function (frame) {
    // server/directRoom/
    client.subscribe(`/server/directRoom/${roomId}`, function (message) {
      const data = JSON.parse(message.body);
      chatMessages.value.push({
        content: data.message,
        sentAt: data.sentAt,
        senderNickName: data.senderNickname,
        userId: store.user.id,
        isMyMessage: store.user.id === data.senderId,
      });

      // 새 메시지 수신 시 스크롤
      nextTick(() => {
        setTimeout(() => {
          scrollToBottom();
        }, 50);
      });
    });
  };

  client.activate();

  return client;
};

const disconnectWebSocket = () => {
  if (client.value) {
    client.value.deactivate();
    client.value = null;
  }
}

const sendMessage = () => {
  if (!client) {
    alert("서버와 연결이 안되어 있습니다. 네트워크 환경을 확인 해주세요");
    return;
  }

  if (!store.user) {
    alert("로그인 후 이용해주세요.");
    return;
  }

  if (message.value.trim()) {
    client.value.publish({
      destination: `/client/directRoom/send`,
      body: JSON.stringify({
        roomId: roomId,
        message: message.value,
      }),
    });
  }

  message.value = "";
  // 스크롤 맨 아래로 이동
  nextTick(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 550);
  });
};

const scrollToBottom = () => {
  // TODO 바깥 스크롤 때문에 제대로 동작 안함.
  if (chatMessageWrapper.value) {
    const element = chatMessageWrapper.value;
    element.scrollTop = element.scrollHeight;
  }
};

const fetchMessage = async (pageNum = 0, isLoadingMore = false) => {
  try {
    if (isLoadingMore) {
      isLoadingOlderMessages.value = true;
    } else {
      loading.value = true;
    }

    const response = await instance.get(`direct-rooms/${roomId}/messages`, {
      params: {
        page: pageNum,
        size: 20,
      }
    });

    const {content, ...rest} = response.data.data;
    const newMessages = content.map(msg => ({
      content: msg.message,
      sentAt: msg.sentAt,
      senderNickName: msg.senderNickname,
      isMyMessage: store.user.id === msg.senderId
    })).reverse();

    if (pageNum === 0) {
      // 첫 로드 시
      chatMessages.value = newMessages;
      await nextTick();
      setTimeout(() => {
        scrollToBottom();
      }, 200);
    } else {
      // 이전 메시지 로드 시
      const prevScrollHeight = chatMessageWrapper.value.scrollHeight;
      chatMessages.value = [...newMessages, ...chatMessages.value];

      await nextTick();
      // 스크롤 위치 유지
      const newScrollHeight = chatMessageWrapper.value.scrollHeight;
      chatMessageWrapper.value.scrollTop = newScrollHeight - prevScrollHeight;
    }

    pageInfo.value = rest;
    page.value = pageNum;

  } catch (e) {
    alert('메시지를 불러오는 중 문제가 발생했습니다! 잠시 후 다시 시도해주세요!');
  } finally {
    loading.value = false;
    isLoadingOlderMessages.value = false;
  }
}

const loadPreviousMessages = () => {
  if (!pageInfo.value.last && !isLoadingOlderMessages.value) {
    fetchMessage(page.value + 1, true);
  }
};

const handleScroll = () => {
  if (!chatMessageWrapper.value) return;
  const {scrollTop} = chatMessageWrapper.value;
  const threshold = 100; // 상단에서 100px 이내에 도달하면 로드

  if (scrollTop <= threshold) {
    console.log('Loading previous messages...');
    loadPreviousMessages();
  }
};

const handleExchangeComplete = async () => {
  try {
    await instance.patch(`exchanges/request/${exchangeRequestId}/complete`);
    alert('교환이 완료 되었습니다!');
    router.push(`/exchange/requests`);
  } catch (e) {
    alert('교환 완료중 문제가 발생 했습니다! 잠시 후 다시 시도해주세요!');
  }
}

onMounted(async () => {
  await store.getUser();
  await fetchMessage();
  client.value = connectWebSocket();

  // 전체 페이지 스크롤을 맨 하단으로 이동
  setTimeout(() => {
    if (exchangeRoomWrapper.value) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, 100);

  // 스크롤 이벤트 리스너 추가
  setTimeout(() => {
    if (chatMessageWrapper.value) {
      chatMessageWrapper.value.addEventListener('scroll', handleScroll);
    }
  }, 300);
});

onUnmounted(() => {
  disconnectWebSocket();

  // 스크롤 이벤트 리스너 제거
  if (chatMessageWrapper.value) {
    chatMessageWrapper.value.removeEventListener('scroll', handleScroll);
  }
})

</script>

<template>
  <div ref="exchangeRoomWrapper" class="exchange-chatroom-wrapper">
    <div class="button-wrapper">
      <button @click="handleExchangeComplete">교환 완료</button>
    </div>

    <div class="chat-wrapper">
      <div ref="chatMessageWrapper" class="chat-message-wrapper">
        <div v-if="isLoadingOlderMessages" class="loading-older-messages">
          이전 메시지를 불러오는 중...
        </div>
        <ChatMessage
            v-for="(msg, index) in chatMessages"
            :key="index"
            :message="msg"
        />
      </div>
    </div>

    <div class="chat-message-input-container">
      <input
          v-model="message"
          class="chat-message-input"
          placeholder="메시지를 입력하세요..."
          type="text"
          @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">메시지 전송</button>
    </div>
  </div>
</template>

<style scoped>
.exchange-chatroom-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 0 16px;
}

.button-wrapper {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
  border-bottom: 1px solid lightgray;
  padding: 16px 0;
  flex-shrink: 0;
}

.button-wrapper button {
  width: 100%;
  height: 40px;
  padding: 10px 20px;
  background-color: #659287;
  color: white;
  border-radius: 20px;
  border: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.chat-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.chat-message-wrapper {
  flex: 1;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding: 16px 0;
}

.chat-message-wrapper::-webkit-scrollbar {
  display: none;
}

.chat-message-input-container {
  position: sticky;
  bottom: 0;
  background-color: white;
  display: flex;
  flex-direction: row;
  padding: 16px 0;
  border-top: 1px solid lightgray;
  gap: 8px;
  flex-shrink: 0;
}

.chat-message-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.chat-message-input:focus {
  outline: none;
  border: 1px solid #659287;
}

.chat-message-input-container button {
  padding: 12px 16px;
  background-color: #659287;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
}

.loading-older-messages {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 14px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 16px;
}
</style>
