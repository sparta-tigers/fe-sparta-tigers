<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: '취소'
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>

<template>
  <button class="cancel-btn" @click="handleClick">{{ label }}</button>
</template>

<style scoped>
.cancel-btn {
  padding: 8px 16px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.cancel-btn:hover {
  background-color: red; /* emerald-600 */
}
</style>
