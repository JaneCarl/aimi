import request from '@/utils/request'

export const adminLogin = (data) => {
  return request({
    url: '/auth/admin/login',
    method: 'post',
    data
  })
}

export const wechatLogin = (data) => {
  return request({
    url: '/auth/wechat/login',
    method: 'post',
    data
  })
}
