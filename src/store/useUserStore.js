import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/axios.js'
import router from "@/router/router.js";

export const useUserStore = defineStore('user', () => {
    const user = ref(null)
    const loading = ref(false)
    const error = ref(null)
    const jwtToken = ref(null);
    const login = async (email, password) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await axios.post('/users/login', { email, password })

            const token = response?.data?.data?.accessToken;
            if (!token) {
                throw new Error("로그인 응답에 토큰이 없습니다.");
            }

            jwtToken.value = response.data.data.accessToken
            localStorage.setItem('jwt_token', jwtToken.value)

            const userRes = await axios.get('/users/me')
            user.value = userRes.data.data

            return true
        } catch (err) {
            console.error('전체 에러:', err)


            if (err.response && err.response.data && err.response.data.error) {
                const msg = err.response.data.error.message
                error.value = msg
            } else {
                error.value = '알 수 없는 오류가 발생했습니다.'
            }

            return false
        } finally {
            loading.value = false
        }

    };

    const getUser = async () => {
        loading.value = true
        error.value = null
        try {
            const response = await axios.get('/users/me', {
                withCredentials: true,
            })
            user.value = response.data.data
        } catch (err) {
            if(err.response?.status === 401){
                user.value = null
            }
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
        jwtToken,
        getUser,
        logout,
        login
    }
})
