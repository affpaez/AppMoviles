import axios from 'axios'
import { API_URL } from '../constants/constants'

const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use(
  (config) => {
    try {
      const { useAuthStore } = require('../store/authStore')
      const token = useAuthStore.getState().token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch {}
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        const { useAuthStore } = require('../store/authStore')
        useAuthStore.getState().cerrarSesion()
      } catch {}
    }
    return Promise.reject(error)
  },
)

export default api
