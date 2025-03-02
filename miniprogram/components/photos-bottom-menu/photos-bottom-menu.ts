// components/photos-bottom-menu/photos-bottom-menu.ts
import { ComponentWithStore } from 'mobx-miniprogram-bindings';
import { photoCreationStore } from '../../stores/photoCreationStore'
import { chooseImage } from '../../utils/utils';
import { getRandomWord } from '../../utils/apis';

ComponentWithStore({

  storeBindings: [
    {
      store: photoCreationStore,
      fields: ['photoCreationComponentTop', 'photoCreationPath'],
      actions: ['setPhotoCreationComponentTop', 'setPhotoCreationPath', 'setPhoteCreationDescription']
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
        const description = await getRandomWord();
        (this as any).setPhoteCreationDescription(description);
        (this as any).setPhotoCreationComponentTop(0);
      } catch (e) {
        console.log(e);
      }
    },
  }
})