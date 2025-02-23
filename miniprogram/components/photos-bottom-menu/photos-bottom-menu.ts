// components/photos-bottom-menu/photos-bottom-menu.ts
import { ComponentWithStore } from 'mobx-miniprogram-bindings';
import { photoCreationStore } from '../../stores/photoCreationStore'
import { chooseImage } from '../../utils/utils';

ComponentWithStore({

  storeBindings: [
    {
      store: photoCreationStore,
      fields: ['photoCreationComponentTop', 'photoCreationPath'],
      actions: ['setPhotoCreationComponentTop', 'setPhotoCreationPath']
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
    async onAddClick() {
      try {
        const photoPath = await chooseImage();
        (this as any).setPhotoCreationPath(photoPath);
        (this as any).setPhotoCreationComponentTop(0);
      } catch (e) {
        console.log(e);
      }
    },
  }
})