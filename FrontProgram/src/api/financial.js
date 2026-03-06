import request from '@/utils/request'

export const getFinancialRecords = (params) => {
  return request({
    url: '/financial/records',
    method: 'get',
    params
  })
}

export const createFinancialRecord = (data) => {
  return request({
    url: '/financial/records',
    method: 'post',
    data
  })
}

export const getFinancialStats = (params) => {
  return request({
    url: '/financial/records/stats',
    method: 'get',
    params
  })
}

export const createHourTopup = (data) => {
  return request({
    url: '/financial/hour-topups',
    method: 'post',
    data
  })
}

export const getHourTopups = (params) => {
  return request({
    url: '/financial/hour-topups',
    method: 'get',
    params
  })
}
