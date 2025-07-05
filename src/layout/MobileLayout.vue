<script setup>
import mobileHeader from "@/layout/MobileHeader.vue";
import mobileFooter from "@/layout/MobileFooter.vue";
import "@/assets/css/mobile/mobile-layout.css"
import {computed, ref} from 'vue'
import {useRouter} from 'vue-router';
import {useUserStore} from "@/store/useUserStore.js";

const store = useUserStore()
const isMenuOpen = ref(false)
const isToken = computed(() => !!store.user)
const router = useRouter();

const closeMenu = () => {
  isMenuOpen.value = false;
};
const goToMyPage = () => {
  router.push('/mypage');
};
const goToLogin = () => {
  router.push('/login');
};
const logout = async () => {
  await store.logout()
};
</script>


<template>
  <div class="mobile-layout-wrapper">
    <div class="mobile-layout-container">
      <mobile-header class="mobile-header" @toggleMenu="isMenuOpen = !isMenuOpen"/>

      <!-- 메뉴 -->
      <div v-if="isMenuOpen" class="menu-overlay" @click.self="isMenuOpen = false">
        <div class="slide-menu">
          <div class="menu-header">
            <span>메뉴</span>
            <button class="close-btn" @click="isMenuOpen = false">✕</button>
          </div>
          <div v-if="isToken">
            <div class="menu-item" @click="goToMyPage(); closeMenu();">
              마이페이지
            </div>
            <div class="menu-item" @click="logout(); closeMenu();">로그아웃</div>
          </div>
          <div v-else>
            <div class="menu-item" @click="goToLogin(); closeMenu();">로그인</div>
          </div>
        </div>
      </div>

      <!-- 메인 -->
      <main class="content">
        <router-view/>
      </main>

      <mobile-footer/>
    </div>
  </div>
</template>

<style scoped>
.mobile-layout-wrapper {
  display: flex;
  justify-content: center;
  background-color: #f5f5f5; /* 바깥 영역 배경색 */
  min-height: 100%;
}

.mobile-layout-container {
  position: relative; /* 기준점 */
  width: 100%;
  max-width: 700px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  padding: 56px 16px 80px;
}

/* 메뉴 오버레이 */
.menu-overlay {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 100;
  display: flex;
  justify-content: flex-end;
}

/* 슬라이드 메뉴 */
.slide-menu {
  width: 70%;
  max-width: 300px;
  background-color: #fff;
  height: 100%;
  animation: slideIn 0.3s ease-out forwards;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0%);
  }
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.menu-item {
  padding: 14px;
  border-bottom: 1px solid #eee;
}

.menu-item:hover {
  cursor: pointer;
  background: #f2f2f2;
}
</style>

