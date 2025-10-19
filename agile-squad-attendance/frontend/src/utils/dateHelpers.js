/**
 * Date utility functions to handle date formatting and validation
 */

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type: 'short', 'long', 'time', 'datetime'
 * @returns {string} Formatted date or '-' if invalid
 */
export function formatDate(date, format = 'short') {
  if (!date) return '-'
  
  try {
    const dateObj = new Date(date)
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return '-'
    }

    const options = {
      short: { month: 'short', day: 'numeric', year: 'numeric' },
      long: { month: 'long', day: 'numeric', year: 'numeric' },
      time: { hour: '2-digit', minute: '2-digit' },
      datetime: { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      }
    }

    return dateObj.toLocaleString('en-US', options[format] || options.short)
  } catch (error) {
    console.error('Date formatting error:', error)
    return '-'
  }
}

/**
 * Format time from datetime string
 * @param {string|Date} datetime - DateTime to format
 * @returns {string} Formatted time or '-' if invalid
 */
export function formatTime(datetime) {
  if (!datetime) return '-'
  
  try {
    const dateObj = new Date(datetime)
    
    if (isNaN(dateObj.getTime())) {
      return '-'
    }

    return dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return '-'
  }
}

/**
 * Calculate duration between two dates
 * @param {string|Date} startDate
 * @param {string|Date} endDate
 * @returns {string} Duration string like "2h 30m" or '-'
 */
export function calculateDuration(startDate, endDate) {
  if (!startDate || !endDate) return '-'
  
  try {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return '-'
    }

    const diff = end - start
    const hours = Math.floor(diff / 1000 / 60 / 60)
    const minutes = Math.floor((diff / 1000 / 60) % 60)
    
    if (hours === 0 && minutes === 0) return '0m'
    if (hours === 0) return `${minutes}m`
    if (minutes === 0) return `${hours}h`
    
    return `${hours}h ${minutes}m`
  } catch (error) {
    return '-'
  }
}

/**
 * Calculate days between two dates
 * @param {string|Date} startDate
 * @param {string|Date} endDate
 * @returns {number} Number of days
 */
export function daysBetween(startDate, endDate) {
  if (!startDate || !endDate) return 0
  
  try {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 0
    }

    const diff = Math.abs(end - start)
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1 // +1 to include both start and end days
  } catch (error) {
    return 0
  }
}

/**
 * Check if date is valid
 * @param {string|Date} date
 * @returns {boolean}
 */
export function isValidDate(date) {
  if (!date) return false
  
  try {
    const dateObj = new Date(date)
    return !isNaN(dateObj.getTime())
  } catch {
    return false
  }
}

/**
 * Get relative time (e.g., "2 hours ago", "3 days ago")
 * @param {string|Date} date
 * @returns {string}
 */
export function getRelativeTime(date) {
  if (!date) return '-'
  
  try {
    const dateObj = new Date(date)
    
    if (isNaN(dateObj.getTime())) {
      return '-'
    }

    const now = new Date()
    const diff = now - dateObj
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 7) return formatDate(date, 'short')
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    return 'Just now'
  } catch (error) {
    return '-'
  }
}

/**
 * Format date for input fields (YYYY-MM-DD)
 * @param {string|Date} date
 * @returns {string}
 */
export function formatForInput(date) {
  if (!date) return ''
  
  try {
    const dateObj = new Date(date)
    
    if (isNaN(dateObj.getTime())) {
      return ''
    }

    return dateObj.toISOString().split('T')[0]
  } catch (error) {
    return ''
  }
}

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string}
 */
export function getTodayString() {
  return new Date().toISOString().split('T')[0]
}

/**
 * Get date X days ago in YYYY-MM-DD format
 * @param {number} days
 * @returns {string}
 */
export function getDaysAgo(days) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().split('T')[0]
}
