<template>
  <router-view />
</template>

<script setup>
import {onMounted, onUnmounted, ref} from 'vue'
import {useAlarmStore} from "@/store/useAlarmStore.js";
import {useUserStore} from "@/store/useUserStore.js";
import {useRouter} from "vue-router";
const router = useRouter()
const userStore = useUserStore()

const isMobile = ref(false)

function checkMobile() {
  isMobile.value = window.innerWidth <= 768
}


onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})


const alarmStore = useAlarmStore()

onMounted(async () => {
  checkMobile()
  window.addEventListener('resize', checkMobile)

  const token = localStorage.getItem('jwt_token')
  if (!token) {
    await router.push('/login')
    return
  }

  if (!userStore.user) {
    await userStore.getUser()
  }

  if (!userStore.user) {
    // 유저 정보 못가져오면 로그인 페이지 이동
    await router.push('/login')
    return
  }

  alarmStore.connectSSE()
})


</script>
