// src/services/api.ts
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Cambia esta constante si tienes otro host o puerto
//  const defaultUrl = 'https://fit.tvcoosanjer.com.gt/api'

 

const defaultUrl = 'http://192.168.1.205:8000/api'

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

export async function fetchUserActivities() {
  const { data } = await api.get('/app/user/activities')
  return data.data ?? data
}

export default api
