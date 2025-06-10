import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/axios.js'
import router from "@/router/router.js";

export const useUserStore = defineStore('user', () => {
    const user = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const getUser = async () => {
        loading.value = true
        error.value = null
        try {
            const response = await axios.get('/users/me', {
                withCredentials: true,
            })
            user.value = response.data
        } catch (err) {
            error.value = err
            console.error(err)
        } finally {
            loading.value = false
        }
    }

    const logout = async () => {
        loading.value = true
        error.value = null
        try {
            await axios.post('/users/logout', null, { withCredentials: true })
            user.value = null
            localStorage.removeItem('jwt_token')
            await router.push('/')
        } catch (err) {
            error.value = err
            console.error('로그아웃 실패', err)
        } finally {
            loading.value = false
        }
    }
    return {
        user,
        loading,
        error,
        getUser,
        logout
    }
})
