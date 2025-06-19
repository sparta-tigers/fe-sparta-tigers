<script setup>
import { onMounted, ref} from 'vue'
import { useAlarmStore } from '@/store/useAlarmStore.js'
import { useRoute } from 'vue-router'

const alarmStore = useAlarmStore()
const route = useRoute()

onMounted(() => {
  const matchId = route.params.matchId
  alarmStore.fetchMatchDetail(matchId)
})

const preBookingMinute = ref('')
const bookingMinute = ref('')

const formatDate = (iso) => {
  const date = new Date(iso)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')

  const isPM = hours >= 12
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  const ampm = isPM ? '오후' : '오전'

  return `${year}. ${month}. ${day}. ${ampm} ${hour12}:${minutes}`
}

const createAlarm = () => {
  const matchId = alarmStore.matchDetail?.matchId
  if (!matchId) {
    alert('매치 정보가 없습니다.')
    return
  }

  if (preBookingMinute.value === '' && bookingMinute.value === '') {
    alert('최소 하나 이상의 값을 입력하세요.')
    return
  }

  alarmStore.createAlarm(matchId, preBookingMinute.value, bookingMinute.value)
}



</script>

<template>
  <section class="match-card">
    <!-- 매치 정보 -->
    <div v-if="alarmStore.matchDetail" class="match-info">
      <h2>{{ alarmStore.matchDetail.homeName }} vs {{ alarmStore.matchDetail.awayName }}</h2>
      <p>경기장: <strong>{{ alarmStore.matchDetail.stadiumName }}</strong></p>
      <p>시간: <strong>{{ formatDate(alarmStore.matchDetail.matchTime) }}</strong></p>
    </div>

    <div class="booking-section">
      <h3>🎟️ 알림 등록하기</h3>

      <div class="input-group">
        <label>선예매 알림 등록하기</label>
        <input type="text" v-model.number="preBookingMinute" min="0" max="59" placeholder="예: 30" />
      </div>

      <div class="input-group">
        <label>예매 알림 등록하기</label>
        <input type="text" v-model.number="bookingMinute" min="0" max="59" placeholder="예: 10" />
      </div>

      <button class="booking-btn" @click="createAlarm">알림 등록</button>
    </div>
  </section>
</template>
<style scoped>
.match-card {
  max-width: 600px;
  margin: 40px auto;
  padding: 24px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  font-family: sans-serif;
}

.match-info h2 {
  font-size: 24px;
  margin-bottom: 12px;
}

.match-info p {
  margin: 4px 0;
  color: #444;
}

.booking-section {
  margin-top: 32px;
}

.booking-section h3 {
  font-size: 20px;
  margin-bottom: 16px;
}

.input-group {
  margin-bottom: 16px;
}

.input-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
}

.input-group input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

.booking-btn {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  border: none;
  color: white;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.booking-btn:hover {
  background-color: #0056b3;
}
</style>
