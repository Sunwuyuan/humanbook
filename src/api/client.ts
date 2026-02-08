import axios, { AxiosInstance } from 'axios'

// API Configuration - Use Vercel edge function proxy or direct API
const isDevelopment = import.meta.env.DEV
const API_BASE_URL = isDevelopment 
  ? 'https://api.moltbook.com/v1'  // Direct API in development
  : '/api/proxy'  // Vercel edge function proxy in production

class ApiClient {
  private client: AxiosInstance
  private token: string | null = null

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add token
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`
      }
      return config
    })

    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('authToken')
      if (savedToken) {
        this.token = savedToken
      }
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('authToken', token)
      } else {
        localStorage.removeItem('authToken')
      }
    }
  }

  getToken() {
    return this.token
  }

  // Auth endpoints
  async register(data: {
    username: string
    email: string
    password: string
    displayName: string
  }) {
    const response = await this.client.post('/auth/register', data)
    if (response.data.token) {
      this.setToken(response.data.token)
    }
    return response.data
  }

  async login(data: { username: string; password: string }) {
    const response = await this.client.post('/auth/login', data)
    if (response.data.token) {
      this.setToken(response.data.token)
    }
    return response.data
  }

  async linkAccount(data: {
    platform: string
    platformUserId: string
    credentials: any
  }) {
    const response = await this.client.post('/auth/link', data)
    return response.data
  }

  // Post endpoints
  async createPost(data: {
    title: string
    content: string
    tags?: string[]
    visibility?: string
  }) {
    const response = await this.client.post('/posts', data)
    return response.data
  }

  async getPosts(params?: {
    page?: number
    limit?: number
    sort?: string
    tag?: string
    author?: string
  }) {
    const response = await this.client.get('/posts', { params })
    return response.data
  }

  async getPost(id: string) {
    const response = await this.client.get(`/posts/${id}`)
    return response.data
  }

  async likePost(postId: string) {
    const response = await this.client.post(`/posts/${postId}/like`)
    return response.data
  }

  // Comment endpoints
  async createComment(postId: string, data: {
    content: string
    parentCommentId?: string
  }) {
    const response = await this.client.post(`/posts/${postId}/comments`, data)
    return response.data
  }

  async getComments(postId: string, params?: {
    page?: number
    limit?: number
  }) {
    const response = await this.client.get(`/posts/${postId}/comments`, { params })
    return response.data
  }

  async likeComment(commentId: string) {
    const response = await this.client.post(`/comments/${commentId}/like`)
    return response.data
  }

  // User endpoints
  async getUserProfile(username: string) {
    const response = await this.client.get(`/users/${username}`)
    return response.data
  }

  async updateProfile(data: {
    displayName?: string
    bio?: string
    avatar?: string
  }) {
    const response = await this.client.put('/users/me', data)
    return response.data
  }

  logout() {
    this.setToken(null)
  }
}

export const api = new ApiClient()
export default api
