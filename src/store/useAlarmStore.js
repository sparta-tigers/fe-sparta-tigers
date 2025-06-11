// stores/alarmStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/axios.js'

export const useAlarmStore = defineStore('alarm', () => {
    const alarms = ref([])
    const loading = ref(false)
    const error = ref(null)
    const teams = ref([])

    const fetchAlarms = async () => {
        loading.value = true
        error.value = null
        try {
            const response = await axios.get('/alarms', { withCredentials: true })
            alarms.value = response.data
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
            console.log(response.data)
            teams.value = response.data
        } catch (err) {
            error.value = err
            console.error('팀 목록 불러오기 실패:', err)
        } finally {
            loading.value = false
        }
    }


    return {
        alarms,
        loading,
        error,
        teams,
        fetchAlarms,
        fetchTeams,
    }
})
