<template>
  <div class="chat-message" :class="{ 'my-message': message.isMyMessage }">
    <div class="overlap-group">
      <div class="message-top">
        <div class="nickname">{{ message.senderNickName }}</div>
        <div class="timestamp">{{ changeDateFormat(message.sentAt) }}</div>
      </div>
      <div class="content">{{ message.content }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: Object,
    required: true,
    default: () => ({
      content: "",
      sentAt: "",
      senderNickName: "",
      isMyMessage: true,
    }),
  },
});

const changeDateFormat = (date) => {
  if (!date) return "";

  // Date 객체로 변환 (문자열인 경우)
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // HH:MM 형식으로 포맷
  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};
</script>

<style scoped>
.chat-message {
  display: flex;
  justify-content: flex-end; /* 기본: 오른쪽 정렬 (내 메시지) */
  margin-bottom: 8px;
}

/* 다른 사람 메시지는 왼쪽 정렬 */
.chat-message:not(.my-message) {
  justify-content: flex-start;
}

.chat-message .overlap-group {
  background-color: #deaa79; /* 기본: 내 메시지 색상 */
  border-radius: 10px;
  height: 57px;
  padding: 10px 16px 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

/* 다른 사람 메시지 배경색 */
.chat-message:not(.my-message) .overlap-group {
  background-color: #ffe6a9;
  border: 1px solid #e0e0e0;
}

.chat-message {
  color: #000000;
}

.chat-message .message-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-message .content {
  font-size: 13px;
}

.chat-message .timestamp {
  font-size: 12px;
}

.chat-message .nickname {
  font-size: 16px;
  font-weight: 600;
  margin-right: 8px;
}
</style>
