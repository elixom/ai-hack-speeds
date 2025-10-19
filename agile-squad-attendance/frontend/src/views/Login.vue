<template>
  <div class="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="w-full max-w-md">
      <!-- Logo/Header -->
      <div class="mb-8 text-center">
        <h1 class="mb-2 text-4xl font-bold text-gray-900">Agile Squad</h1>
        <p class="text-gray-600">Attendance Management Platform</p>
      </div>

      <!-- Login Card -->
      <div class="p-8 bg-white shadow-xl rounded-2xl">
        <h2 class="mb-6 text-2xl font-semibold text-center text-gray-800">Sign In</h2>

        <!-- Error Message -->
        <div v-if="error" class="p-4 mb-4 text-red-700 border-l-4 border-red-500 rounded bg-red-50">
          <p class="text-sm">{{ error }}</p>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="p-4 mb-4 text-green-700 border-l-4 border-green-500 rounded bg-green-50">
          <p class="text-sm">{{ successMessage }}</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleEmailLogin" class="space-y-4">
          <div>
            <label for="email" class="block mb-1 text-sm font-medium text-gray-700">Email Address</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label for="password" class="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-3 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                v-model="form.remember"
                type="checkbox"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" class="text-sm font-medium text-blue-600 hover:text-blue-700">Forgot password?</a>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">Sign In</span>
            <span v-else class="flex items-center justify-center">
              <svg class="w-5 h-5 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 text-gray-500 bg-white">Or continue with</span>
          </div>
        </div>

        <!-- OAuth Buttons -->
        <div class="space-y-3">
          <button
            @click="handleGoogleLogin"
            :disabled="loading"
            class="flex items-center justify-center w-full px-4 py-3 transition border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          <button
            @click="handleMicrosoftLogin"
            :disabled="loading"
            class="flex items-center justify-center w-full px-4 py-3 transition border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <svg class="w-5 h-5 mr-2" viewBox="0 0 23 23">
              <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
              <path fill="#f35325" d="M1 1h10v10H1z"/>
              <path fill="#81bc06" d="M12 1h10v10H12z"/>
              <path fill="#05a6f0" d="M1 12h10v10H1z"/>
              <path fill="#ffba08" d="M12 12h10v10H12z"/>
            </svg>
            Sign in with Microsoft
          </button>
        </div>

        <!-- Register Link -->
        <p class="mt-6 text-sm text-center text-gray-600">
          Don't have an account?
          <router-link to="/register" class="font-semibold text-blue-600 hover:text-blue-700">Sign up</router-link>
        </p>
      </div>

      <!-- Demo Credentials -->
      <div class="p-6 mt-6 bg-white border border-blue-200 shadow-sm rounded-xl">
        <div class="flex items-center gap-2 mb-4">
          <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
          <h3 class="text-sm font-semibold text-gray-900">Demo Accounts</h3>
        </div>
        <p class="mb-3 text-xs text-gray-600">Click any account below to auto-fill credentials:</p>
        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            @click="fillDemoCredentials('admin@example.com', 'password')"
            type="button"
            class="p-3 text-left transition border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 group"
          >
            <div class="flex items-center gap-2">
              <span class="text-lg">👑</span>
              <div>
                <p class="text-xs font-semibold text-gray-900">Admin</p>
                <p class="text-xs text-gray-500 group-hover:text-blue-600">admin@example.com</p>
              </div>
            </div>
          </button>
          
          <button
            @click="fillDemoCredentials('lead@example.com', 'password')"
            type="button"
            class="p-3 text-left transition border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 group"
          >
            <div class="flex items-center gap-2">
              <span class="text-lg">⭐</span>
              <div>
                <p class="text-xs font-semibold text-gray-900">Squad Lead</p>
                <p class="text-xs text-gray-500 group-hover:text-blue-600">lead@example.com</p>
              </div>
            </div>
          </button>
          
          <button
            @click="fillDemoCredentials('john@example.com', 'password')"
            type="button"
            class="p-3 text-left transition border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 group"
          >
            <div class="flex items-center gap-2">
              <span class="text-lg">👤</span>
              <div>
                <p class="text-xs font-semibold text-gray-900">Member (John)</p>
                <p class="text-xs text-gray-500 group-hover:text-blue-600">john@example.com</p>
              </div>
            </div>
          </button>
          
          <button
            @click="fillDemoCredentials('jane@example.com', 'password')"
            type="button"
            class="p-3 text-left transition border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 group"
          >
            <div class="flex items-center gap-2">
              <span class="text-lg">👤</span>
              <div>
                <p class="text-xs font-semibold text-gray-900">Member (Jane)</p>
                <p class="text-xs text-gray-500 group-hover:text-blue-600">jane@example.com</p>
              </div>
            </div>
          </button>
        </div>
        <p class="mt-3 text-xs text-center text-gray-500">
          All demo accounts use password: <code class="px-2 py-1 font-mono text-blue-600 bg-gray-100 rounded">password</code>
        </p>
      </div>

      <!-- Footer -->
      <p class="mt-6 text-sm text-center text-gray-500">
        © 2025 Agile Squad. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: '',
        remember: false
      },
      loading: false,
      error: null,
      successMessage: null
    }
  },
  mounted() {
    // Check for success message from registration
    if (this.$route.query.registered === 'true') {
      this.successMessage = 'Registration successful! Please sign in.'
      // Clear the query parameter
      this.$router.replace({ query: {} })
    }
  },
  methods: {
    async handleEmailLogin() {
      this.error = null
      this.loading = true

      try {
        const authStore = useAuthStore()
        await authStore.login(this.form.email, this.form.password)
        
        // Redirect to dashboard on success
        this.$router.push('/dashboard')
      } catch (err) {
        this.error = err.response?.data?.message || 'Invalid email or password. Please try again.'
      } finally {
        this.loading = false
      }
    },

    async handleGoogleLogin() {
      this.error = null
      this.loading = true

      try {
        const authStore = useAuthStore()
        await authStore.loginWithGoogle()
      } catch (err) {
        this.error = 'Google sign in failed. Please try again.'
        this.loading = false
      }
    },

    async handleMicrosoftLogin() {
      this.error = null
      this.loading = true

      try {
        const authStore = useAuthStore()
        await authStore.loginWithMicrosoft()
      } catch (err) {
        this.error = 'Microsoft sign in failed. Please try again.'
        this.loading = false
      }
    },

    fillDemoCredentials(email, password) {
      this.form.email = email
      this.form.password = password
      this.error = null
      // Optionally, you can also auto-submit the form
      // this.handleEmailLogin()
    }
  }
}
</script>
