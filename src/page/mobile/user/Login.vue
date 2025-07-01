<script setup>
import {useUserStore} from "@/store/useUserStore.js";
import {ref} from "vue";
import {useRouter} from "vue-router";

const store = useUserStore()
const baseURL = import.meta.env.VITE_HTTP_BASE_URL

console.log(baseURL);

const kakaoLogin = () => {
  window.location.href = `${baseURL}/oauth2/authorization/kakao`
};
const naverLogin = () => {
  window.location.href = `${baseURL}/oauth2/authorization/naver`
}

const googleLogin = () => {
  window.location.href = `${baseURL}/oauth2/authorization/google`
}

const router = useRouter()

const goToSignup = () => {
  router.push({name: 'sign-up'})
}
const goToFindId = () => {
  router.push({name: 'find-id'})
}
const goToFindPw = () => {
  router.push({name: 'find-password'})
}
const goToLoginHelp = () => {
  router.push({name: 'login-help'})
}


const email = ref('')
const password = ref('')
const login = async () => {
  const success = await store.login(email.value, password.value);
  if (success) {
    await router.push('/');
  }
};
</script>

<template>
  <div class="login-container">
    <div class="instruction-div">
      <div class="instruction-left"></div>
      <div class="instruction-center">
        <img alt="main-font" class="main-font-img" src="/images/fe-design/main-font.png">
      </div>
      <div class="instruction-right">
        <img alt="character-1" class="character-img" src="/images/fe-design/character-1.png">
      </div>
    </div>

    <div class="login-form">
      <input v-model="email" placeholder="이메일 또는 아이디" type="text"/>
      <input v-model="password" placeholder="비밀번호" type="password"/>

      <button class="login-btn" @click="login">로그인</button>

      <div class="auth-links">
        <a @click="goToFindId">아이디 찾기</a>
        <span>|</span>
        <a @click="goToFindPw">비밀번호 찾기</a>
        <span>|</span>
        <a @click="goToSignup">회원가입</a>
      </div>
    </div>

    <div class="social-login-div">
      <a href="http://localhost:8080/oauth2/authorization/kakao">
        <img
            alt="kakao_login"
            class="social-login-img kakao-login-img"
            src="../../../../public/images/social/kakao/kakao.png"
        />
      </a>

      <img
          alt="naver-login"
          class="social-login-img naver-login-img"
          src="../../../../public/images/social/naver/btnG_아이콘사각.png"
          @click="naverLogin"
      />

      <img
          alt="google-login"
          class="social-login-img google-login-img"
          src="../../../../public/images/social/google/signin-assets/Android/png@1x/neutral/android_neutral_rd_na@1x.png"
          @click="googleLogin"
      />
    </div>


    <div class="login-info">
      <a @click="goToLoginHelp">로그인 관련 문제</a>
    </div>
  </div>
</template>

<style scoped>
/* @@@@@@@@ 상단 이미지 및 로고 @@@@@@@ */
.instruction-div {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 5em;
  position: relative;
}

.instruction-div::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 5%;
  width: 90%;
  height: 2px;
  background: linear-gradient(to right, #ccc, #999, #ccc);
}

.instruction-left,
.instruction-right,
.instruction-center {
  flex: 1;
}

.instruction-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.instruction-right {
  display: flex;
  justify-content: right;
}


/* @@@@@@@@ 로그인 DIV 영역 @@@@@@@ */
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
}


.login-info {
  cursor: pointer;
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
  width: clamp(18rem, 25vw, 25rem);
  height: clamp(3rem, 6vh, 3.75rem);
  padding: 0 10px;
  font-size: 1rem;
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

/* @@@@@@@@ 아이디 비밀번호 회원가입 영역 @@@@@@@ */
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

/* @@@@@@@@ 소셜 로그인 DIV 영역 @@@@@@@ */

.social-login-div {
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-content: center;
}

.social-login-img {
  width: clamp(18rem, 25vw, 25rem);
  height: clamp(3rem, 6vh, 3.75rem);
  object-fit: contain;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.kakao-login-img {
  background: #FFDE00;
}

.naver-login-img {
  background: #03C75A;
}

.google-login-img {
  background: #F2F2F2;
}

/* @@@@@@@@ 상단 로고 및 이미지 @@@@@@@ */

.main-font-img,
.character-img {
  max-width: 100%;
  width: clamp(150px, 20vw, 280px);
  height: auto;
}

/* @@@@@@@@ 로그인 인포 @@@@@@@ */
.login-info {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.875rem;
}

.login-info a {
  color: #666;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s ease;
}

.login-info a:hover {
  color: #0052cc;
  text-decoration: underline;
}


</style>