// stores/alarmStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/axios.js'
import router from "@/router/router.js";
import {ApiError} from "@/utils/ApiError.js";

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
            alert('알림이 등록되었습니다!' + preBookingMinute)
            await router.push('/');
        } catch (err) {
            console.error('알림 등록 실패:', err)
            alert('알림 등록에 실패했습니다.')
        }
    }

    const connectSSE = () => {
        try {
            // 중복 연결 방지
            if (eventSource && sseConnected.value) {
                console.warn('⚠️ SSE 이미 연결됨')
                return
            }

            // 기존 연결 닫기
            if (eventSource) {
                eventSource.close()
                eventSource = null
            }

            // JWT 확인
            const token = localStorage.getItem('jwt_token')
            if (!token) {
                console.warn('❌ JWT 토큰 없음, SSE 연결 취소')
                return
            }

            eventSource = new EventSource(`${baseURL}/api/alarms/sse/subscribe?token=${token}`)

            eventSource.onopen = () => {
                sseConnected.value = true
            }

            eventSource.onerror = (err) => {
                sseConnected.value = false

                if (eventSource) {
                    eventSource.close()
                    eventSource = null
                }
            }


            eventSource.addEventListener('alarm', async (event) => {
                try {
                    alert('⏰ 알람 도착: ' + event.data)
                    await fetchAlarms?.()
                } catch (e) {
                    console.error('❌ alarm 이벤트 처리 중 오류:', e)
                }
            })

        } catch (error) {
            ApiError(error);

            if (eventSource) {
                eventSource.close()
                eventSource = null
            }
            sseConnected.value = false
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
        connectSSE
    }
})
