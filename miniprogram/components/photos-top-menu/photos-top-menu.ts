// components/photos-top-menu/photos-top-menu.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "2024年9月 大同"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onHomeClick() {
      wx.navigateTo({
        url: '/pages/index/index'
      });
    }
  },

  lifetimes: {
    attached: function () {
      const app: IAppOption = getApp();
      this.setData({
        menuHeight: app.globalData.navigationInfo.menuHeight,
        menuTop: app.globalData.navigationInfo.menuTop,
      })
    },
  }

})