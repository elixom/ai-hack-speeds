import { defineStore } from 'pinia'
import { authAPI } from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    isSquadLead: (state) => state.user?.role === 'squad_lead',
    isMember: (state) => state.user?.role === 'member',
    isViewer: (state) => state.user?.role === 'viewer',
    userSquads: (state) => state.user?.squads || []
  },

  actions: {
    async register(userData) {
      this.loading = true
      this.error = null
      try {
        const response = await authAPI.register(userData)
        if (response.data.success) {
          this.token = response.data.data.token
          this.user = response.data.data.user
          this.isAuthenticated = true
          localStorage.setItem('token', this.token)
          localStorage.setItem('user', JSON.stringify(this.user))
          return true
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Registration failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        const response = await authAPI.login({ email, password })
        if (response.data.success) {
          this.token = response.data.data.token
          this.user = response.data.data.user
          this.isAuthenticated = true
          localStorage.setItem('token', this.token)
          localStorage.setItem('user', JSON.stringify(this.user))
          return true
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async loginWithGoogle() {
      authAPI.googleLogin()
    },

    async loginWithMicrosoft() {
      authAPI.microsoftLogin()
    },

    async logout() {
      try {
        await authAPI.logout()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.user = null
        this.token = null
        this.isAuthenticated = false
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },

    async fetchUser() {
      if (!this.token) return

      this.loading = true
      try {
        const response = await authAPI.getUser()
        if (response.data.success) {
          this.user = response.data.data
          localStorage.setItem('user', JSON.stringify(this.user))
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch user'
        if (error.response?.status === 401) {
          this.logout()
        }
      } finally {
        this.loading = false
      }
    },

    handleOAuthCallback(token) {
      this.token = token
      this.isAuthenticated = true
      localStorage.setItem('token', token)
      this.fetchUser()
    }
  }
})
