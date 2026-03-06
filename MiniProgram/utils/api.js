const BASE_URL = 'http://localhost:3000/api'

const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token') || ''

    wx.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        const { code, message, data } = res.data

        if (code === 200) {
          resolve(data)
        } else {
          wx.showToast({
            title: message || '请求失败',
            icon: 'none',
            duration: 2000
          })
          reject(new Error(message || '请求失败'))
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 2000
        })
        reject(err)
      }
    })
  })
}

export const wechatLogin = (data) => {
  return request({
    url: '/auth/wechat/login',
    method: 'POST',
    data
  })
}

export const getParentHome = () => {
  return request({
    url: '/miniprogram/parent/home',
    method: 'GET'
  })
}

export const getParentStudents = () => {
  return request({
    url: '/miniprogram/parent/students',
    method: 'GET'
  })
}

export const getParentSchedule = (studentId, month) => {
  return request({
    url: `/miniprogram/parent/schedule/${studentId}`,
    method: 'GET',
    data: { month }
  })
}

export const createLeaveRequest = (data) => {
  return request({
    url: '/leave-requests',
    method: 'POST',
    data
  })
}

export const getStudentLeaveRequests = (studentId) => {
  return request({
    url: `/leave-requests/student/${studentId}`,
    method: 'GET'
  })
}

export const getParentGrowth = (studentId) => {
  return request({
    url: `/miniprogram/parent/growth/${studentId}`,
    method: 'GET'
  })
}

export const getParentStudentDetail = (studentId) => {
  return request({
    url: `/miniprogram/parent/student/${studentId}`,
    method: 'GET'
  })
}

export const getCoachHome = () => {
  return request({
    url: '/miniprogram/coach/home',
    method: 'GET'
  })
}

export const getCoachTodayClasses = () => {
  return request({
    url: '/miniprogram/coach/today-classes',
    method: 'GET'
  })
}

export const getCoachClassDetail = (recordId) => {
  return request({
    url: `/miniprogram/coach/class-record/${recordId}`,
    method: 'GET'
  })
}

export const submitClassAttendance = (recordId, data) => {
  return request({
    url: `/miniprogram/coach/class-record/${recordId}/attendance`,
    method: 'POST',
    data
  })
}

export const getCoachStudents = () => {
  return request({
    url: '/miniprogram/coach/students',
    method: 'GET'
  })
}

export const getCoachStudentDetail = (studentId) => {
  return request({
    url: `/miniprogram/coach/student/${studentId}`,
    method: 'GET'
  })
}

export const getCoachStats = () => {
  return request({
    url: '/miniprogram/coach/stats',
    method: 'GET'
  })
}
