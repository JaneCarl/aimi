App({
  onLaunch() {
    console.log('小程序启动')
  },

  onShow() {
    console.log('小程序显示')
  },

  globalData: {
    userInfo: null,
    token: '',
    role: '', // 'parent' or 'coach'
    currentStudentId: null // 当前选中的孩子ID
  }
})
