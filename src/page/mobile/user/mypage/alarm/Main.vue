<script setup>
import { onMounted } from 'vue'
import { useAlarmStore } from '@/store/useAlarmStore.js'

const alarmStore = useAlarmStore()

onMounted(() => {
  alarmStore.fetchAlarms()
})
</script>

<template>
  <section class="alarm-section">
    <div class="alarm-span">
      <span>내 알람</span>
    </div>

    <div class="alarm-list-div">
      <template v-if="alarmStore.loading">불러오는 중...</template>
      <template v-else-if="alarmStore.error">에러 발생: {{ alarmStore.error.message }}</template>
      <template v-else-if="alarmStore.alarms.length === 0">알람이 없습니다.</template>
      <div v-else class="alarm-card-container">
        <div
            class="alarm-card"
            v-for="alarm in alarmStore.alarms"
            :key="alarm.reservationTime"
        >
          <h3>{{ alarm.homeTeam }} <span class="vs">vs</span> {{ alarm.awayTeam }}</h3>
          <p><strong>경기장:</strong> {{ alarm.stadium }}</p>
          <p><strong>경기 시간:</strong> {{ formatDateTime(alarm.matchTime) }}</p>
          <p><strong>선예매 알람 시간:</strong> {{ formatAlarmTime(alarm.preReservationTime) }}</p>
          <p><strong>알람 시간:</strong> {{ formatAlarmTime(alarm.reservationTime) }}</p>
        </div>
      </div>
    </div>

    <div class="alarm-register-div">
      <button @click="goToTeams">
        알림 등록하러 가기
      </button>
    </div>
  </section>
</template>


<script>
import router from "@/router/router.js";

function goToTeams() {
  router.push('/alarm/teams')
}


function formatDateTime(dateTime) {
  if (!dateTime) return '-'
  const dt = new Date(dateTime)
  if (isNaN(dt)) return dateTime // 변환 실패 시 원본 반환
  return dt.toLocaleString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
}

function formatAlarmTime(dateTimeStr) {
  if (!dateTimeStr) return '-'
  const dt = new Date(dateTimeStr)
  if (isNaN(dt)) return dateTimeStr // 변환 실패 시 원본 반환
  // 시간과 분만 두 자리 숫자로 추출
  const hours = dt.getHours().toString().padStart(2, '0')
  const minutes = dt.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}


</script>

<style scoped>
.alarm-section {
  display: flex;
  flex-direction: column;
  gap: 2em;
  padding: 1em;
}
.alarm-span {
  font-size: 1.8em;
  text-align: center;
  font-weight: bold;
}
.alarm-list-div {
  display: flex;
  justify-content: center;
}
.alarm-card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1em;
  width: 100%;
  max-width: 1000px;
}
.alarm-card {
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 1.2em;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  text-align: left;
}
.alarm-card h3 {
  margin-bottom: 0.5em;
  color: #333;
}
.alarm-card p {
  margin: 0.3em 0;
  color: #555;
}
.alarm-register-div {
  text-align: center;
  margin-top: 1.5em;
}
.alarm-register-div button {
  padding: 0.6em 1.2em;
  font-size: 1em;
  border: none;
  border-radius: 8px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
}

</style>
