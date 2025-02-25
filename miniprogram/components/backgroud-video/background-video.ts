// components/backgroud-video/background-video.ts
import { ComponentWithStore } from 'mobx-miniprogram-bindings';
import { uiStore } from '../../stores/uiStore'

ComponentWithStore({

  storeBindings: [
    {
      store: uiStore,
      fields: ['mainStartLoading'],
      actions: ['setMainStartLoading']
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

    async onStartClick() {
      this.triggerEvent('onLoginSuccess');
    },

  }
})