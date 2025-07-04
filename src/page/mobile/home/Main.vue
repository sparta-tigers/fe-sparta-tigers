<template>
  <section class="layout">
    <!-- 페이지 제목 -->
    <section class="hero-section">
      <h1>스포츠의 모든 순간, 함께하자!</h1>
      <p>실시간 경기, 팬들과 소통, 굿즈 교환 등 다양한 기능을 만나보세요.</p>
      <button class="cta-btn">지금 시작하기</button>
    </section>

    <!-- 수정된 주요 기능 소개 섹션 -->
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
          <!--        <img src="@/assets/images/placeholder.png" alt="실시간 중계 예시">-->
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
          <!--        <img src="@/assets/images/placeholder.png" alt="굿즈 교환 예시">-->
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
          <!--        <img src="@/assets/images/placeholder.png" alt="알림 예시">-->
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
          <!--        <img src="@/assets/images/placeholder.png" alt="직관 기록 예시">-->
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

    <!-- 구단 순위 -->
    <section class="ranking-section">
      <h2>구단 순위</h2>
      <ul class="ranking-list">
        <li>1. 팀 A</li>
        <li>2. 팀 B</li>
        <li>3. 팀 C</li>
        <li>4. 팀 D</li>
        <li>5. 팀 E</li>
      </ul>
    </section>
  </section>
</template>

<style scoped>
.features-section {
  margin: 40px 0;
  padding: 0 20px;
}

.feature-item {
  display: flex;
  margin: 40px 0;
  gap: 20px;
  background: #fff;
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
}

.feature-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.feature-text h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 15px;
}

.feature-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 20px;
}

.feature-points {
  list-style: none;
  padding: 0;
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
@media (max-width: 768px) {
  .feature-item {
    flex-direction: column-reverse;
  }

  .feature-item.reverse {
    flex-direction: column-reverse;
  }

  .feature-image {
    min-height: 200px;
  }

  .feature-content {
    padding: 20px;
  }
}
.hero-section {
  text-align: center;
  padding: 50px 20px;
  background: linear-gradient(135deg, #e66465, #9198e5);
  border-radius: 15px;
  margin: 20px 0;
  color: white;
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.hero-section p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.cta-btn {
  background-color: #f8f9fa;
  color: #343a40;
  border: none;
  padding: 12px 30px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cta-btn:hover {
  background-color: #e2e6ea;
}

.matches-list,
.ranking-list {
  list-style: none;
  padding: 0;
  font-size: 1.1rem;
}

.matches-list li,
.ranking-list li {
  margin-bottom: 10px;
  color: #343a40;
  font-weight: 500;
}

.matches-list li:hover,
.ranking-list li:hover {
  color: #007bff;
  cursor: pointer;
}
h2 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #343a40;
  font-weight: 600;
}
.ranking-section, .today-matches-section {
  margin: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
</style>
<script setup lang="ts">
</script>