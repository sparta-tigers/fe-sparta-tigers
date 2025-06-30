import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/axios.js'
import router from "@/router/router.js";
import {useLoadingStore} from "@/store/useLoadingStore.js";
import {ApiError} from "@/utils/ApiError.js";

export const useUserStore = defineStore('user', () => {
    const user = ref(null)
    const error = ref(null)
    const jwtToken = ref(localStorage.getItem('jwt_token') || null)
    const loadingStore = useLoadingStore()
    const login = async (email, password) => {
        loadingStore.start('user')

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
        } finally {
            loadingStore.stop('user')
        }

    };

    const getUser = async () => {
        loadingStore.start('user')
        error.value = null
        try {
            const response = await axios.get('/users/me')
            user.value = response.data.data
        } catch (err) {
            const { message } = ApiError(err);
            alert(message);
        } finally {
            loadingStore.stop('user')
        }
    }


    const logout = async () => {
        loadingStore.start('user')
        try {
            await axios.post('/users/logout', null, { withCredentials: true })
            user.value = null
            localStorage.removeItem('jwt_token')
            await router.push('/')

        } catch (err) {
            const { message } = ApiError(err);
            alert(message);
        } finally {
            loadingStore.stop('user')
        }
    }

    const updateNickname = async (nickname) => {
        loadingStore.start('user')
        try {
            const response = await axios.patch(`/users/nickname`, {
                nickname: nickname,
            });
            alert(response.data.data);
        } catch (err) {
            const { message } = ApiError(err);
            alert(message);
        } finally {
            loadingStore.stop('user')
        }
    };

    const updatePassword = async ({ oldPassword, newPassword, confirmPassword }) => {

        if (!oldPassword || !newPassword || !confirmPassword) {
            alert('모든 비밀번호 칸을 채워주세요.')
            return
        }

        if (newPassword !== confirmPassword) {
            alert('새 비밀번호가 일치하지 않습니다.')
            return
        }

        loadingStore.start(user)
        try{
            const response = await axios.patch('/users/password', {
                oldPassword: oldPassword,
                newPassword: newPassword
            })
            alert(response.data.data);
        }
        catch (err){
            const { message } = ApiError(err);
            alert(message);
        }
        finally {
            loadingStore.stop(user)
        }
    }
    const deleteUser = async () => {
        const confirmed = confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')
        if (!confirmed) return

        loadingStore.start('user')

        try{
            const response = await axios.delete(`/users`)
            alert(response.data.data);
            localStorage.removeItem('jwt_token')
            await router.push('/')
        }
        catch (err){
            const { message } = ApiError(err);
            alert(message);
        }
        finally {
            loadingStore.stop('user')
        }
    }

    const signUp = async ({ email, password, nickname }) => {
        loadingStore.start('user')
        try {
            const response = await axios.post('/users/signup', {
                email,
                password,
                nickname
            })
            alert(response.data.data)
            await router.push('/')
        } catch (err) {
            const { message } = ApiError(err)
            alert(message)
        } finally {
            loadingStore.stop('user')
        }
    }

    const updateProfile = async (file) => {
        const formData = new FormData()
        formData.append('file', file)

        loadingStore.start('user')

        try {
             await axios.patch('/users/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            alert("프로필 이미지가 변경되었습니다.");
            await getUser()
        } catch (err) {
            const { message } = ApiError(err)
            alert(message || '이미지 업로드에 실패했습니다.')
        } finally {
            loadingStore.stop('user')
        }

    }
    const deleteProfile = async () => {
        loadingStore.start('user')
        try {
            const response = await axios.delete('/users/profile')
            alert(response.data.data || '기본 이미지로 변경되었습니다.')
            await getUser()
        } catch (err) {
            const { message } = ApiError(err)
            alert(message || '기본 이미지 설정에 실패했습니다.')
        } finally {
            loadingStore.stop('user')
        }
    }


    return {
        user,
        error,
        jwtToken,
        getUser,
        logout,
        login,
        updateNickname,
        updatePassword,
        deleteUser,
        signUp,
        updateProfile,
        deleteProfile,
    }
})
