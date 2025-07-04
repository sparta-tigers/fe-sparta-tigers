// stores/alarmStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/axios.js'
import router from "@/router/router.js";
import {ApiError} from "@/utils/ApiError.js";
import {useUserStore} from "@/store/useUserStore.js";

export const useAlarmStore = defineStore('alarm', () => {
    const baseURL = import.meta.env.VITE_HTTP_BASE_URL;
    const alarms = ref([])
    const loading = ref(false)
    const error = ref(null)
    const teams = ref([])
    const schedules = ref([])
    const matchDetail = ref(null)
    const sseConnected = ref(false)
    let eventSource = null
    const userStore = useUserStore()

    const fetchAlarms = async () => {
        loading.value = true
        error.value = null
        try {
            const response = await axios.get('/alarms', { withCredentials: true })
            alarms.value = response.data.data
        } catch (err) {
            error.value = err
            console.error('알람 불러오기 실패:', err)
        } finally {
            loading.value = false
        }
    }

    const fetchTeams = async () => {
        loading.value = true
        error.value = null
        try {
            const response = await axios.get('/alarms/teams', { withCredentials: true })
            teams.value = response.data.data
        } catch (err) {
            error.value = err
            console.error('팀 목록 불러오기 실패:', err)
        } finally {
            loading.value = false
        }
    }
    const fetchSchedules = async (teamId, year, month) => {
        loading.value = true
        error.value = null
        try {
            const response = await axios.get(`/alarms/teams/${teamId}/schedules`, {
                params: { year, month },
                withCredentials: true
            })
            schedules.value = response.data.data
        } catch (err) {
            error.value = err
            console.error('일정 불러오기 실패:', err)
        } finally {
            loading.value = false
        }
    }

    const fetchMatchDetail = async (matchId) => {
        loading.value = true
        error.value = null
        try {
            const response = await axios.get(`/alarms/matches/${matchId}`, {
                withCredentials: true
            })
            matchDetail.value = response.data.data
        } catch (err) {
            error.value = err
            console.error('매치 상세 불러오기 실패:', err)
        } finally {
            loading.value = false
        }
    }

    const createAlarm = async (matchId, preBookingMinute, bookingMinute) => {
        try {
            const response = await axios.post(
                `/alarms`,
                {
                    id: matchId,
                    minutes: preBookingMinute,
                    preMinutes: bookingMinute,
                },
                {
                    withCredentials: true,
                }
            )
            console.log('알림 등록 성공:', response.data.data)
            alert('알림이 등록되었습니다!')
            await router.push('/');
        } catch (err) {
            console.error('알림 등록 실패:', err)
            alert('알림 등록에 실패했습니다.')
        }
    }

    const connectSSE = () => {
        const userId = userStore.user?.id

        if (eventSource) {
            eventSource.close()
        }

        eventSource = new EventSource(`${baseURL}/api/alarms/sse/subscribe/${userId}`, {
            withCredentials: true
        })

        eventSource.onopen = () => {
            console.log('✅ SSE 연결됨')
            sseConnected.value = true
        }

        eventSource.onerror = (err) => {
            console.error('❌ SSE 에러 발생:', err)
            sseConnected.value = false
        }

        eventSource.addEventListener('connect', (event) => {
            console.log('🔔 서버로부터 초기 메시지:', event.data)
        })

        eventSource.addEventListener('testAlarm', async (event) => {

            const audio = new Audio('/audio/alarm-sound.mp3')
            audio.play().catch(e => console.warn('오디오 재생 실패:', e))
            alert('알람이 도착했습니다.')

            await fetchAlarms();
        })
    }

    const disconnectSSE = () => {
        if (eventSource) {
            eventSource.close()
            eventSource = null
            sseConnected.value = false
            console.log('SSE 연결 종료')
        }
    }




    return {
        schedules,
        teams,
        alarms,
        loading,
        error,
        matchDetail,
        eventSource,
        sseConnected,
        fetchAlarms,
        fetchTeams,
        fetchSchedules,
        fetchMatchDetail,
        createAlarm,
        connectSSE,
        disconnectSSE
    }
})
