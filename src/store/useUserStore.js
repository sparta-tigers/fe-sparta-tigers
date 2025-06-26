import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/axios.js'
import router from "@/router/router.js";
import {useLoadingStore} from "@/store/useLoadingStore.js";
import {ApiError} from "@/utils/ApiError.js";

export const useUserStore = defineStore('user', () => {
    const user = ref(null)
    const loading = ref(false)
    const error = ref(null)
    const jwtToken = ref(localStorage.getItem('jwt_token') || null)
    const loadingStore = useLoadingStore()
    const login = async (email, password) => {
        loadingStore.stop(user);

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
            const { message } = ApiError(err);
            alert(message);
        } finally {122100
            loadingStore.stop(user);
        }

    };

    const getUser = async () => {
        loadingStore.isLoading(user)
        error.value = null
        try {
            const response = await axios.get('/users/me')
            user.value = response.data.data
        } catch (err) {
            if (err.response?.status === 401) {
                user.value = null
                // 추가: 인증 만료 시 로그아웃 처리나 리다이렉트도 여기서 가능
            } else {
                error.value = '사용자 정보를 불러오는 중 오류가 발생했습니다.'
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
