<script setup>
import hhLogo from "@/assets/images/hh-logo.png";
import htLogo from "@/assets/images/ht-logo.png";
import ktLogo from "@/assets/images/kt-logo.png";
import lgLogo from "@/assets/images/lg-logo.png";
import ltLogo from "@/assets/images/lt-logo.png";
import ncLogo from "@/assets/images/nc-logo.png";
import obLogo from "@/assets/images/ob-logo.png";
import skLogo from "@/assets/images/sk-logo.png";
import ssLogo from "@/assets/images/ss-logo.png";
import woLogo from "@/assets/images/wo-logo.png";

import {computed} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();

const props = defineProps({
  match: {
    type: Object,
    required: true,
  },
});

// 시간 포맷팅 함수
const formatTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// 경기 상태 텍스트
const getMatchStatusText = (result) => {
  switch (result) {
    case "CANCEL":
      return "경기 취소";
    case "SCHEDULED":
      return "경기 전";
    case "LIVE":
      return "진행 중";
    case "FINISHED":
      return "경기 종료";
    default:
      return "경기 전";
  }
};

// 팀 로고 이미지 매핑
const getTeamLogo = (teamCode) => {
  const logoMap = {
    HH: hhLogo,
    HT: htLogo,
    KT: ktLogo,
    LG: lgLogo,
    LT: ltLogo,
    NC: ncLogo,
    OB: obLogo,
    SK: skLogo,
    SS: ssLogo,
    WO: woLogo,
  };

  return logoMap[teamCode];
};

const homeTeamLogo = computed(() => getTeamLogo(props.match.homeTeamCode));
const awayTeamLogo = computed(() => getTeamLogo(props.match.awayTeamCode));

const navigateToLiveBoardRoom = () => {
  router.push(`/liveboard/match/room/${props.match.matchId}`);
};
</script>

<template>
  <li class="match-item" @click="navigateToLiveBoardRoom">
    <div class="logo-wrapper home">
      <img
          :alt="match.homeTeamName + '로고'"
          :src="homeTeamLogo"
          class="team-logo"
      />
    </div>

    <div class="match-summary">
      <div class="position">{{ match.position }}</div>
      <div class="match-time">{{ formatTime(match.startedAt) }}</div>
      <div class="connect-count">관중 수: {{ match.connectCount }}</div>
      <div class="match-result">
        <span class="text">{{ match.matchResult }}</span>
      </div>
    </div>

    <div class="logo-wrapper away">
      <img
          :alt="match.away_team_name + '로고'"
          :src="awayTeamLogo"
          class="team-logo"
      />
    </div>
  </li>
</template>

<style scoped>
.match-item {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  position: relative;
  background: #ffffff;
  padding: 0 20px;
  margin-bottom: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  list-style: none;

  cursor: pointer;
  border-bottom: 1px solid #333333;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.team-logo {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

.logo-wrapper.home .team-logo {
  width: 81px;
  height: 64px;
}

.logo-wrapper.away .team-logo {
  width: 75px;
  height: 60px;
}

.match-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  min-width: 120px;
  position: relative;
}

.position {
  color: #659287;
  font-family: "KBO Dia Gothic-Medium", Helvetica;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 4px;
  position: relative;
}

.match-time {
  color: #000000;
  font-family: "Poppins-SemiBold", Helvetica;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 8px;
  z-index: 2;
  position: relative;
}

.connect-count {
  color: #000000;
  font-family: "KBO Dia Gothic-Medium", Helvetica;
  font-size: 12px;
  margin-bottom: 8px;
  font-weight: 500;
}

.match-result {
  background-color: #deaa79;
  text-align: center;
  padding: 4px 8px;
  border-radius: 8px;
}

.match-result .text {
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  font-family: "KBO Dia Gothic-Medium", Helvetica;
}
</style>
