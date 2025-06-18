// components/photos-bottom-menu/photos-timeline/photos-timeline.ts
import { ComponentWithStore } from 'mobx-miniprogram-bindings';
import { photosStore } from '../../../stores/photosStore';

ComponentWithStore({
  storeBindings: [
    {
      store: photosStore,
      fields: ['timelineSpacings', 'photoDisplayIndex', 'photoCountArray', 'photoCount'],
      actions: []
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