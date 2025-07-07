<script setup>

</script>

<template>
  <div class="stadium-info">
    <div  class="not-available">
      <div class="no-matches-icon">⚾</div>
      <div class="no-matches-text">아직 준비 중인 기능입니다 😭</div>
      <div class="no-matches-subtext">빠른 시일 내에 업데이트 하도록 노력할게요 !</div>
    </div>
  </div>
</template>

<style scoped>
.not-available {
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