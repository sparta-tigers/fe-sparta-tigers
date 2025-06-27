<script setup>
import {ref} from 'vue';
import DatePicker from "@/components/live-board/DatePicker.vue";
import MatchList from "@/components/live-board/MatchList.vue";

const selectedDate = ref(new Date());

const handleDateSelected = (date) => {
  selectedDate.value = date;
};
</script>

<template>
  <div class="live-board-content">
    <DatePicker @date-selected="handleDateSelected"/>
    <MatchList :selected-date="selectedDate"/>
  </div>
</template>

<style scoped>
.live-board-content {
  height: 100%;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none; /* Firefox */
}
</style>
