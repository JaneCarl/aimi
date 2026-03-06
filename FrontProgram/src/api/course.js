import request from '@/utils/request'

export const getCourses = () => {
  return request({
    url: '/course/courses',
    method: 'get'
  })
}

export const createCourse = (data) => {
  return request({
    url: '/course/courses',
    method: 'post',
    data
  })
}

export const updateCourse = (id, data) => {
  return request({
    url: `/course/courses/${id}`,
    method: 'put',
    data
  })
}

export const deleteCourse = (id) => {
  return request({
    url: `/course/courses/${id}`,
    method: 'delete'
  })
}

export const getClasses = (params) => {
  return request({
    url: '/course/classes',
    method: 'get',
    params
  })
}

export const createClass = (data) => {
  return request({
    url: '/course/classes',
    method: 'post',
    data
  })
}

export const updateClass = (id, data) => {
  return request({
    url: `/course/classes/${id}`,
    method: 'put',
    data
  })
}

export const deleteClass = (id) => {
  return request({
    url: `/course/classes/${id}`,
    method: 'delete'
  })
}

export const getClassStudents = (id) => {
  return request({
    url: `/course/classes/${id}/students`,
    method: 'get'
  })
}
