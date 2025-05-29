// components/photos-swiper-indicator/photos-swiper-indicator.ts
import { ComponentWithStore } from 'mobx-miniprogram-bindings';
import { photosStore } from '../../../stores/photosStore'

ComponentWithStore({
  storeBindings: [
    {
      store: photosStore,
      fields: ['photoCount', 'photoDisplayIndex', 'photoCountArray'],
      actions: ['setPhotoDisplayIndex']
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

  }
})