<script setup>

import MatchItem from "@/components/live-board/MatchItem.vue";

const matches = [
  {
    "match_id": 363,
    "away_team_name": "SSG",
    "away_team_code": "SK",
    "home_team_name": "LG",
    "home_team_code": "LG",
    "match_time": "2025-06-12 18:30:00.000000",
    "match_result": "CANCEL",
    "position": "잠실"
  },
  {
    "match_id": 364,
    "away_team_name": "롯데",
    "away_team_code": "LT",
    "home_team_name": "KT",
    "home_team_code": "KT",
    "match_time": "2025-06-12 18:30:00.000000",
    "match_result": "CANCEL",
    "position": "수원"
  },
  {
    "match_id": 365,
    "away_team_name": "삼성",
    "away_team_code": "SS",
    "home_team_name": "KIA",
    "home_team_code": "HT",
    "match_time": "2025-06-12 18:30:00.000000",
    "match_result": "CANCEL",
    "position": "광주"
  },
  {
    "match_id": 366,
    "away_team_name": "NC",
    "away_team_code": "NC",
    "home_team_name": "키움",
    "home_team_code": "WO",
    "match_time": "2025-06-12 18:30:00.000000",
    "match_result": "CANCEL",
    "position": "고척"
  },
  {
    "match_id": 367,
    "away_team_name": "두산",
    "away_team_code": "OB",
    "home_team_name": "한화",
    "home_team_code": "HH",
    "match_time": "2025-06-12 18:30:00.000000",
    "match_result": "CANCEL",
    "position": "대전(신)"
  }
]

</script>

<template>
  <ul class="match-list">
    
    <MatchItem
        v-for="match in matches"
        :key="match.match_id"
        :match="match"
    />
  </ul>
  <div class="match-list">

  </div>
</template>

<style scoped>
.match-list {
  display: flex;
  flex-direction: column;
}
</style>