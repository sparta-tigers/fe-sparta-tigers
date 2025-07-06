<template>
  <router-view />
</template>

<script setup>
import {onMounted, onUnmounted, ref} from 'vue'
import {useAlarmStore} from "@/store/useAlarmStore.js";
import {useUserStore} from "@/store/useUserStore.js";
import {useRoute, useRouter} from "vue-router";
import { watch } from 'vue'

const router = useRouter()
const userStore = useUserStore()
const alarmStore = useAlarmStore()
const route = useRoute()

const isMobile = ref(false)

function checkMobile() {
  isMobile.value = window.innerWidth <= 768
}


onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})


onMounted(async () => {
  checkMobile()
  window.addEventListener('resize', checkMobile)

  const token = localStorage.getItem('jwt_token')
  if (route.meta.requiresAuth && !token) {
    await router.push('/login')
    return
  }

  if (token && !userStore.user) {
    try {
      await userStore.getUser()
    } catch (error) {
      console.error('유저 정보 가져오기 실패:', error)
      await router.push('/login')
      return
    }
  }

  watch(
      () => userStore.user,
      (newUser) => {
        if (newUser) {
          alarmStore.connectSSE()
        }
      },
      { immediate: true }
  )
})

</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-image: url('@/assets/images/background-texture.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
}
</style>