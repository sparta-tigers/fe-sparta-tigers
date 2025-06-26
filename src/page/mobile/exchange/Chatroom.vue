<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useUserStore } from "@/store/useUserStore.js";
import ChatMessage from "@/components/shard/ChatMessage.vue";

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

// 최신 데이터를 불러서 여기다가 채팅 메세지를 보여줄거에요

const connectWebSocket = () => {
  const client = new Client({
    brokerURL: `${wsBaseURL}/ws`,
    connectHeaders: {},
    webSocketFactory: () => new SockJS(`${baseURL}/ws`),
  });

  client.onConnect = function (frame) {
    client.subscribe(`/server/directRoom/${roomId}`, function (message) {
      const data = JSON.parse(message.body);
      chatMessages.value.push({
        content: data.message,
        sentAt: data.sentAt,
        senderNickName: data.senderNickname,
        isMyMessage: store.user.id === data.senderId,
      });
    });
  };

  client.activate();

  return client;
};

const client = connectWebSocket();

const sendMessage = () => {
  // client.publish({
  //   destination: `/client/exchange/room/${roomId}`,
  //   body: JSON.stringify({
  //     message: message,
  //   }),
  // });
  console.log(`/client/directRoom/send 메세지 전송`);
  console.log(
    "메시지 바디:",
    JSON.stringify({
      roomId: roomId,
      message: message.value,
    })
  );
  client.publish({
    destination: `/client/directRoom/send`,
    body: JSON.stringify({
      roomId: roomId,
      message: message.value,
    }),
  });
  console.log(message.value);
};

console.log(client);
</script>

<template>
  <div class="exchange-chatroom-wrapper">
    <div class="item-wrapper">아이템 정보</div>

    <div class="chat-wrapper">
      <div class="chat-message-wrapper">
        <ChatMessage
          v-for="(msg, index) in chatMessages"
          :key="index"
          :message="msg"
        />
      </div>
    </div>
    <div class="chat-message-input-container">
      <input
        type="text"
        v-model="message"
        class="chat-message-input"
        @keyup.enter="sendMessage"
        placeholder="메시지를 입력하세요..."
      />
      <button @click="sendMessage">메시지 전송</button>
    </div>
  </div>
</template>

<style scoped>
.exchange-chatroom-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 16px;
}

.item-wrapper {
  height: 100px;
  border-bottom: 1px solid black;
}

.chat-wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.chat-message-wrapper {
  flex-grow: 1;

  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  max-height: 600px;
}

.chat-message-wrapper::-webkit-scrollbar {
  display: none;
}

/* TODO Style */
.chat-message-input-container {
  display: flex;
  flex-direction: row;
  gap: 16px;
  border: 1px solid black;
  margin-top: 16px;
  padding-top: 4px;
}

.chat-message-input {
  flex-grow: 1;
}
</style>
