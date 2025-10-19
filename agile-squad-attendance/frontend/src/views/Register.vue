<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
    <div class="max-w-md w-full">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Agile Squad</h1>
        <p class="text-gray-600">Create your account</p>
      </div>

      <!-- Register Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Sign Up</h2>

        <!-- Error Messages -->
        <div v-if="errors.length > 0" class="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p class="text-sm text-red-700 font-semibold mb-2">Please fix the following errors:</p>
          <ul class="list-disc list-inside text-sm text-red-600 space-y-1">
            <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
          </ul>
        </div>

        <!-- Register Form -->
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span class="text-red-500">*</span>
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="John Doe"
              @input="validateField('name')"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span class="text-red-500">*</span>
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="you@example.com"
              @input="validateField('email')"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Password <span class="text-red-500">*</span>
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Min. 8 characters"
              @input="validateField('password')"
            />
            <!-- Password strength indicator -->
            <div v-if="form.password" class="mt-2">
              <div class="flex gap-1">
                <div 
                  v-for="i in 4" 
                  :key="i"
                  class="h-1 flex-1 rounded transition-colors"
                  :class="i <= passwordStrength ? getStrengthColor() : 'bg-gray-200'"
                ></div>
              </div>
              <p class="text-xs mt-1" :class="getStrengthTextColor()">
                {{ getStrengthText() }}
              </p>
            </div>
          </div>

          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span class="text-red-500">*</span>
            </label>
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Re-enter password"
              @input="validateField('password_confirmation')"
            />
          </div>

          <div>
            <label for="timezone" class="block text-sm font-medium text-gray-700 mb-1">
              Timezone <span class="text-red-500">*</span>
            </label>
            <select
              id="timezone"
              v-model="form.timezone"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="">Select your timezone</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="America/Phoenix">Arizona Time</option>
              <option value="America/Anchorage">Alaska Time</option>
              <option value="Pacific/Honolulu">Hawaii Time</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
              <option value="Asia/Shanghai">Shanghai (CST)</option>
              <option value="Asia/Dubai">Dubai (GST)</option>
              <option value="Australia/Sydney">Sydney (AEDT)</option>
            </select>
          </div>

          <div class="flex items-start">
            <input
              id="terms"
              v-model="form.terms"
              type="checkbox"
              required
              class="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label for="terms" class="ml-2 text-sm text-gray-600">
              I agree to the <a href="#" class="text-blue-600 hover:text-blue-700 font-medium">Terms of Service</a> 
              and <a href="#" class="text-blue-600 hover:text-blue-700 font-medium">Privacy Policy</a>
              <span class="text-red-500">*</span>
            </label>
          </div>

          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">Create Account</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-gray-500">Or sign up with</span>
          </div>
        </div>

        <!-- OAuth Buttons -->
        <div class="space-y-3">
          <button
            @click="handleGoogleSignup"
            :disabled="loading"
            class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>

          <button
            @click="handleMicrosoftSignup"
            :disabled="loading"
            class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            <svg class="w-5 h-5 mr-2" viewBox="0 0 23 23">
              <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
              <path fill="#f35325" d="M1 1h10v10H1z"/>
              <path fill="#81bc06" d="M12 1h10v10H12z"/>
              <path fill="#05a6f0" d="M1 12h10v10H1z"/>
              <path fill="#ffba08" d="M12 12h10v10H12z"/>
            </svg>
            Sign up with Microsoft
          </button>
        </div>

        <!-- Login Link -->
        <p class="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <router-link to="/login" class="text-blue-600 hover:text-blue-700 font-semibold">Sign in</router-link>
        </p>
      </div>

      <!-- Footer -->
      <p class="mt-6 text-center text-sm text-gray-500">
        © 2025 Agile Squad. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Register',
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        timezone: '',
        terms: false
      },
      loading: false,
      errors: []
    }
  },
  computed: {
    passwordStrength() {
      const password = this.form.password
      if (!password) return 0
      
      let strength = 0
      if (password.length >= 8) strength++
      if (password.length >= 12) strength++
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
      if (/\d/.test(password)) strength++
      if (/[^a-zA-Z0-9]/.test(password)) strength++
      
      return Math.min(4, strength)
    },
    
    isFormValid() {
      return this.form.name && 
             this.form.email && 
             this.form.password.length >= 8 && 
             this.form.password === this.form.password_confirmation &&
             this.form.timezone &&
             this.form.terms
    }
  },
  methods: {
    validateField(field) {
      this.errors = this.errors.filter(e => !e.includes(field))
      
      if (field === 'name' && this.form.name.length < 2) {
        this.errors.push('Name must be at least 2 characters')
      }
      
      if (field === 'email' && this.form.email && !this.isValidEmail(this.form.email)) {
        this.errors.push('Please enter a valid email address')
      }
      
      if (field === 'password' && this.form.password.length > 0 && this.form.password.length < 8) {
        this.errors.push('Password must be at least 8 characters')
      }
      
      if (field === 'password_confirmation' && 
          this.form.password_confirmation && 
          this.form.password !== this.form.password_confirmation) {
        this.errors.push('Passwords do not match')
      }
    },

    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    },

    getStrengthColor() {
      const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']
      return colors[this.passwordStrength - 1] || 'bg-gray-200'
    },

    getStrengthTextColor() {
      const colors = ['text-red-600', 'text-orange-600', 'text-yellow-600', 'text-green-600']
      return colors[this.passwordStrength - 1] || 'text-gray-500'
    },

    getStrengthText() {
      const texts = ['Weak', 'Fair', 'Good', 'Strong']
      return texts[this.passwordStrength - 1] || ''
    },

    async handleRegister() {
      this.errors = []
      
      // Validate form
      if (!this.form.name || this.form.name.length < 2) {
        this.errors.push('Name must be at least 2 characters')
      }
      
      if (!this.isValidEmail(this.form.email)) {
        this.errors.push('Please enter a valid email address')
      }
      
      if (this.form.password.length < 8) {
        this.errors.push('Password must be at least 8 characters')
      }
      
      if (this.form.password !== this.form.password_confirmation) {
        this.errors.push('Passwords do not match')
      }
      
      if (!this.form.timezone) {
        this.errors.push('Please select a timezone')
      }
      
      if (!this.form.terms) {
        this.errors.push('You must agree to the Terms of Service')
      }
      
      if (this.errors.length > 0) {
        return
      }
      
      this.loading = true
      
      try {
        const authStore = useAuthStore()
        await authStore.register({
          name: this.form.name,
          email: this.form.email,
          password: this.form.password,
          password_confirmation: this.form.password_confirmation,
          timezone: this.form.timezone
        })
        
        // Redirect to login with success message
        this.$router.push({ path: '/login', query: { registered: 'true' } })
      } catch (err) {
        if (err.response?.data?.errors) {
          // Handle Laravel validation errors
          this.errors = Object.values(err.response.data.errors).flat()
        } else {
          this.errors = [err.response?.data?.message || 'Registration failed. Please try again.']
        }
      } finally {
        this.loading = false
      }
    },

    async handleGoogleSignup() {
      this.loading = true
      try {
        const authStore = useAuthStore()
        await authStore.loginWithGoogle()
      } catch (err) {
        this.errors = ['Google sign up failed. Please try again.']
        this.loading = false
      }
    },

    async handleMicrosoftSignup() {
      this.loading = true
      try {
        const authStore = useAuthStore()
        await authStore.loginWithMicrosoft()
      } catch (err) {
        this.errors = ['Microsoft sign up failed. Please try again.']
        this.loading = false
      }
    }
  }
}
</script>
