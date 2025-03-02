// components/photos-top-menu/photos-top-menu.ts
import { ComponentWithStore } from 'mobx-miniprogram-bindings';
import { uiStore } from '../../stores/uiStore'

ComponentWithStore({

  storeBindings: [
    {
      store: uiStore,
      fields: ['photosTitleColor', 'displayedAlbumTitle'],
      actions: {setLoginStatus: 'setPhotosTitleColor'}
    }
  ],

  /**
   * 组件的属性列表
   */
  properties: {

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
      wx.navigateBack();
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