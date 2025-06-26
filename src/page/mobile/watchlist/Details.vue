<script setup>
import {onMounted} from "vue";
import {useWatchListStore} from "@/store/useWatchListStore.js";
import {useRoute} from "vue-router";

const route = useRoute()
const watchListStore = useWatchListStore()

onMounted(async () => {
  const id = route.params.id
  await watchListStore.fetchWatchListDetail(id)
})

</script>

<template>
  <div v-if="watchListStore.selectedWatchList">
    <h2>{{ watchListStore.selectedWatchList.match.homeTeam.name }} vs {{ watchListStore.selectedWatchList.match.awayTeam.name }}</h2>
    <p>경기장: {{ watchListStore.selectedWatchList.match.stadium.name }}</p>
    <p>시간: {{ watchListStore.selectedWatchList.match.matchTime }}</p>
    <p>내용: <span v-html="watchListStore.selectedWatchList.record.content" /></p>
    <p>평점: {{ watchListStore.selectedWatchList.record.rate }}</p>
    <p>등록일: {{ watchListStore.selectedWatchList.createdAt }}</p>
  </div>
</template>

<style scoped>

</style>