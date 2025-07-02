// stores/useFavoriteTeamStore.js
import { defineStore } from 'pinia'
import axios from '@/axios.js'
import { ref } from 'vue'
import {ApiError} from "@/utils/ApiError.js";
import { useLoadingStore } from '@/store/useLoadingStore.js'
export const useFavoriteTeamStore = defineStore('favoriteTeam', () => {
    const favoriteTeam = ref(null)
    const loadingStore = useLoadingStore()
    const selectedTeam = ref(null)

    const fetchFavoriteTeam = async () => {
        loadingStore.start("favoriteTeam")
        try {
            const response = await axios.get('/users/fav')
            console.log(response.data.data)
            favoriteTeam.value = response.data.data || null; // 없으면 null로 처리
        } catch (err) {
            favoriteTeam.value = null;
            const { message } = ApiError(err);
        } finally {
            loadingStore.stop("favoriteTeam")
        }
    }

    const addFavoriteTeam = async (teamId) => {
        loadingStore.start("favoriteTeam")
        try {
            const response = await axios.post('/users/fav', { teamId })
            favoriteTeam.value = response.data.data
        } catch (err) {
            const { message } = ApiError(err);
            alert(message);
        } finally {
            loadingStore.stop("favoriteTeam")
        }
    }

    const updateFavoriteTeam = async (teamId) => {
        loadingStore.start("favoriteTeam")
        try {
            const response = await axios.patch('/users/fav', { teamId })
            favoriteTeam.value = response.data.data
        } catch (err) {
            const { message } = ApiError(err);
            alert(message);
        } finally {
            loadingStore.stop("favoriteTeam")
        }
    }

    const deleteFavoriteTeam = async () => {
        loadingStore.start("favoriteTeam")
        try {
            const response = await axios.delete('/users/fav')
            favoriteTeam.value = null
        } catch (err) {
            const { message } = ApiError(err);
            alert(message);
        } finally {
            loadingStore.stop("favoriteTeam")
        }
    }



    return {
        selectedTeam,
        favoriteTeam,
        fetchFavoriteTeam,
        addFavoriteTeam,
        updateFavoriteTeam,
        deleteFavoriteTeam
    }
})
