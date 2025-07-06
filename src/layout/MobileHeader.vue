<script setup>
import {ref, onMounted, onUnmounted} from "vue";
import {useRoute, useRouter} from 'vue-router'
import {computed} from 'vue'

defineProps({
  isToken: Boolean,
  profileImage: String
})

const route = useRoute()
const router = useRouter()
const goHome = () => {
  router.push('/');
};

const logoUrl = new URL('@/assets/images/app-logo.svg', import.meta.url).href;

const isScrolled = ref(false);
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
})
</script>

<template>
  <header :class="['header', { scrolled: isScrolled }]">
    <div class="header-inner">
      <img
          class="app-logo"
          :src="logoUrl"
          alt="앱 로고"
          @click="goHome"
      />

      <div class="auth-wrapper">
        <!-- 로그인 상태 -->
        <template v-if="isToken">
          <img
              :src="profileImage"
              alt="프로필 이미지"
              class="profile-img"
          />
          <button class="auth-btn" @click="$emit('logout')">로그아웃</button>
        </template>

        <!-- 로그아웃 상태 -->
        <template v-else>
          <button class="auth-btn" @click="$emit('login')">로그인</button>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  padding: 0 16px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 40;
  background-color: transparent;
  border-bottom: 1px solid transparent;
  transition: all 0.5s ease;
}

.header-inner {
  width: 100%;
  max-width: 700px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 30px;
  padding-right: 30px;
  height: 100px;
}

.header.scrolled {
  background-color: rgba(255, 255, 255, 0.9);
  //background-color: #cbebdb;
  border-bottom: 1px solid rgba(229, 231, 235, 0.8);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6px);
}

.app-logo {
  height: 180px;
  cursor: pointer;
}

.auth-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.auth-btn {
  padding: 6px 12px;
  font-size: 17px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.auth-btn:hover {
  background-color: #0056b3;
}

.profile-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #007bff
}
</style>