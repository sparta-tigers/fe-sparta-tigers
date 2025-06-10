<script setup>
const kakaoLogin = () => {
  window.location.href = 'http://localhost:8080/oauth2/authorization/kakao';
};

</script>

<template>
<div class="login-container">
  <div class="instruction-div">
    <div class="instruction-title">
      조금 큰 글씨
    </div>
    <div class="instruction-content">
      그보다 작은 글씨
    </div>
    <div class="instruction-image">
      야구 관련 이미지 넣기
    </div>
  </div>

  <div>
    <img
        src="../../../../public/images/social/kakao_login_medium_wide.png"
        height="45"
        width="300"
        alt="kakao_login"
        @click="kakaoLogin"
        style="cursor: pointer"
    />
  </div>

  <div class="login-info">
    <router-link to="/login-help" >로그인 관련 문제</router-link>
  </div>
</div>
</template>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
}

.instruction-div {
  text-align: center;
  width : 100%;
  margin-bottom: 5em;
}
.login-info {
  cursor:pointer;
  font-size: 0.5em;
  text-decoration: underline;
}
</style>