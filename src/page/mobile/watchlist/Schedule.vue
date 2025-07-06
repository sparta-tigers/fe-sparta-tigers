<script setup>
import {ref, computed, onMounted, watch} from 'vue'
import {useAlarmStore} from "@/store/useAlarmStore.js";
import {useRoute} from "vue-router";
import router from "@/router/router.js";

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth())
const now = ref(new Date())

const monthLabel = computed(() => {
  return `${currentYear.value}년 ${currentMonth.value + 1}월`
})

// 해당 월의 날짜 배열 만들기
const getMonthDays = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()
  const days = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let d = 1; d <= lastDate; d++) {
    days.push(d)
  }

  return days
}

const days = computed(() => getMonthDays(currentYear.value, currentMonth.value))

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
  if (day === null) return '' // 또는 null 반환도 가능
  const mm = (month + 1).toString().padStart(2, '0')
  const dd = day.toString().padStart(2, '0')
  return `${year}-${mm}-${dd}`
}


const formatTime = (dateTime) => {
  return dateTime.slice(11, 16)
}


const alarmStore = useAlarmStore()
const route = useRoute()
const teamId = route.params.teamId;

onMounted(() => {
  alarmStore.fetchSchedules(teamId, currentYear.value, currentMonth.value + 1)
});

watch([currentYear, currentMonth], () => {
  alarmStore.fetchSchedules(teamId, currentYear.value, currentMonth.value + 1)
});
function selectMatch(schedule) {
  const data = {
    matchId: schedule.matchId,
    homeName: schedule.homeName,
    awayName: schedule.awayName,
    matchDate: schedule.matchTime,
    stadiumName: schedule.stadiumName
  };

  window.opener.postMessage(data, '*');  // 부모창에 데이터 전달
  window.close();  // 팝업 닫기
}

const getResultLabelForDate = (date) => {
  const schedulesOnDate = scheduleMap.value.get(date) || []
  // 우선순위: H(홈승) > A(어웨이승) > D(무승)
  if (schedulesOnDate.some(s => s.matchResult === 'HOME_WIN')) return 'H'
  if (schedulesOnDate.some(s => s.matchResult === 'AWAY_WIN')) return 'A'
  if (schedulesOnDate.some(s => s.matchResult === 'DRAW')) return 'D'
  return ''
}


</script>

<template>
  <div class="calendar-container">

  </div>
  <div class="calendar-header">
    <button class="calendar-move" @click="goPrevMonth">
      이전
    </button>
    <h2>{{ monthLabel }}</h2>
    <button class="calendar-move" @click="goNextMonth">
      다음
    </button>
  </div>

  <div class="calendar-grid">
    <div class="day-name" v-for="day in ['일','월','화','수','목','금','토']" :key="day">{{ day }}</div>

    <div
        v-for="(date, idx) in days"
        :key="idx"
        class="calendar-cell"
        :class="{ empty: date === null }"
    >
      <div class="date-header" v-if="date">
        <span class="date-number">{{ date }}</span>
        <span
            class="date-label"
            :class="getResultLabelForDate(formatDate(currentYear, currentMonth, date))"
        >
  {{ getResultLabelForDate(formatDate(currentYear, currentMonth, date)) }}
</span>
      </div>

      <div
          v-for="schedule in scheduleMap.get(formatDate(currentYear, currentMonth, date)) || []"
          :key="schedule.homeId + '-' + schedule.awayId + '-' + schedule.matchTime"
          class="match-item"
          @click="selectMatch(schedule)"
      >

      <img :src="schedule.awayTeamPath" alt="Away Team Logo" class="team-logo"/>

        <div class="match-text">
          <div v-if="new Date(schedule.matchTime) < now">
            {{ schedule.homeScore }}
            <span v-if="schedule.matchResult !== 'DRAW'"> : </span>
            {{ schedule.awayScore }}
            <span
                v-if="schedule.matchResult"
                class="result-circle"
                :class="{
      win: schedule.matchResult === 'HOME_WIN',
      lose: schedule.matchResult === 'AWAY_WIN',
      draw: schedule.matchResult === 'DRAW'
    }"
            >
    {{
                schedule.matchResult === 'HOME_WIN'
                    ? '승'
                    : schedule.matchResult === 'AWAY_WIN'
                        ? '패'
                        : '무'
              }}
  </span>
          </div>
          <div v-else>
            {{ formatTime(schedule.matchTime) }}
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<style scoped>
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
  background-color: #3b82f6; /* 파란색 */
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

.team-logo {
  width: 10vw;
  max-width: 80px;
}

.result-circle {
  display: inline-block;
  width: 1.8em;
  height: 1.8em;
  line-height: 1.8em;
  border-radius: 50%;
  text-align: center;
  color: white;
  font-weight: bold;
  font-size: 0.8rem;
  margin-top: 4px;
}

.result-circle.win {
  background-color: #ef4444; /* 파랑 */
}

.result-circle.lose {
  background-color: #3b82f6; /* 빨강 */

}

.result-circle.draw {
  background-color: #6b7280; /* 회색 */
}

.date-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  font-size: 0.85rem;
  margin-bottom: 0.3rem;
}

.date-number {
  text-align: center;
  font-weight: bold;
}

.date-label {
  font-weight: bold;
  font-size: 0.85rem;
  user-select: none;
}

.date-label.H {
  color: #ef4444; /* 빨강 */

}

.date-label.A {
  color: #3b82f6; /* 파랑 */


}

.date-label.D {
  color: #6b7280; /* 회색 */
}

</style>
