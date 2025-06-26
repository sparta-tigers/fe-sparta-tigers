<template>
  <div :class="{ 'my-message': message.isMyMessage }" class="chat-message">
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
  background-color: #DEAA79; /* 기본: 내 메시지 색상 */
  color: white;
  border-radius: 18px;
  min-height: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 280px;
}

/* 다른 사람 메시지 배경색 */
.chat-message:not(.my-message) .overlap-group {
  background-color: #FFE6A9;
  color: #333;
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
  font-size: 14px;
  line-height: 1.4;
}

.chat-message .timestamp {
  font-size: 11px;
  opacity: 0.8;
}

.chat-message .nickname {
  font-size: 13px;
  font-weight: 600;
  margin-right: 8px;
  opacity: 0.9;
}
</style>
