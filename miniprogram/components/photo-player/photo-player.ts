// components/photo-player/photo-player.ts
import { ComponentWithStore } from 'mobx-miniprogram-bindings';
import { uiStore } from '../../stores/uiStore'

ComponentWithStore({
  storeBindings: [
    {
      store: uiStore,
      fields: ['photoPlayerShown', 'photoPlayerOpacity'],
      actions: ['setPhotoPlayerShown', 'setPhotoPlayerOpacity'],
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
    photoPlayerOpacity: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onQuit() {
      (this as any).setPhotoPlayerOpacity(0);
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#ff0000',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      });
      setTimeout(() => {
        (this as any).setPhotoPlayerShown(false);
      }, 1200);
    }
  }
})