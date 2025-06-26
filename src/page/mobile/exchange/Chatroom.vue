<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useUserStore } from "@/store/useUserStore.js";
import ChatMessage from "@/components/shard/ChatMessage.vue";
import instance from "@/axios.js";

const store = useUserStore();
const baseURL = import.meta.env.VITE_API_BASE_URL;
const wsBaseURL = baseURL.replace(/^http/, 'ws')

const fetchUser = async () => {
  await store.getUser();
};

onMounted(fetchUser);

const route = useRoute();
const roomId = route.params.roomId;
const message = ref("");
const chatMessages = ref([]);
const client = ref(null);
const chatMessageWrapper = ref(null);

const connectWebSocket = () => {
  const client = new Client({
    brokerURL: `${wsBaseURL}/ws`,
    connectHeaders: {
      Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
      ChatDomain: 'directroom'
    },
    webSocketFactory: () => new SockJS(`http://${API_BASE_URL}/ws`),
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
    });
  };

  client.activate();

  return client;
};

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
  setTimeout(() => {
    if (chatMessageWrapper.value) {
      chatMessageWrapper.value.scrollTop = chatMessageWrapper.value.scrollHeight;
    }
  }, 100);
};

const fetchMessage = async () => {
  const response = await instance.get(`direct-rooms/${roomId}/messages`);
  chatMessages.value = [...response.data.data.content.map(msg => ({
    content: msg.message,
    sentAt: msg.sentAt, // 또는 원하는 형식으로
    senderNickName: msg.senderNickname,
    isMyMessage: store.user.id === msg.senderId
  })).reverse()];
}

onMounted(async () => {
  await store.getUser();
  await fetchMessage();
  client.value = connectWebSocket();
});

</script>

<template>
  <div class="exchange-chatroom-wrapper">
    <div class="button-wrapper">
      <button>교환 완료</button>
    </div>

    <div class="chat-wrapper">
      <div ref="chatMessageWrapper" class="chat-message-wrapper">
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
</style>
