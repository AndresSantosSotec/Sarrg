// src/services/api.ts
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Cambia esta constante si tienes otro host o puerto
const defaultUrl = 'https://fit.tvcoosanjer.com.gt/api'

const api = axios.create({
  baseURL: defaultUrl,
})

// Interceptor para adjuntar el token en cada petición
api.interceptors.request.use(
  config => {
    // Obtén el token de forma asíncrona y agrégalo cuando esté disponible
    AsyncStorage.getItem('auth_token').then(token => {
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    })
    return config
  },
  error => Promise.reject(error)
)

export default api
