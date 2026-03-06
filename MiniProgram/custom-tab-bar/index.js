Component({
  data: {
    role: '',
    list: []
  },

  methods: {
    setTabBar() {
      const role = getApp().globalData.role
      let list = []

      if (role === 'parent') {
        list = [
          {
            pagePath: '/pages/parent/home/home',
            text: '首页',
            iconPath: '/images/home.png',
            selectedIconPath: '/images/home-active.png'
          },
          {
            pagePath: '/pages/parent/schedule/schedule',
            text: '课表',
            iconPath: '/images/calendar.png',
            selectedIconPath: '/images/calendar-active.png'
          },
          {
            pagePath: '/pages/parent/growth/growth',
            text: '成长',
            iconPath: '/images/growth.png',
            selectedIconPath: '/images/growth-active.png'
          },
          {
            pagePath: '/pages/parent/my/my',
            text: '我的',
            iconPath: '/images/my.png',
            selectedIconPath: '/images/my-active.png'
          }
        ]
      } else if (role === 'coach') {
        list = [
          {
            pagePath: '/pages/coach/home/home',
            text: '首页',
            iconPath: '/images/home.png',
            selectedIconPath: '/images/home-active.png'
          },
          {
            pagePath: '/pages/coach/class/class',
            text: '课堂',
            iconPath: '/images/class.png',
            selectedIconPath: '/images/class-active.png'
          },
          {
            pagePath: '/pages/coach/students/students',
            text: '学生',
            iconPath: '/images/student.png',
            selectedIconPath: '/images/student-active.png'
          },
          {
            pagePath: '/pages/coach/my/my',
            text: '我的',
            iconPath: '/images/my.png',
            selectedIconPath: '/images/my-active.png'
          }
        ]
      }

      this.setData({ role, list })
    }
  },

  lifetimes: {
    attached() {
      this.setTabBar()
    }
  }
})
