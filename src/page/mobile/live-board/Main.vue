<template>
  <div class="live-board-content">
    <DatePicker/>
    <MatchList/>
  </div>
</template>

<style scoped>

.live-board-content {
  height: 100%;
}
</style>

<script>
import DatePicker from '@/components/live-board/DatePicker.vue'
import MatchList from "@/components/live-board/MatchList.vue";

export default {
  name: 'LiveBoardMain',
  components: {
    DatePicker,
    MatchList,
  }
}
</script>