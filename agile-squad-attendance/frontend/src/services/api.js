import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)


// Auth API
export const authAPI = {
  register(data) {
    return api.post('/auth/register', data)
  },
  login(data) {
    return api.post('/auth/login', data)
  },
  logout() {
    return api.post('/logout')
  },
  getUser() {
    return api.get('/user')
  },
  updateProfile(data) {
    return api.put('/user/profile', data)
  },
  changePassword(data) {
    return api.put('/user/password', data)
  },
  googleLogin() {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
  },
  microsoftLogin() {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/microsoft`
  }
}

// Squad API
export const squadAPI = {
  getAll(params = {}) {
    return api.get('/squads', { params })
  },
  getById(id) {
    return api.get(`/squads/${id}`)
  },
  create(data) {
    return api.post('/squads', data)
  },
  update(id, data) {
    return api.put(`/squads/${id}`, data)
  },
  delete(id) {
    return api.delete(`/squads/${id}`)
  },
  getMembers(id) {
    return api.get(`/squads/${id}/members`)
  },
  addMember(id, data) {
    return api.post(`/squads/${id}/members`, data)
  },
  removeMember(id, userId) {
    return api.delete(`/squads/${id}/members/${userId}`)
  },
  getSprints(id) {
    return api.get(`/squads/${id}/sprints`)
  },
  getActiveSprint(id) {
    return api.get(`/squads/${id}/active-sprint`)
  }
}

// Attendance API
export const attendanceAPI = {
  getAll(params = {}) {
    return api.get('/attendance', { params })
  },
  getById(id) {
    return api.get(`/attendance/${id}`)
  },
  checkIn(data) {
    return api.post('/attendance/check-in', data)
  },
  checkOut(data) {
    return api.post('/attendance/check-out', data)
  },
  getToday() {
    return api.get('/attendance/today')
  },
  getSquadToday(squadId) {
    return api.get(`/attendance/squad/${squadId}/today`)
  },
  getStats(params) {
    return api.get('/attendance/stats', { params })
  },
  update(id, data) {
    return api.put(`/attendance/${id}`, data)
  },
  delete(id) {
    return api.delete(`/attendance/${id}`)
  }
}

// Leave Request API
export const leaveAPI = {
  getAll(params = {}) {
    return api.get('/leave-requests', { params })
  },
  getMyRequests() {
    return api.get('/leave-requests')
  },
  getById(id) {
    return api.get(`/leave-requests/${id}`)
  },
  create(data) {
    return api.post('/leave-requests', data)
  },
  update(id, data) {
    return api.put(`/leave-requests/${id}`, data)
  },
  cancel(id) {
    return api.delete(`/leave-requests/${id}`)
  },
  approve(id, data = {}) {
    return api.post(`/leave-requests/${id}/approve`, data)
  },
  reject(id, data) {
    return api.post(`/leave-requests/${id}/reject`, data)
  },
  getPendingApprovals() {
    return api.get('/leave-requests/pending-approvals')
  },
  getCalendar(params) {
    return api.get('/leave-requests/calendar', { params })
  }
}

// Export organized API object
export default {
  auth: authAPI,
  squads: squadAPI,
  attendance: attendanceAPI,
  leave: leaveAPI
}
