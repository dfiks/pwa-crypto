import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

export interface RegisterRequest {
  email: string
  username: string
  password: string
}

export interface RegisterResponse {
  id: string
  email: string
  username: string
  token: string
}

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>('/auth/register', data)
  return response.data
}

// Add interceptor to handle errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
)

export default api