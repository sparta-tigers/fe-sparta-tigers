<script setup>
import { useUserStore } from '@/store/useUserStore.js'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()
const store = useUserStore()

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')

  if (token) {
    sessionStorage.setItem('jwt_token', token)
    await store.getUser()  // 이 부분이 핵심!
    await router.push('/')
  } else {
    alert("로그인에 실패했습니다.")
    await router.push('/login')
  }
})

</script>

<template>
</template>
