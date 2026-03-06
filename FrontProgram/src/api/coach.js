import request from '@/utils/request'

export const getCoaches = (params) => {
  return request({
    url: '/coaches',
    method: 'get',
    params
  })
}

export const createCoach = (data) => {
  return request({
    url: '/coaches',
    method: 'post',
    data
  })
}

export const updateCoach = (id, data) => {
  return request({
    url: `/coaches/${id}`,
    method: 'put',
    data
  })
}

export const deleteCoach = (id) => {
  return request({
    url: `/coaches/${id}`,
    method: 'delete'
  })
}

export const getCoachStats = (id) => {
  return request({
    url: `/coaches/${id}/stats`,
    method: 'get'
  })
}
