// components/photo-player/photo-player.ts
import { ComponentWithStore } from 'mobx-miniprogram-bindings';
import { uiStore } from '../../stores/uiStore';
import { photosStore } from '../../stores/photosStore';
import { setNavBarTextColor } from '../../utils/utils';
import { DIRECT_MAPPING, REVERSED_DIRECT_MAPPING } from '../../configs/photoPlayer';

ComponentWithStore({
  storeBindings: [
    {
      store: uiStore,
      fields: ['photoPlayerShown', 'photoPlayerOpacity', 'photosTitleColor', 'photoPlayerNodeActivatedIndex'],
      actions: ['setPhotoPlayerShown', 'setPhotoPlayerOpacity', 'setPhotoPlayerNodeActivatedIndex'],
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

    photoPlayerNodeActivatedIndex: '',
    imageSwitching: false,
    currentImageIndex: 0
  },

  lifetimes: {
    attached: function() {
      (this as any).setPhotoPlayerNodeActivatedIndex('');
      wx.nextTick(() => {
        this.initialize();
      });
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

    onItemImageLoad(event: any) {
      this.onImageLoad(event.detail.index);
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
      const nextIndex = this.getNextIndex();

      setTimeout(() => {
        this.updateImageData(nextIndex, (this as any).data.photos[0].imageUrl, (this as any).data.photos[0].description);
      }, 1500);
    },

    updateImageData(toBeActivatedIndex: string, url: string, description: string) {
      const prefix = toBeActivatedIndex;
      const urlKey = `${prefix}ImageUrl`;
      const descriptionKey = `${prefix}ImageDescription`;
      const existKey = `${prefix}ImageExist`;

      this.setData({
        [existKey]: true
      });
    
      if (url === (this as any).data[urlKey]) {
        this.setData({ [urlKey]: '' });
      }
      
      this.setData({
        [urlKey]: url,
        [descriptionKey]: description
      });
    },

    clearLastImage(index: string) {
      const prefix = index;
      const existKey = `${prefix}ImageExist`;
      const urlKey = `${prefix}ImageUrl`;

      setTimeout(() => {
        this.setData({
          [urlKey]: '',
          [existKey]: false 
        });
      }, 2000);
    },

    onImageLoad(instance: string) {
      const currentIndex = (this as any).data.photoPlayerNodeActivatedIndex;
      if (currentIndex in REVERSED_DIRECT_MAPPING) {
        this.clearLastImage(currentIndex);
        this.clearLastImage(REVERSED_DIRECT_MAPPING[currentIndex as keyof typeof REVERSED_DIRECT_MAPPING]);
      } else if (currentIndex in DIRECT_MAPPING) {
        {}
      } else {
        this.clearLastImage(currentIndex);
      }
      
      (this as any).setPhotoPlayerNodeActivatedIndex(instance);
      wx.nextTick(() => {
        const toBeActivatedIndex = this.getNextIndex();
        this.preloadDeactivatedImageInSeconds(toBeActivatedIndex, 4000);
      });
    },

    getNextIndex() {

      const currentIndex = (this as any).data.photoPlayerNodeActivatedIndex;

      if (currentIndex in DIRECT_MAPPING) {
        return DIRECT_MAPPING[currentIndex as keyof typeof DIRECT_MAPPING];
      }

      const nextIndex = currentIndex === '' ? 0 : ((this as any).data.currentImageIndex + 1) % (this as any).data.photos.length;
      const nextPhotoOrientation = (this as any).data.photos[nextIndex].orientation;
      if (nextIndex + 1 === (this as any).data.photos.length) {
        if (nextPhotoOrientation === 'vertical') {
          return currentIndex === 'first' ? 'second' : 'first';
        } else {
          return currentIndex === 'fifteenth' ? 'sixteenth' : 'fifteenth';
        }
      } else {
        const nextNextIndex = currentIndex === '' ? 1 : ((this as any).data.currentImageIndex + 2) % (this as any).data.photos.length;
        const nextNextPhotoOrientation = (this as any).data.photos[nextNextIndex].orientation;

        if (nextPhotoOrientation === 'vertical') {
          if (nextNextPhotoOrientation === 'vertical') {
            return currentIndex === 'first' ? 'second' : 'first';
          } else {
            return currentIndex === 'fourth' ? 'fifth' : 'third'; 
          }
        } else {
          if (nextNextPhotoOrientation === 'vertical') {
            return currentIndex === 'eighth' ? 'ninth' : 'seventh'; 
          } else {
            return currentIndex === 'twelfth' ? 'thirteenth' : 'eleventh'; 
          }
        }
      }
    }
    
  }
})