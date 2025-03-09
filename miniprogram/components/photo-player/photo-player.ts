// components/photo-player/photo-player.ts
import { ComponentWithStore } from 'mobx-miniprogram-bindings';
import { uiStore } from '../../stores/uiStore'
import { photosStore } from '../../stores/photosStore';
import { setNavBarTextColor } from '../../utils/utils';

ComponentWithStore({
  storeBindings: [
    {
      store: uiStore,
      fields: ['photoPlayerShown', 'photoPlayerOpacity', 'photosTitleColor'],
      actions: ['setPhotoPlayerShown', 'setPhotoPlayerOpacity'],
    },
    {
      store: photosStore,
      fields: ['photos'],
      actions: ['updatePhotos'],
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
    photoPlayerOpacity: 0,
    firstImageUrl: '',
    secondImageUrl: '',
    firstImageDescription: '',
    secondImageDescription: '',
    activatedIndex: '',
    imageSwitching: false,
    currentImageIndex: 0
  },

  lifetimes: {
    attached: function() {
      this.initialize();
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onQuit() {
      (this as any).setPhotoPlayerOpacity(0);
      if ((this as any).data.photosTitleColor === 'black') {
        setNavBarTextColor('black');
      }
      setTimeout(() => {
        (this as any).setPhotoPlayerShown(false);
      }, 1200);
    },

    onFirstImageLoad() {
      this.setData({
        activatedIndex: 'first'
      });
      this.preloadDeactivatedImageInSeconds('second', 4000);
    },

    onSecondImageLoad() {
      this.setData({
        activatedIndex: 'second'
      });
      this.preloadDeactivatedImageInSeconds('first', 4000);
    },

    preloadDeactivatedImageInSeconds(target: string, timeout: number) {
      if ((this as any).data.imageSwitching) {
        return;
      }

      this.setData({
        imageSwitching: true
      });

      setTimeout(() => {
        const newIndex = ((this as any).data.currentImageIndex + 1) % (this as any).data.photos.length;
        const url = (this as any).data.photos[newIndex].imageUrl;
        const description = (this as any).data.photos[newIndex].description;
        this.setData({
          currentImageIndex: newIndex
        });
        this.updateImageData(target, url, description);

        this.setData({
          imageSwitching: false
        });
      }, 
      timeout);
    },

    initialize() {
      setTimeout(() => {
        this.setData({
          firstImageUrl: (this as any).data.photos[0].imageUrl,
          firstImageDescription: (this as any).data.photos[0].description,
        });
      }, 1500);
    },

    updateImageData(activatedIndex: string, url: string, description: string) {
      const prefix = activatedIndex;
      const urlKey = `${prefix}ImageUrl`;
      const descriptionKey = `${prefix}ImageDescription`;
    
      if (url === (this as any).data[urlKey]) {
        this.setData({ [urlKey]: '' });
      }
      
      this.setData({
        [urlKey]: url,
        [descriptionKey]: description
      });
    }
  }
})