import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
    const loadingMap = ref({})

    const start = (key = 'default') => {
        loadingMap.value[key] = true
    }

    const stop = (key = 'default') => {
        loadingMap.value[key] = false
    }

    const isLoading = (key = 'default') => loadingMap.value[key] || false

    return {
        start,
        stop,
        isLoading,
    }
})
