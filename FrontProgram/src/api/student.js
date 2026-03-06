import request from '@/utils/request'

export const getStudents = (params) => {
  return request({
    url: '/students',
    method: 'get',
    params
  })
}

export const createStudent = (data) => {
  return request({
    url: '/students',
    method: 'post',
    data
  })
}

export const updateStudent = (id, data) => {
  return request({
    url: `/students/${id}`,
    method: 'put',
    data
  })
}

export const deleteStudent = (id) => {
  return request({
    url: `/students/${id}`,
    method: 'delete'
  })
}

export const bindParent = (id, data) => {
  return request({
    url: `/students/${id}/bind-parent`,
    method: 'post',
    data
  })
}

export const unbindParent = (id, parentId) => {
  return request({
    url: `/students/${id}/unbind-parent/${parentId}`,
    method: 'delete'
  })
}

export const assignClass = (id, data) => {
  return request({
    url: `/students/${id}/assign-class`,
    method: 'post',
    data
  })
}

export const getStudentDetail = (id) => {
  return request({
    url: `/students/${id}`,
    method: 'get'
  })
}
