<template>
  <div class="p-4 max-w-md mx-auto text-center">
    <h1 class="text-2xl font-bold mb-4">🔔 알림 테스트 페이지</h1>
    <div v-if="connected" class="text-green-600 mb-2">✅ SSE 연결됨</div>
    <div v-else class="text-red-600 mb-2">❌ SSE 연결 안됨</div>

    <button @click="sendAlarm" class="bg-blue-500 text-white px-4 py-2 rounded mb-4">
      수동 알림 보내기
    </button>

    <div v-if="messages.length > 0" class="bg-gray-100 p-4 rounded shadow">
      <h2 class="text-lg font-semibold mb-2">📨 받은 알림</h2>
      <ul class="text-left space-y-1">
        <li v-for="(msg, index) in messages" :key="index">- {{ msg }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios.js'

const connected = ref(false)
const messages = ref([])

// 오디오 객체 생성
const alarmAudio = new Audio('/audio/alarm-sound.mp3') // 본인 알람 오디오 경로로 변경

// 알림 권한 요청 함수
const requestNotificationPermission = async () => {
  if (Notification.permission === 'default') {  // 아직 허용/거부 안한 상태
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      alert('알림 권한이 필요합니다. 알림 기능이 제한됩니다.')
    }
  } else if (Notification.permission === 'denied') {
    alert('브라우저 설정에서 알림 권한을 허용해주세요.')
  }
}

// 알람 소리 재생 함수
const playAlarmAudio = () => {
  alarmAudio.play().catch(err => {
    console.warn('오디오 재생 실패:', err)
  })
}

onMounted(() => {
  requestNotificationPermission()

  const eventSource = new EventSource('http://localhost:8080/api/alarms/sse/subscribe', {
    withCredentials: true
  })

  eventSource.addEventListener('connect', e => {
    connected.value = true
    console.log('SSE 연결 성공:', e.data)
  })

  eventSource.addEventListener('alarm', e => {
    console.log('📢 알림 수신:', e.data)
    messages.value.push(e.data)

    // Notification 띄우기
    if (Notification.permission === 'granted') {
      new Notification('알림', {body: e.data})
    }

    playAlarmAudio()
  })

  eventSource.onerror = e => {
    console.error('SSE 에러:', e)
    connected.value = false
    eventSource.close()
  }
})

const sendAlarm = async () => {
  try {
    const res = await axios.post('/alarms/send')
    alert(res.data)
  } catch (err) {
    alert('알람 전송 실패')
  }
}
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
}
</style>
