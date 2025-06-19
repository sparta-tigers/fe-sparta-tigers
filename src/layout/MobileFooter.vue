<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

function goRoute(name) {
  router.push({ name });
}
</script>

<template>
  <footer class="mobile-footer">
    <div class="footer-btn" @click="goRoute('liveboard-match')">라이브보드</div>
    <div class="footer-btn" @click="goRoute('exchange-main')">교환</div>
    <div class="footer-btn" @click="goRoute('stadium-main')">구장정보</div>
    <div class="footer-btn" @click="goRoute('alarm-main')">알림</div>
    <div class="footer-btn" @click="goRoute('record-main')">직관기록</div>
  </footer>
</template>

<style scoped>
.mobile-footer {
  display: flex;
  align-items: center;
  width: 100%;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  height: 7vh;
}

.footer-btn {
  flex: 1;
  text-align: center;
  cursor: pointer;
}
</style>
