<script setup>
import { computed, onMounted } from "vue";
import { useFavoriteTeamStore } from "@/store/useFavoriteTeamStore.js";
import { useWatchListStore } from "@/store/useWatchListStore.js";
import { Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import {useRouter} from "vue-router";
const router = useRouter()

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const favoriteStore = useFavoriteTeamStore()
const watchListStore = useWatchListStore()

onMounted(async () => {
  await favoriteStore.fetchFavoriteTeam()

  if (!favoriteStore.favoriteTeam) {
    const goToMyPage = confirm('응원팀이 등록되어 있지 않습니다.\n마이페이지에서 먼저 등록하시겠습니까?')
    if (goToMyPage) {
      await router.push({name: 'my-page'})
    } else {
      router.back()
    }
    return
  }

  await watchListStore.fetchStatistics()
})

const favoriteTeam = computed(() => favoriteStore.favoriteTeam);

const chartData = computed(() => {
  return {
    labels: ['승', '무', '패'],
    datasets: [
      {
        data: [
          watchListStore.statistics.win,
          watchListStore.statistics.draw,
          watchListStore.statistics.lose
        ],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
        borderWidth: 2,
        hoverOffset: 10
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  cutout: '65%',
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}
</script>

<template>
  <div class="statistics-container">
    <div class="team-info">
      <h3>내가 응원하는 팀</h3>
      <p v-if="favoriteTeam">팀 이름: {{ favoriteTeam.teamName }}</p>
      <p v-else>불러오는 중...</p>
    </div>

    <div class="chart-section">
      <h3>승 / 무 / 패 비율</h3>
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>

    <div class="summary">
      <p>총 경기수: {{ watchListStore.statistics.total }}</p>
      <p>승률: {{ watchListStore.statistics.winRate }}%</p>
      <p>가장 많이 방문한 경기장: {{ watchListStore.statistics.mostVisitedStadium ?? '정보 없음' }}</p>
      <p>최고 승률 경기장: {{ watchListStore.statistics.bestWinRateStadium ?? '정보 없음' }}</p>
    </div>
  </div>
</template>

<style scoped>
.statistics-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 1rem;
  text-align: center;
}

.chart-section {
  margin: 2rem 0;
}

.summary {
  font-size: 1rem;
  color: #333;
  line-height: 1.6;
}

.team-info {
  margin-bottom: 1rem;
}
</style>
