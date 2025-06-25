<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAlarmStore } from "@/store/useAlarmStore.js"
import { useRoute } from "vue-router"

const emit = defineEmits(['select', 'close'])

const alarmStore = useAlarmStore()
const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth())
const route = useRoute()
const teamId = route.params.teamId

onMounted(() => {
  alarmStore.fetchSchedules(teamId, currentYear.value, currentMonth.value + 1)
})
watch([currentYear, currentMonth], () => {
  alarmStore.fetchSchedules(teamId, currentYear.value, currentMonth.value + 1)
})

const monthLabel = computed(() => `${currentYear.value}년 ${currentMonth.value + 1}월`)
const getMonthDays = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()
  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= lastDate; d++) days.push(d)
  return days
}
const days = computed(() => getMonthDays(currentYear.value, currentMonth.value))
const schedules = computed(() => alarmStore.schedules)
const scheduleMap = computed(() => {
  const map = new Map()
  schedules.value.forEach(schedule => {
    const date = schedule.matchTime.slice(0, 10)
    if (!map.has(date)) map.set(date, [])
    map.get(date).push(schedule)
  })
  return map
})
const formatDate = (year, month, day) => {
  const mm = (month + 1).toString().padStart(2, '0')
  const dd = day.toString().padStart(2, '0')
  return `${year}-${mm}-${dd}`
}
const formatTime = (dateTime) => dateTime.slice(11, 16)

const goPrevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}
const goNextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const selectMatch = (schedule) => {
  const matchId = schedule.matchId
  const matchName = `${schedule.homeName} vs ${schedule.awayName}`
  emit('select', { matchId, matchName })
  emit('close')
}
</script>

<template>
  <div class="popup-overlay">
    <div class="calendar-container">
      <div class="calendar-header">
        <button class="calendar-move" @click="goPrevMonth">이전</button>
        <h2>{{ monthLabel }}</h2>
        <button class="calendar-move" @click="goNextMonth">다음</button>
      </div>

      <div class="calendar-grid">
        <div class="day-name" v-for="day in ['일','월','화','수','목','금','토']" :key="day">{{ day }}</div>

        <div
            v-for="(date, idx) in days"
            :key="idx"
            class="calendar-cell"
            :class="{ empty: date === null }"
        >
          <span v-if="date">{{ date }}</span>
          <div v-if="date !== null" class="match-list">
            <div
                v-for="schedule in scheduleMap.get(formatDate(currentYear, currentMonth, date)) || []"
                :key="schedule.homeId + '-' + schedule.awayId + '-' + schedule.matchTime"
                class="match-item"
                @click="selectMatch(schedule)"
            >
              <div>{{ schedule.homeName }} vs {{ schedule.awayName }}</div>
              <div>{{ schedule.stadiumName }}</div>
              <div>{{ formatTime(schedule.matchTime) }}</div>
              <div v-if="schedule.matchResult">
                결과: {{ schedule.matchResult }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 1rem;">
        <button class="calendar-move" @click="$emit('close')">닫기</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

 .calendar-container {
   max-width: 600px;
   margin: 0 auto;
   padding: 0.5rem;
 }

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.calendar-header h2 {
  margin: 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}

.day-name {
  font-weight: bold;
  text-align: center;
  font-size: 1.1rem;
}

.calendar-cell {
  height: 6em;
  background: #f3f4f6;
  text-align: center;
  line-height: 2em;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.2s;
}

.calendar-cell:hover {
  background: #dbeafe;
}

.empty {
  background: transparent;
  cursor: default;
}

.calendar-move {
  background-color: #3b82f6;   /* 파란색 */
  color: white;
  padding: 0.6em 1.2em;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5em;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.calendar-move:hover {
  background-color: #2563eb;
}
.match-item {
  font-size: 0.8rem;
  line-height: 1.2;
  margin-top: 4px;
}
</style>