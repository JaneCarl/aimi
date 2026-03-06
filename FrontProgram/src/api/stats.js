import request from '@/utils/request'

export const getAttendanceStats = (params) => {
  return request({
    url: '/stats/attendance',
    method: 'get',
    params
  })
}

export const getStudentGrowth = (params) => {
  return request({
    url: '/stats/student-growth',
    method: 'get',
    params
  })
}

export const getRevenueStats = (params) => {
  return request({
    url: '/stats/revenue',
    method: 'get',
    params
  })
}
