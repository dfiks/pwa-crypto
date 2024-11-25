import { defineStore } from 'pinia'
import { ref } from 'vue'
import { register as apiRegister } from '@/api/auth'
import type { RegisterRequest, RegisterResponse } from '@/api/auth'
import { toast } from 'vue3-toastify'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<RegisterResponse | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const register = async (data: RegisterRequest) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await apiRegister(data)
      user.value = response
      
      // Store token
      localStorage.setItem('token', response.token)
      
      toast.success('Registration successful!')
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Registration failed'
      toast.error(error.value)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('token')
  }

  return {
    user,
    isLoading,
    error,
    register,
    logout
  }
})