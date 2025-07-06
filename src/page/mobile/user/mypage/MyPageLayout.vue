<template>
  <div class="mypage-layout">
    <!-- 프로필 관리 -->
    <section class="profile-summary-wrapper">
      <MyPage />
    </section>

    <!-- 메뉴 탭 -->
    <nav class="mypage-menu">
      <button
          :class="{ active: isRoute('record') }"
          @click="goTo('record-main')"
      >직관기록
      </button>

      <button
          :class="{ active: isRoute('alarm-main') }"
          @click="goTo('alarm-main')"
      >알림
      </button>
    </nav>

    <!-- 하위 라우터 페이지 -->
    <main class="mypage-content">
      <router-view/>
    </main>
  </div>
</template>

<script setup>
import {useRoute, useRouter} from 'vue-router'
import {useUserStore} from "@/store/useUserStore.js";
import {onMounted} from "vue";
import MyPage from "@/page/mobile/user/mypage/MyPage.vue";

const route = useRoute()
const router = useRouter()
const store = useUserStore()

onMounted(async () => {
  await store.getUser();
})

// 현재 경로 이름이 해당 메뉴인지 확인
const isRoute = (name) => {
  return route.name?.startsWith(name)
}

// 메뉴 라우팅
const goTo = (name) => {
  router.push({name})
}
</script>


<style scoped>
.mypage-layout {
  max-width: 700px;
  margin: 0 auto;
  padding: 60px 16px 80px;
}

.profile-summary-wrapper {
  background: #f5f5f5;
  border-radius: 16px;
  padding: 24px 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.mypage-menu {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}

.mypage-menu button {
  flex: 1 1 45%;
  padding: 10px;
  border: 1px solid #ccc;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.mypage-menu button.active {
  background-color: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.mypage-content {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
}
</style>
