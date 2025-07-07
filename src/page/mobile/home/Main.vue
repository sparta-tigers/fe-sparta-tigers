<template>
  <section class="layout">
    <!-- 페이지 제목 -->
    <section class="hero-section">
      <div class="hero-div">
        <img class="brochure-logo" :src="brochureUrl" alt="브로셔 로고"/>
      </div>
    </section>

    <!-- 주요 기능 소개 섹션 -->
    <section class="features-section">
      <h2>우리의 주요 기능</h2>

      <!-- 실시간 중계 -->
      <div class="feature-item">
        <div class="feature-content left">
          <div class="feature-text">
            <h3>실시간 경기 중계</h3>
            <p class="feature-description">
              실시간으로 진행되는 경기를 생생하게 전달받으세요.
              다른 팬들과 함께 응원하고 소통하며 더욱 즐거운 경기를 만끽하세요.
            </p>
            <ul class="feature-points">
              <li>실시간 문자 중계</li>
              <li>팬들과 실시간 채팅</li>
              <li>경기 하이라이트 공유</li>
            </ul>
          </div>
        </div>
        <div class="feature-image right">
          <img class="feature-image" :src="liveboardUrl" alt="실시간 중계 예시">
        </div>
      </div>

      <!-- 굿즈 & 티켓 교환 -->
      <div class="feature-item reverse">
        <div class="feature-content right">
          <div class="feature-text">
            <h3>굿즈 & 티켓 교환</h3>
            <p class="feature-description">
              더 이상 혼자서 고민하지 마세요.
              다른 팬들과 함께 원하는 굿즈와 티켓을 교환할 수 있습니다.
            </p>
            <ul class="feature-points">
              <li>안전한 교환 시스템</li>
              <li>실시간 채팅 협의</li>
              <li>교환 이력 관리</li>
            </ul>
          </div>
        </div>
        <div class="feature-image left">
          <img class="feature-image" :src="exchangeUrl" alt="굿즈 교환 예시">
        </div>
      </div>

      <!-- 경기 예매 알림 -->
      <div class="feature-item">
        <div class="feature-content left">
          <div class="feature-text">
            <h3>경기 예매 알림</h3>
            <p class="feature-description">
              중요한 경기를 놓치지 마세요.
              원하는 경기의 예매 시작을 알림으로 받아보세요.
            </p>
            <ul class="feature-points">
              <li>맞춤형 알림 설정</li>
              <li>예매 일정 캘린더</li>
              <li>빠른 예매 링크 제공</li>
            </ul>
          </div>
        </div>
        <div class="feature-image right">
          <img class="feature-image" :src="alarmUrl" alt="알림 예시">
        </div>
      </div>

      <!-- 직관 기록 -->
      <div class="feature-item reverse">
        <div class="feature-content right">
          <div class="feature-text">
            <h3>직관 기록</h3>
            <p class="feature-description">
              현장에서 직접 본 경기의 특별한 순간을 기록하고 공유하세요.
              나만의 야구 다이어리를 만들어보세요.
            </p>
            <ul class="feature-points">
              <li>경기장 방문 기록</li>
              <li>사진 및 메모 저장</li>
              <li>추억 공유하기</li>
            </ul>
          </div>
        </div>
        <div class="feature-image left">
          <img class="feature-image" :src="watchlistUrl" alt="직관 기록 예시">
        </div>
      </div>
    </section>

    <!-- 오늘의 경기 일정 -->
    <section class="today-matches-section">
      <h2>오늘의 경기 일정</h2>
      <ul class="matches-list">
        <li>팀 A vs 팀 B - 18:00</li>
        <li>팀 C vs 팀 D - 20:00</li>
        <li>팀 E vs 팀 F - 22:00</li>
      </ul>
    </section>
  </section>
</template>

<script setup>
const brochureUrl = new URL('@/assets/images/brochure.svg', import.meta.url).href;
const liveboardUrl = new URL('@/assets/images/key-feature/liveboard.svg', import.meta.url).href;
const exchangeUrl = new URL('@/assets/images/key-feature/exchange.svg', import.meta.url).href;
const alarmUrl = new URL('@/assets/images/key-feature/alarm.svg', import.meta.url).href;
const watchlistUrl = new URL('@/assets/images/key-feature/watchlist.svg', import.meta.url).href;
</script>

<style scoped>
.hero-section {
  text-align: center;
  margin: 20px 0;
  color: white;
}

.brochure-logo {
  width: 100%;
  height: auto;
}

.features-section {
  margin: 40px 0;
  padding: 0 20px;
}

.features-section h2 {
  font-family: KBO-Dia-Gothic_bold, sans-serif;
}

.feature-item {
  display: flex;
  margin: 40px 0;
  gap: 20px;
  background: #fffdf6;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.feature-item.reverse {
  flex-direction: row-reverse;
}

.feature-content {
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.feature-image {
  flex: 1;
  min-height: 300px;
  position: relative;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  display: flex;
}

.feature-image img {
  width: 95%;
  height: 95%;
  object-fit: contain;
  display: block;
}

.feature-text h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 15px;
  font-family: GongGothicMedium, serif;
}

.feature-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 20px;
  font-family: GongGothicMedium, serif;
}

.feature-points {
  list-style: none;
  padding: 0;
  font-family: "NanumSquare_ac-ExtraBold", Helvetica, sans-serif;
  font-weight: normal;
}

.feature-points li {
  margin: 10px 0;
  padding-left: 25px;
  position: relative;
  color: #2c3e50;
}

.feature-points li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #4CAF50;
}

/* 모바일 반응형 스타일 */
@media (max-width: 480px) {
  .feature-item {
    flex-direction: column-reverse;
  }

  .feature-item.reverse {
    flex-direction: column-reverse;
  }

  .feature-content {
    padding: 20px;
  }

  .feature-image img {
    height: 60vh !important;
  }
}

.matches-list {
  list-style: none;
  padding: 0;
  font-size: 1.1rem;
}

.matches-list li {
  margin-bottom: 10px;
  color: #343a40;
  font-weight: 500;
}

.matches-list li:hover {
  color: #007bff;
  cursor: pointer;
}

h2 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #343a40;
  font-weight: 600;
}

.today-matches-section {
  margin: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
</style>