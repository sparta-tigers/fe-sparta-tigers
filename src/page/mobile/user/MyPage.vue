<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/store/useUserStore.js'

const store = useUserStore()
const route = useRoute()

const fetchUser = async () => {
  await store.getUser()
}

onMounted(fetchUser)

watch(() => route.fullPath, fetchUser)

</script>

<template>
  <div v-if="store.loading">로딩중...</div>
  <div v-else-if="store.error">에러 발생!</div>
  <div v-else-if="store.user">
    <h2>유저 정보</h2>
    <p><strong>닉네임:</strong> {{ store.user.nickname }}</p>
    <p><strong>이메일:</strong> {{ store.user.email }}</p>
  </div>
</template>
