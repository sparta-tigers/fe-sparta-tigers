<script setup>
import {onMounted} from 'vue'
import {useAlarmStore} from '@/store/useAlarmStore.js'

const alarmStore = useAlarmStore()
const emit = defineEmits(['selectTeam', 'close'])

onMounted(() => {
  alarmStore.fetchTeams()
})

const teamCodeMap = {
  'NC': 'NC',
  '두산': 'OB',
  '한화': 'HH',
  'LG': 'LG',
  'KIA': 'HT',
  'SSG': 'SK',
  'KT': 'KT',
  '삼성': 'SS',
  '롯데': 'LT',
  '키움': 'WO'
}

const getTeamLogo = (teamName) => {
  const code = teamCodeMap[teamName] || 'default'
  try {
    return new URL(`/src/assets/images/team-logo-emblem/${code.toLowerCase()}_emblem.png`, import.meta.url).href
  } catch {
    return new URL(`/src/assets/images/team-logo-wordmark/default.png`, import.meta.url).href
  }
}

const selectTeam = (team) => {
  emit('selectTeam', {
    ...team,
    logoUrl: getTeamLogo(team.teamName),
    teamCode: teamCodeMap[team.teamName] || 'default'
  })
  emit('close')
}

</script>

<template>
  <div v-if="alarmStore.teams.length" class="team-list-wrapper">
    <h3>응원할 팀을 선택하세요</h3>
    <ul class="team-list-row">
      <li
          v-for="team in alarmStore.teams.slice(0, 3)"
          :key="team.id"
          class="team-item"
          @click="selectTeam(team)"
      >
        <img
            :src="getTeamLogo(team.teamName)"
            :alt="team.teamName"
            class="team-logo"
        >
      </li>
    </ul>
    <ul class="team-list-row">
      <li
          v-for="team in alarmStore.teams.slice(3, 6)"
          :key="team.id"
          class="team-item"
          @click="selectTeam(team)"
      >
        <img
            :src="getTeamLogo(team.teamName)"
            :alt="team.teamName"
            class="team-logo"
        >
      </li>
    </ul>
    <ul class="team-list-row">
      <li
          v-for="team in alarmStore.teams.slice(6, 9)"
          :key="team.id"
          class="team-item"
          @click="selectTeam(team)"
      >
        <img
            :src="getTeamLogo(team.teamName)"
            :alt="team.teamName"
            class="team-logo"
        >
      </li>
    </ul>
    <ul class="team-list-row">
      <li
          v-for="team in alarmStore.teams.slice(9, 10)"
          :key="team.id"
          class="team-item"
          @click="selectTeam(team)"
      >
        <img
            :src="getTeamLogo(team.teamName)"
            :alt="team.teamName"
            class="team-logo"
        >
      </li>
    </ul>

    <div class="close-btn-wrapper">
      <button class="close-btn" @click="$emit('close')">닫기</button>
    </div>
  </div>
</template>


<style scoped>
.team-list-wrapper {
  max-width: 500px;
  margin: 3em auto;
  padding: 2em;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.team-list-row {
  list-style: none;
  padding: 0;
  margin: 0 auto 1.5rem auto;
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.team-logo {
  height: 90px;
  width: auto;
  object-fit: contain;
}

.team-list-wrapper h3 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #222;
  font-weight: 700;
}

.team-item {
  background: #F6F1DE;
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

