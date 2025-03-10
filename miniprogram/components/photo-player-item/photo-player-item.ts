// components/photo-player-item/photo-player-item.ts
import { ComponentWithStore } from 'mobx-miniprogram-bindings';
import { uiStore } from '../../stores/uiStore'

ComponentWithStore({
  storeBindings: [
    {
      store: uiStore,
      fields: ['photoPlayerNodeActivatedIndex'],
      actions: ['setPhotoPlayerNodeActivatedIndex'],
    }
  ],

  /**
   * 组件的属性列表
   */
  properties: {
    top: {
      type: Number,
      value: 0
    },
    height: {
      type: Number,
      value: 0
    },
    imageUrl: {
      type: String,
      value: ''
    },
    selfIndex: {
      type: String,
      value: ''
    },
    imageDescription: {
      type: String,
      value: ''
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
    onimageLoad() {
      this.triggerEvent('onImageLoad', {index: this.data.selfIndex});
    }
  }
})