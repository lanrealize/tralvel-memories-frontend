// components/photos-bottom-menu/photos-bottom-menu.ts
import { ComponentWithStore } from 'mobx-miniprogram-bindings';
import { photoCreationStore } from '../../stores/photoCreationStore';
import { uiStore } from '../../stores/uiStore';
import { photosStore } from '../../stores/photosStore';

ComponentWithStore({

  storeBindings: [
    {
      store: photoCreationStore,
      fields: ['photoCreationComponentTop', 'photoCreationPath'],
      actions: ['setPhotoCreationComponentTop', 'setPhotoCreationPath', 'setPhoteCreationDescription', 'correctPhotoCreationTime', 'updatePhoteCreationLocation']
    },
    {
      store: uiStore,
      fields: ['photoPlayerShown'],
      actions: ['setPhotoPlayerShown', 'setPhotoPlayerOpacity']
    },
    {
      store: photosStore,
      fields: ['photoCount', 'photoDisplayIndex'],
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