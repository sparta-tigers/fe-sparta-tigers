<script setup>
import { onMounted } from 'vue'
import { useAlarmStore } from '@/store/useAlarmStore.js'

const alarmStore = useAlarmStore()

onMounted(() => {
  alarmStore.fetchTeams()
})
</script>

<template>
  <div v-if="alarmStore.teams.length" class="team-list-wrapper">
    <h3>전체 팀 목록</h3>
    <ul class="team-list">
      <router-link
          v-for="team in alarmStore.teams"
          :key="team.id"
          :to="`/mypage/alarm/teams/${team.id}/schedule`"
          custom
          v-slot="{ navigate }"
      >
        <li class="team-item" @click="navigate" style="cursor: pointer;">
          {{ team.teamName }}
        </li>
      </router-link>
    </ul>

  </div>
</template>

<style scoped>
.team-list-wrapper {
  max-width: 400px;
  margin: 2em auto;
  padding: 1.5em 2em;
  background-color: #fefefe;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  text-align: center;
}

.team-list-wrapper h3 {
  font-size: 1.8rem;
  margin-bottom: 1em;
  color: #333;
  font-weight: 700;
}

.team-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(120px,1fr));
  gap: 12px;
}

.team-item {
  background-color: #4caf50;
  color: white;
  padding: 0.7em 1em;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: default;
  transition: background-color 0.25s ease;
  user-select: none;
}

.team-item:hover {
  background-color: #388e3c;
}
</style>

