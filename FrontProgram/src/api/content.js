import request from '@/utils/request'

export const getBanners = () => {
  return request({
    url: '/content/banners',
    method: 'get'
  })
}

export const createBanner = (data) => {
  return request({
    url: '/content/banners',
    method: 'post',
    data
  })
}

export const updateBanner = (id, data) => {
  return request({
    url: `/content/banners/${id}`,
    method: 'put',
    data
  })
}

export const deleteBanner = (id) => {
  return request({
    url: `/content/banners/${id}`,
    method: 'delete'
  })
}

export const getPromotionalCourses = () => {
  return request({
    url: '/content/promotional-courses',
    method: 'get'
  })
}

export const createPromotionalCourse = (data) => {
  return request({
    url: '/content/promotional-courses',
    method: 'post',
    data
  })
}

export const updatePromotionalCourse = (id, data) => {
  return request({
    url: `/content/promotional-courses/${id}`,
    method: 'put',
    data
  })
}

export const deletePromotionalCourse = (id) => {
  return request({
    url: `/content/promotional-courses/${id}`,
    method: 'delete'
  })
}
