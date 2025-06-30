<script setup>
import {ref, watch} from 'vue'
import {useUserStore} from "@/store/useUserStore.js";

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
        <input class="register-input" v-model="nickname" type="text" placeholder="닉네임을 입력해주세요"/>
        <p class="error" v-if="nicknameError">{{ nicknameError }}</p>
      </div>

      <div class="input-group">
        <label>이메일</label>
        <input class="register-input" v-model="email" type="email" placeholder="이메일을 입력해주세요"/>
        <p class="error" v-if="emailError">{{ emailError }}</p>
      </div>

      <div class="input-group">
        <label>비밀번호</label>
        <input class="register-input" v-model="password" type="password" placeholder="영문자, 숫자, 특수문자 포함 8~20자"/>
        <p class="error" v-if="passwordError">{{ passwordError }}</p>
      </div>

      <div class="input-group">
        <input class="register-input" v-model="confirmPassword" type="password" placeholder="비밀번호를 확인해주세요"/>
        <p class="error" v-if="confirmPasswordError">{{ confirmPasswordError }}</p>
      </div>


      <div class="agreement-group">
        <label>
          <input type="checkbox" v-model="agreeAll" />
          전체 동의
        </label>

        <label>
          <input type="checkbox" v-model="agreeService" />
          [필수] 서비스 이용약관
        </label>

        <label>
          <input type="checkbox" v-model="agreePrivacy" />
          [필수] 개인정보 처리방침
        </label>

        <label>
          <input type="checkbox" v-model="agreeMarketing" />
          [선택] 마케팅 수신 동의
        </label>
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
}

.register-input {
  height: 44px;
  padding: 0 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  transition: all 0.2s ease-in-out;
}

input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
}

.register-btn {
  height: 48px;
  font-size: 1rem;
  background: linear-gradient(135deg, #4a90e2, #007aff);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s;
}

.register-btn:hover {
  background: linear-gradient(135deg, #357ab8, #0062cc);
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

</style>
