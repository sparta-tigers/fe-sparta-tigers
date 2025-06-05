<template>
  <div class="page-layout">
    <div class="main-floating">
      <MobileLayout />
    </div>
  </div>
</template>

<script setup>
import MobileLayout from '../layout/MobileLayout.vue'
</script>

<style scoped>
.page-layout {
  background: red;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.main-floating {
  background-color: white;
  width: 100%;
  max-width: 800px;
  height: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}
</style>
