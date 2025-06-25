<script setup>
import {ref, onMounted, computed} from 'vue'
import {useWatchListStore } from '@/store/useWatchListStore.js'
import { useRouter } from 'vue-router'
import { stripHtml, formatMatchTime, formatStars } from '@/utils'

const router = useRouter()
const goToDetail = (id) => {
  router.push({ name: 'record-details', params: { id } })
}
const goToRecordWrite = () => {
  router.push({ name: 'record-write' })

}
const goToPage = (targetPage) => {
  page.value = targetPage
  watchListStore.fetchWatchList(page.value, size)
}


const watchListStore = useWatchListStore()

const page = ref(0)
const size = 10

const totalPages = computed(() => {
  const val = watchListStore.totalPages
  return typeof val === 'number' && val > 0 ? val : 1
})

onMounted(() => {
  watchListStore.fetchWatchList(page.value, size)
})

const isEmpty = computed(() => {
  return !watchListStore.watchList || watchListStore.watchList.length === 0
})
</script>

<template>
  <div class="container">
    <div class="register-container">
      <button class="register-btn" @click="goToRecordWrite">기록 등록 하기</button>
    </div>

    <div v-if="watchListStore.loading" class="loading">불러오는 중...</div>

    <div v-else>
      <div v-if="isEmpty" class="empty">경기 기록이 없습니다.</div>

      <div
          v-else
          v-for="item in watchListStore.watchList"
          :key="item.id"
          class="record-card"
          @click="goToDetail(item.id)"
      >
        <p class="match-created-at">
          등록일자: {{ formatMatchTime(item.createdAt) }}
        </p>

        <p class="match-title">
          {{ item.match.homeTeam.name }} vs {{ item.match.awayTeam.name }}
        </p>
        <p class="match-info">경기장: {{ item.match.stadium.name }}</p>
        <p class="match-info">시간: {{ formatMatchTime(item.match.matchTime) }}</p>
        <p class="match-content">내용: {{ stripHtml(item.record.content) }}</p>
        <p class="match-rate">평점: {{ formatStars(item.record.rate) }}</p>
      </div>
    </div>

    <div class="pagination">
      <button
          v-for="n in totalPages"
          :key="n"
          @click="goToPage(n - 1)"
          :class="['page-number', { active: page === n - 1 }]"
      >
        {{ n }}
      </button>
    </div>
  </div>
</template>


<style>
.container {
  max-width: 700px;
  margin: 0 auto;
  padding: 24px;
  font-family: 'Arial', sans-serif;
}

.title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.loading,
.empty {
  text-align: center;
  color: #777;
  margin-top: 20px;
}

.record-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 2px 2px 6px rgba(0,0,0,0.05);
  transition: box-shadow 0.2s ease;
}

.record-card:hover {
  box-shadow: 4px 4px 12px rgba(0,0,0,0.1);
}

.match-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.match-info {
  font-size: 14px;
  color: #555;
  margin-bottom: 4px;
}

.match-content {
  font-size: 15px;
  margin-top: 8px;
}

.match-rate {
  font-size: 14px;
  color: #e0a800;
  font-weight: bold;
  margin-top: 4px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.page-number {
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #f7f7f7;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-number:hover {
  background-color: #eaeaea;
}

.page-number:active {
  background-color: #4a90e2;
  color: white;
  border-color: #4a90e2;
}

.register-container {
  text-align: center;
  margin: 20px 0;
}

.register-btn {
  background-color: #28a745; /* 초록색 */
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.25s ease;
  box-shadow: 0 2px 5px rgba(40, 167, 69, 0.5);
}

.register-btn:hover {
  background-color: #218838; /* 조금 더 진한 초록 */
  box-shadow: 0 4px 10px rgba(33, 136, 56, 0.6);
}

.register-btn:active {
  background-color: #1e7e34;
  box-shadow: none;
  transform: translateY(1px);
}



</style>
