<template>
  <router-view />
  <MainFooter v-if="!isMobile"></MainFooter>
</template>

<script setup>
import MainFooter from './layout/MainFooter.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import {useAlarmStore} from "@/store/useAlarmStore.js";
import {useUserStore} from "@/store/useUserStore.js";
const userStore = useUserStore()

const isMobile = ref(false)

function checkMobile() {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
onMounted(async () => {
})

const alarmStore = useAlarmStore()

onMounted(async () => {
  alarmStore.connectSSE();
  await userStore.getUser()

})

</script>
