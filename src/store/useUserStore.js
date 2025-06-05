import { reactive } from 'vue'
import axios from '@/axios.js'

export const useUserStore = () => {
    const state = reactive({
        user: null,
        loading: false,
        error: null,
    })

    const getUser = async () => {
        state.loading = true
        state.error = null
        try {
            const response = await axios.get('/users/me')
            state.user = response.data
        } catch (err) {
            state.error = err
            console.error(err)
        } finally {
            state.loading = false
        }
    }

    return {
        state,
        getUser,
    }
}
