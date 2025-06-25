import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/axios.js'

export const useWatchListStore = defineStore('watchList', () => {
    const watchList =  ref([])
    const totalElements = ref(0)
    const totalPages = ref(0)
    const page = ref(0)
    const size = ref(10)
    const loading = ref(false)

    const fetchWatchList = async (pageNum = 0, pageSize = 10) => {
        loading.value = true
        try {
            const response = await axios.get('/watchlist', {
            params: {
                page: pageNum,
                size: pageSize,
            },
            withCredentials: true
        })

            const data = response.data.data
            console.log(data);
            watchList.value = data.content
            totalElements.value = data.totalElements
            totalPages.value = data.totalPages
            page.value = data.number
            size.value = data.size
        } catch (error) {
            console.error('📛 WatchList 가져오기 실패:', error)
        } finally {
            loading.value = false
        }
    }
    const createWatchList = async (payload) => {
        try {
            const response = await axios.post('/watchlist', payload, {
                withCredentials: true
            })
            console.log('✅ 등록 성공:', response.data)
            return response.data
        } catch (error) {
            console.error('❌ 등록 실패:', error)
            throw error
        }
    }
    return {
        watchList,
        totalElements,
        totalPages,
        page,
        size,
        loading,
        fetchWatchList,
        createWatchList,
    }
})
