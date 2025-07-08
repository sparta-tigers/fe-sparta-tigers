<script setup>
import mobileHeader from "@/layout/MobileHeader.vue";
import mobileFooter from "@/layout/MobileFooter.vue";
import "@/assets/css/mobile/mobile-layout.css"
import {computed} from 'vue'
import {useRouter} from 'vue-router';
import {useUserStore} from "@/store/useUserStore.js";

const store = useUserStore()
const isToken = computed(() => !!store.user)
const router = useRouter();

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
      <!-- 헤더 -->
      <div class="mobile-header">

        <mobile-header
            :isToken="isToken"
            :profile-image="store.user?.path"
            @login="goToLogin"
            @logout="logout"
        />
      </div>

      <!-- 메인 -->
      <main class="content">
        <router-view/>
      </main>

      <!-- 푸터 -->
      <mobile-footer/>
    </div>
  </div>
</template>

<style scoped>
.mobile-layout-wrapper {
  display: flex;
  justify-content: center;
  min-height: 100%;
}

.mobile-layout-container {
  position: relative; /* 기준점 */
  width: 100%;
  max-width: 700px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: white;
}

.mobile-header {
  display: contents;
}

.content {
  padding: 0 16px 80px;
  margin-top: 80px;
  background-color: white;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>

