import { getCoachClassDetail, submitClassAttendance } from '../../../utils/api'

Page({
  data: {
    recordId: null,
    classRecord: null,
    students: []
  },

  onLoad(options) {
    this.setData({ recordId: Number(options.recordId) })
    this.loadData()
  },

  async loadData() {
    try {
      const data = await getCoachClassDetail(this.data.recordId)
      this.setData({
        classRecord: data,
        students: data.students || []
      })
    } catch (error) {
      console.error('加载课程详情失败:', error)
    }
  },

  onStatusChange(e) {
    const index = e.currentTarget.dataset.index
    const status = e.detail.value
    this.setData({
      [`students[${index}].status`]: status
    })
  },

  onScoreInput(e) {
    const index = e.currentTarget.dataset.index
    const score = e.detail.value
    this.setData({
      [`students[${index}].score`]: score
    })
  },

  onCommentInput(e) {
    const index = e.currentTarget.dataset.index
    const comment = e.detail.value
    this.setData({
      [`students[${index}].comment`]: comment
    })
  },

  onPointsInput(e) {
    const index = e.currentTarget.dataset.index
    const points = e.detail.value
    this.setData({
      [`students[${index}].points_awarded`]: points
    })
  },

  uploadMedia(e) {
    const index = e.currentTarget.dataset.index
    const that = this

    wx.chooseMedia({
      count: 1,
      mediaType: ['image', 'video'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePath = res.tempFiles[0].tempFilePath
        const mediaType = res.tempFiles[0].fileType

        that.setData({
          [`students[${index}].media_url`]: tempFilePath,
          [`students[${index}].media_type`]: mediaType
        })
      }
    })
  },

  previewMedia(e) {
    const url = e.currentTarget.dataset.url
    const type = e.currentTarget.dataset.type

    if (type === 'image') {
      wx.previewImage({
        current: url,
        urls: [url]
      })
    } else if (type === 'video') {
      // 视频预览需要使用视频播放器
      wx.showToast({
        title: '视频预览功能开发中',
        icon: 'none'
      })
    }
  },

  async submitAttendance() {
    const attendance = this.data.students.map(student => ({
      student_id: student.id,
      status: student.status || 'normal',
      score: student.score || 0,
      comment: student.comment || '',
      points_awarded: student.points_awarded || 0,
      media_type: student.media_type,
      media_url: student.media_url
    }))

    try {
      wx.showLoading({ title: '提交中...' })

      await submitClassAttendance(this.data.recordId, { attendance })

      wx.hideLoading()

      wx.showToast({
        title: '提交成功',
        icon: 'success'
      })

      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (error) {
      wx.hideLoading()
      console.error('提交考勤失败:', error)
    }
  },

  startClass() {
    wx.showModal({
      title: '提示',
      content: '确定开始上课吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '上课开始',
            icon: 'success'
          })
        }
      }
    })
  }
})
