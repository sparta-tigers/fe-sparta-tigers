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
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 700px;
  z-index: 99;
  background-color: #fff;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  height: 56px;
  border-top: 1px solid #e0e0e0
}

.footer-btn {
  flex: 1;
  text-align: center;
  cursor: pointer;
  padding: 8px 0;
  user-select: none;
  transition: background-color 02.s ease;
}

.footer-btn:hover,
.footer-btn:focus-visible {
  background-color: #f7f7f7;
}
</style>
