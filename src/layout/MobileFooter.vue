<template>
  <nav class="footer-wrapper">
    <div class="nav-list">
      <router-link to="/" class="nav-item" active-class="active">
        <i class="fas fa-home"></i>
        <span>홈</span>
      </router-link>

      <router-link to="/liveboard/match" class="nav-item" active-class="active">
        <i class="fas fa-video"></i>
        <span>라이브보드</span>
      </router-link>

      <router-link to="/stadiuminfo" class="nav-item" active-class="active">
        <i class="fas fa-baseball"></i>
        <span>구장 정보</span>
      </router-link>

      <router-link to="/exchange" class="nav-item" active-class="active">
        <i class="fas fa-right-left"></i>
        <span>교환</span>
      </router-link>

      <router-link to="/mypage" class="nav-item" active-class="active">
        <i class="fas fa-users"></i>
        <span>마이페이지</span>
      </router-link>
    </div>
  </nav>
</template>


<style scoped>
.footer-wrapper {
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  max-width: 700px;
  display: flex;
  justify-content: center;
  background-color: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.nav-list {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: white;
  padding: 10px 0;
  width: 100%;
}

.nav-item {
  width: 100%;
  max-width: 430px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 10px 0;
}

.nav-item i {
  font-size: 1.3rem;
  margin-bottom: 2px;
}

.nav-item span {
  font-size: 0.7rem;
  margin-bottom: 2px;
}

.nav-item.active * {
  color: #4CAF50;
  font-weight: bold;
}

/* 아이폰 하단 안전영역 대응 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .nav-list {
    padding-bottom: calc(10px + env(safe-area-inset-bottom));
  }
}
</style>
<script setup lang="ts">
</script>