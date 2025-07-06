<script setup>
import {useUserStore} from "@/store/useUserStore.js";
import {ref} from "vue";
import {useRouter} from "vue-router";
import GoogleLoginIcon from "@/components/shard/GoogleLoginIcon.vue";
import KakaoLoginIcon from "@/components/shard/KakaoLoginIcon.vue";

const store = useUserStore()
const baseURL = import.meta.env.VITE_HTTP_BASE_URL


const router = useRouter()

const goToSignup = () => {
  router.push({name: 'sign-up'})
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
      <div class="form-title">
        <h2>로그인</h2>
      </div>

      <input v-model="email" placeholder="이메일 또는 아이디" type="text"/>
      <input v-model="password" placeholder="비밀번호" type="password"/>

      <button class="login-btn" @click="login">로그인</button>

      <div class="auth-links">
        <span>계정이 없으신가요?</span>
        <a @click="goToSignup">회원가입</a>
      </div>

      <div class="divider"></div>

      <div class="social-login-btn-wrapper">
        <a :href="`${baseURL}/oauth2/authorization/google`" class="social-login-btn">
          <GoogleLoginIcon/>
        </a>
        <a :href="`${baseURL}/oauth2/authorization/kakao`" class="social-login-btn kakao-btn">
          <KakaoLoginIcon/>
        </a>
      </div>

    </div>


  </div>
</template>

<style scoped>
/* @@@@@@@@ 상단 이미지 및 로고 @@@@@@@ */
.instruction-div {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 24px;
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
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  min-width: 400px;
  padding: 2rem;
  background-color: #fff;
}

.login-form input {
  width: 100%;
  height: 50px;
  padding: 0 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.login-btn {
  height: 45px;
  background-color: #659287;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.login-btn:hover {
  background-color: #5a8278;
}

input {
  outline: none;
}

input:active, input:focus {
  border: 1px solid #659287;
}

/* @@@@@@@@ 아이디 비밀번호 회원가입 영역 @@@@@@@ */
.auth-links {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-top: 8px;
}

.auth-links a {
  color: #659287;
  font-weight: 600;
  text-decoration: none;
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

/* 김정민 코드 추가 */

.form-title {
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-login-btn-wrapper {
  display: flex;
  flex-direction: row;
  gap: 12px;
  justify-content: center;
}

.social-login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  border: 2px solid #e2e8f0;
  background-color: white;
}

.social-login-btn:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.social-login-btn-wrapper .kakao-btn {
  background-color: #fee500;
  border-color: #fee500;
}

.social-login-btn-wrapper .kakao-btn:hover {
  background-color: #ffeb3b;
  border-color: #ffeb3b;
}

.divider {
  height: 1px;
  border-bottom: 1px solid lightgray;
  margin: 4px 0;
}

</style>