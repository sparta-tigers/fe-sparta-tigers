<script setup>
import {useUserStore} from "@/store/useUserStore.js";
import router from "@/router/router.js";
import {ref} from "vue";
const store = useUserStore()
const kakaoLogin = () => {
  window.location.href = 'http://localhost:8080/oauth2/authorization/kakao';
};
const naverLogin = () => {
  window.location.href = 'http://localhost:8080/oauth2/authorization/naver';
}

const googleLogin = () => {
  window.location.href = 'http://localhost:8080/oauth2/authorization/google';
}
const email = ref('')
const password = ref('')


async function login() {
  try {
    await store.login(email.value, password.value);
    alert('로그인 성공!');
    await router.push('/');
  } catch (err) {
    console.log(err);
    alert('로그인 실패: 이메일 또는 비밀번호를 확인하세요.');
  }
}



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

  <div class="login-form">
    <input v-model="email" type="text" placeholder="이메일 또는 아이디" />
    <input v-model="password" type="password" placeholder="비밀번호" />

    <button class="login-btn" @click="login">로그인</button>

    <div class="auth-links">
<!--      <a @click="goToFindId">아이디 찾기</a>-->
      <span>|</span>
<!--      <a @click="goToFindPw">비밀번호 찾기</a>-->
      <span>|</span>
<!--      <a @click="goToSignup">회원가입</a>-->
    </div>
  </div>

  <div class="social-login-div">
    <img
        src="../../../../public/images/social/kakao/kakao.png"
        alt="kakao_login"
        @click="kakaoLogin"
        class="social-login-img kakao-login-img"
    />

    <img
        src="../../../../public/images/social/naver/btnG_아이콘사각.png"
        alt="naver-login"
        @click="naverLogin"
        class="social-login-img naver-login-img"
    />

    <img
        src="../../../../public/images/social/google/signin-assets/Android/png@1x/neutral/android_neutral_rd_na@1x.png"
        alt="google-login"
        @click="googleLogin"
        class="social-login-img google-login-img"
    />
  </div>


  <div class="login-info">
    <router-link to="/login-help" >로그인 관련 문제</router-link>
  </div>
</div>
</template>

<style scoped>
.social-login-div {
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-content: center;
}
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
.login-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.login-form input {
  width: 400px;
  height: 60px;
  padding: 0 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.login-btn {
  height: 45px;
  background-color: #0052cc;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.login-btn:hover {
  background-color: #003f99;
}

.auth-links {
  text-align: center;
  font-size: 14px;
  margin-top: 8px;
}

.auth-links a {
  text-decoration: underline;
  color: #555;
  margin: 0 6px;
  cursor: pointer;
}

.social-login-div {
  display: flex;
  gap: 12px; /* 버튼 간격 */
}

.social-login-img {
  width: 400px;
  height: 60px;
  object-fit: contain;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.kakao-login-img{
  background: #FFDE00;
}
.naver-login-img {
  background: #03C75A;
}
.google-login-img {
  background: #F2F2F2;
}
</style>