import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/client'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = ref(false)

  const setUser = (userData: any, authToken: string) => {
    user.value = userData
    token.value = authToken
    isAuthenticated.value = true
  }

  const clearAuth = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    api.logout()
  }

  const login = async (username: string, password: string) => {
    try {
      const response = await api.login({ username, password })
      if (response.success) {
        setUser(response.user, response.token)
        return { success: true }
      }
      return { success: false, error: 'Login failed' }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error?.message || 'Login failed' }
    }
  }

  const register = async (data: {
    username: string
    email: string
    password: string
    displayName: string
  }) => {
    try {
      const response = await api.register(data)
      if (response.success) {
        setUser({ username: data.username, email: data.email, displayName: data.displayName }, response.token)
        return { success: true }
      }
      return { success: false, error: 'Registration failed' }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error?.message || 'Registration failed' }
    }
  }

  const logout = () => {
    clearAuth()
  }

  // Initialize from localStorage if token exists
  const initializeAuth = () => {
    const savedToken = api.getToken()
    if (savedToken) {
      token.value = savedToken
      isAuthenticated.value = true
      // You might want to fetch user data here
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    setUser,
    clearAuth,
    login,
    register,
    logout,
    initializeAuth,
  }
})
