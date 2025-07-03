<script setup>
import {onMounted, ref, watch} from "vue";
import instance from '@/axios.js'
import MatchItem from "@/components/live-board/MatchItem.vue";

const props = defineProps({
  selectedDate: {
    type: Date,
    required: true
  }
});

const matches = ref([])

const formatDateForAPI = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

const fetchMatches = async () => {
  const formattedDate = formatDateForAPI(props.selectedDate);
  console.log(formattedDate);
  try {
    const response = await instance.get(`/liveboard/room?date=${formattedDate}`)
    matches.value = response.data;
  } catch (e) {
    alert('경기 데이터 조회중 문제가 발생했습니다! 잠시후 다시 시도 해주세요!');
    return;
  }
}

onMounted(async () => {
  await fetchMatches();
});

watch(() => props.selectedDate, async () => {
  await fetchMatches();
});

</script>

<template>
  <div class="match-list">
    <div v-if="matches.length === 0" class="no-matches">
      <div class="no-matches-icon">⚾</div>
      <div class="no-matches-text">오늘은 경기가 없어요 😭</div>
      <div class="no-matches-subtext">다른 날짜를 선택해보세요!</div>
    </div>

    <ul v-else class="matches-container">
      <MatchItem
          v-for="match in matches"
          :key="match.match_id"
          :match="match"
      />
    </ul>
  </div>
</template>

<style scoped>
.match-list {
  display: flex;
  flex-direction: column;
}

.matches-container {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.no-matches {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background-color: #faf6e9;
  margin: 20px;
  border-radius: 12px;
  border: 2px dashed #d4af37;
  height: 100%;
}

.no-matches-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.no-matches-text {
  font-family: "NanumSquare_ac-ExtraBold", Helvetica;
  font-size: 18px;
  font-weight: 800;
  color: #212121;
  margin-bottom: 8px;
}

.no-matches-subtext {
  font-family: "KBO Dia Gothic-Medium", Helvetica;
  font-size: 14px;
  font-weight: 500;
  color: #979797;
}
</style>