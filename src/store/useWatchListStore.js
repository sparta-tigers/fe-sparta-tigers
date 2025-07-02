import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/axios.js'
import {useLoadingStore} from "@/store/useLoadingStore.js";
import {ApiError} from "@/utils/ApiError.js";
import router from '@/router/router.js'

export const useWatchListStore = defineStore('watchList', () => {
    const watchList =  ref([])
    const watchlistDetail = ref(null);
    const totalElements = ref(0)
    const totalPages = ref(0)
    const page = ref(1)
    const size = ref(10)
    const loadingStore = useLoadingStore()

    const statistics = ref({
        total: 0,
        winRate: 0.0,
        mostVisitedStadium: null,
        bestWinRateStadium: null,
        win: 0,
        draw: 0,
        lose: 0,
    })


    const fetchWatchList = async (pageNum = 1, pageSize = 10) => {
        loadingStore.start('watchList');
        try {
            const response = await axios.get('/watchlist', {
            params: {
                page: pageNum + 1,
                size: pageSize,
            },
        })
            const data = response.data.data
            watchList.value = data.content
            totalElements.value = data.totalElements
            totalPages.value = data.totalPages
            page.value = data.number || 1;
            size.value = data.size || 10;
        } catch (err) {
            const { message } = ApiError(err);
            alert(message);
        } finally {
            loadingStore.stop('watchList');
        }
    }
    const createWatchList = async (payload) => {
        try {
            const response = await axios.post('/watchlist', payload, {
            });
            return response.data
        } catch (err) {
            const { message } = ApiError(err);
            alert(message);
        }
    }
    const fetchWatchListDetail = async (id) => {
        loadingStore.start('watchList');
        try{
            const response = await axios.get(`/watchlist/${id}`);
            watchlistDetail.value = response.data.data;
        } catch (err) {
            const { message } = ApiError(err);
            alert(message);
        }
    }

    const updateWatchList = async (id, { content, rate }) => {
        loadingStore.start('watchList');
        try {
            const response = await axios.patch(`/watchlist/${id}`, {
                record: {
                    content,
                    rate,
                },
            });
            watchlistDetail.value = response.data.data;
        } catch (err) {
            const { message } = ApiError(err);
            alert(message);
        } finally {
            loadingStore.stop('watchList');
        }
    };

    const deleteWatchList = async (id) => {
        loadingStore.start('watchList');
        try {
            await axios.delete(`/watchlist/${id}`);
        } catch (err) {
            const { message } = ApiError(err);
            alert(message);
        } finally {
            loadingStore.stop('watchList');
        }
    };

    const fetchStatistics = async () => {
        loadingStore.start('watchList');
        try {
            const res = await axios.get('/watchlist/stats')
            console.log(res.data.data);
            statistics.value = res.data.data
        } catch (err) {
            const { message } = ApiError(err);
            alert(message);
        }
        finally {
            loadingStore.stop('watchList');
        }
    }





    return {
        watchList,
        totalElements,
        totalPages,
        page,
        size,
        watchlistDetail,
        statistics,
        fetchWatchList,
        createWatchList,
        fetchWatchListDetail,
        updateWatchList,
        deleteWatchList,
        fetchStatistics,
    }
})
