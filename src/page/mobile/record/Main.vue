<script setup>
import { onMounted } from 'vue'
import { useWatchListStore } from '@/store/useWatchListStore.js'

const watchListStore = useWatchListStore()

onMounted(() => {
  watchListStore.fetchWatchList(0, 10)
})
</script>

<template>
  <div>
    경기 기록
    ㅇㅇ
  </div>
  <div v-if="watchListStore.loading">불러오는 중...</div>
  <div v-else>
    <div
        v-for="item in watchListStore.watchList"
        :key="item.id"
        class="border-b py-4"
    >
      <p class="font-bold text-lg">
        {{ item.match.homeTeam.name }} vs {{ item.match.awayTeam.name }}
      </p>
      <p>경기장: {{ item.match.stadium.name }}</p>
      <p>시간: {{ new Date(item.match.matchTime).toLocaleString() }}</p>
      <p>내용: {{ item.record.content }}</p>
      <p>평점: {{ item.record.rate }}</p>
    </div>
  </div>
</template>

