<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ message }}</h2>
      <p class="text-gray-600">{{ subMessage }}</p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
  name: 'OAuthCallback',
  data() {
    return {
      message: 'Completing authentication...',
      subMessage: 'Please wait while we log you in'
    }
  },
  async mounted() {
    await this.handleCallback()
  },
  methods: {
    async handleCallback() {
      try {
        // Get token from URL
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')
        const error = urlParams.get('error')

        if (error) {
          this.message = 'Authentication failed'
          this.subMessage = error
          setTimeout(() => {
            this.$router.push('/login')
          }, 3000)
          return
        }

        if (!token) {
          this.message = 'No authentication token received'
          this.subMessage = 'Redirecting to login...'
          setTimeout(() => {
            this.$router.push('/login')
          }, 2000)
          return
        }

        // Handle OAuth success
        const authStore = useAuthStore()
        authStore.handleOAuthCallback(token)

        this.message = 'Success!'
        this.subMessage = 'Redirecting to dashboard...'

        // Redirect to dashboard
        setTimeout(() => {
          this.$router.push('/dashboard')
        }, 1500)
      } catch (error) {
        console.error('OAuth callback error:', error)
        this.message = 'An error occurred'
        this.subMessage = 'Redirecting to login...'
        setTimeout(() => {
          this.$router.push('/login')
        }, 2000)
      }
    }
  }
}
</script>
