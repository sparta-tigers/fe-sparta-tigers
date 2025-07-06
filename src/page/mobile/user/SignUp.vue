<script setup>
import {ref, watch} from 'vue'
import {useUserStore} from "@/store/useUserStore.js";
import {useRouter} from "vue-router";

const nickname = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const nicknameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const agreeAll = ref(false)
const agreeService = ref(false)
const agreePrivacy = ref(false)
const agreeMarketing = ref(false)

const router = useRouter();
const userStore = useUserStore()
watch([agreeService, agreePrivacy, agreeMarketing], ([s, p, m]) => {
  agreeAll.value = s && p && m
})

watch(agreeAll, (val) => {
  agreeService.value = val
  agreePrivacy.value = val
  agreeMarketing.value = val
})


const register = async () => {
  nicknameError.value = ''
  emailError.value = ''
  passwordError.value = ''
  confirmPasswordError.value = ''

  if (!nickname.value) {
    nicknameError.value = '닉네임을 입력해주세요.'
    return
  }
  if (!email.value) {
    emailError.value = '이메일을 입력해주세요.'
    return
  }
  if (!password.value) {
    passwordError.value = '비밀번호를 입력해주세요.'
    return
  }
  if (!confirmPassword.value) {
    confirmPasswordError.value = '비밀번호 확인을 입력해주세요.'

  } else if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = '비밀번호가 일치하지 않습니다.'
  }
  if (!agreeService.value || !agreePrivacy.value) {
    alert('필수 약관에 동의해주세요.')
  }
  await userStore.signUp({
    nickname: nickname.value,
    email: email.value,
    password: password.value,
  })
}
</script>

<template>
  <div class="input-container">
    <div class="input-group">
      <label>닉네임</label>
      <input v-model="nickname" class="register-input" placeholder="닉네임을 입력해주세요" type="text"/>
      <p v-if="nicknameError" class="error">{{ nicknameError }}</p>
    </div>

    <div class="input-group">
      <label>이메일</label>
      <input v-model="email" class="register-input" placeholder="이메일을 입력해주세요" type="email"/>
      <p v-if="emailError" class="error">{{ emailError }}</p>
    </div>

    <div class="input-group">
      <label>비밀번호</label>
      <input v-model="password" class="register-input" placeholder="영문자, 숫자, 특수문자 포함 8~20자" type="password"/>
      <p v-if="passwordError" class="error">{{ passwordError }}</p>
    </div>

    <div class="input-group">
      <label>비밀번호 확인</label>
      <input v-model="confirmPassword" class="register-input" placeholder="비밀번호를 확인해주세요" type="password"/>
      <p v-if="confirmPasswordError" class="error">{{ confirmPasswordError }}</p>
    </div>


    <div class="agreement-group">
      <label>
        <input v-model="agreeAll" type="checkbox"/>
        전체 동의
      </label>

      <label>
        <input v-model="agreeService" type="checkbox"/>
        [필수] 서비스 이용약관
      </label>

      <label>
        <input v-model="agreePrivacy" type="checkbox"/>
        [필수] 개인정보 처리방침
      </label>

      <label>
        <input v-model="agreeMarketing" type="checkbox"/>
        [선택] 마케팅 수신 동의
      </label>
    </div>

    <div class="auth-links">
      <span>이미 계정이 있으신가요?</span>
      <a @click="() => router.push('/login')">로그인</a>
    </div>

    <button class="register-btn" @click="register">가입하기</button>
  </div>


</template>

<style scoped>
.input-container {
  margin: 3rem auto;
  max-width: 80%;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  border: 1px solid #e5e5e5;
  padding: 2rem;
  min-width: 400px;
  border-radius: 8px;
}


.input-group {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

label {
  font-size: 0.9rem;
  color: #444;
  font-weight: bold;
}

.register-input {
  height: 44px;
  padding: 0 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  transition: all 0.2s ease-in-out;
}

input {
  outline: none;
}

input:active, input:focus {
  border: 1px solid #659287;
}

.register-btn {
  height: 48px;
  font-size: 1rem;
  background-color: #659287;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s;
}

.register-btn:hover {
  background-color: #5a8278;
}

.error {
  color: red;
  font-size: 0.875rem;
  margin-top: 4px;
}

.agreement-group {
  padding: 1rem;
  border: 1px solid #ddd;
  background: #fafafa;
}

.agreement-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #333;
}

.auth-links {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.auth-links a {
  color: #659287;
  font-weight: 600;
  text-decoration: none;
  margin: 0 6px;
  cursor: pointer;
}

</style>
