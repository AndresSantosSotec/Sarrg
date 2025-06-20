// src/services/api.ts
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Cambia esta constante si tienes otro host o puerto
 const defaultUrl = 'https://fit.tvcoosanjer.com.gt/api'


 
//entono  de desarollo yd e testing
// const defaultUrl = 'http://192.168.1.205:8000/api'


// const defaultUrl = 'http://192.168.0.33:8000/api'
//local 
// const defaultUrl = 'http://192.168.1.99:8000/api'

const api = axios.create({
  baseURL: defaultUrl,
})

// Interceptor para adjuntar el token en cada petición
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

/**
 * Llama al endpoint de login, guarda el token y retorna la data completa.
 */
export async function login(email: string, password: string) {
  const response = await api.post('/app/login', { email, password })
  const { token, user } = response.data
  // Guarda el token para futuras peticiones
  await AsyncStorage.setItem('auth_token', token)
  // (Opcional) Guarda también los datos del usuario
  await AsyncStorage.setItem('user_data', JSON.stringify(user))
  return { user }
}

/**
 * Elimina credenciales locales para forzar logout
 */
export async function logout() {
  await AsyncStorage.multiRemove(['auth_token', 'user_data'])
}

export interface ActivityPage<T> {
  data: T[]
  current_page: number
  last_page: number
}

export async function fetchUserActivities<T>(page = 1): Promise<ActivityPage<T>> {
  const { data } = await api.get(`/app/user/activities?page=${page}`)

  if (Array.isArray(data)) {
    return { data, current_page: page, last_page: page }
  }

  return {
    data: data.data ?? [],
    current_page: data.current_page ?? data.meta?.current_page ?? page,
    last_page: data.last_page ?? data.meta?.last_page ?? page,
  }
}

export interface NotificationItem {
  id: number
  title: string
  body: string
  created_at: string
  read_at?: string | null
}

export async function fetchNotifications(): Promise<NotificationItem[]> {
  const { data } = await api.get('/app/notifications')
  return data.data ?? data
}

export async function markNotificationAsRead(id: number): Promise<void> {
  await api.post(`/app/notifications/${id}/read`)
}

export interface GeneralInfoItem {
  id: number
  title: string
  content: string
}

export async function fetchGeneralInfo(): Promise<GeneralInfoItem[]> {
  const { data } = await api.get('/app/general-info')
  return data.data ?? data
}

export default api
