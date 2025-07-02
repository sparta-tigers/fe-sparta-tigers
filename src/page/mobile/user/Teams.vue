<script setup>
import { onMounted } from 'vue'
import { useAlarmStore } from '@/store/useAlarmStore.js'
const alarmStore = useAlarmStore()

onMounted(() => {
  alarmStore.fetchTeams()
})
const emit = defineEmits(['selectTeam', 'close'])

const selectTeam = (team) => {
  emit('selectTeam', team)
  emit('close')
}


</script>

<template>
  <div v-if="alarmStore.teams.length" class="team-list-wrapper">
    <h3>응원할 팀을 선택하세요</h3>
    <ul class="team-list">
      <li
          v-for="team in alarmStore.teams"
          :key="team.id"
          class="team-item"
          @click="selectTeam(team)"
      >
        {{ team.teamName }}
      </li>
    </ul>

    <div class="close-btn-wrapper">
      <button class="close-btn" @click="$emit('close')">닫기</button>
    </div>
  </div>
</template>


<style scoped>.team-list-wrapper {
  max-width: 500px;
  margin: 3em auto;
  padding: 2em;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.team-list-wrapper h3 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #222;
  font-weight: 700;
}

.team-list {
  list-style: none;
  padding: 0;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 한 줄에 2개씩 */
  gap: 16px;
}

.team-item {
  background: linear-gradient(to right, #4caf50, #66bb6a);
  color: #fff;
  padding: 0.8em 1em;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  text-align: center;
  transition: transform 0.2s, background-color 0.3s;
}

.team-item:hover {
  background: linear-gradient(to right, #388e3c, #4caf50);
  transform: translateY(-2px);
}

.close-btn-wrapper {
  margin-top: 2rem;
}

.close-btn {
  padding: 0.6rem 1.2rem;
  background-color: #e53935;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.close-btn:hover {
  background-color: #c62828;
}
</style>

