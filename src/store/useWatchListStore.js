import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/axios.js'
import {useLoadingStore} from "@/store/useLoadingStore.js";

export const useWatchListStore = defineStore('watchList', () => {
    const watchList =  ref([])
    const totalElements = ref(0)
    const totalPages = ref(0)
    const page = ref(0)
    const size = ref(10)
    const loadingStore = useLoadingStore()

    const fetchWatchList = async (pageNum = 0, pageSize = 10) => {
        loadingStore.start('watchList');
        try {
            const response = await axios.get('/watchlist', {
            params: {
                page: pageNum,
                size: pageSize,
            },
        })
            const data = response.data.data
            watchList.value = data.content
            totalElements.value = data.totalElements
            totalPages.value = data.totalPages
            page.value = data.number || 0;
            size.value = data.size || 10;
        } catch (error) {
            console.error('WatchList fetch error:', error);
        } finally {
            loadingStore.stop('watchList');
        }
    }
    const createWatchList = async (payload) => {
        try {
            const response = await axios.post('/watchlist', payload, {
            });
            return response.data
        } catch (error) {
            console.error('WatchList post error:', error);
        }
    }
    return {
        watchList,
        totalElements,
        totalPages,
        page,
        size,
        fetchWatchList,
        createWatchList,
    }
})
