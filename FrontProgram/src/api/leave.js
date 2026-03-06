import request from '@/utils/request'

export const getPendingLeaveRequests = () => {
  return request({
    url: '/leave-requests/pending',
    method: 'get'
  })
}

export const approveLeaveRequest = (id, data) => {
  return request({
    url: `/leave-requests/${id}/approve`,
    method: 'put',
    data
  })
}
