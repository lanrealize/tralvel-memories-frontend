// components/photo-player/photo-player.ts
import { ComponentWithStore } from 'mobx-miniprogram-bindings';
import { uiStore } from '../../stores/uiStore'
import { photosStore } from '../../stores/photosStore';

ComponentWithStore({
  storeBindings: [
    {
      store: uiStore,
      fields: ['photoPlayerShown', 'photoPlayerOpacity'],
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
    activatedIndex: 1,
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
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ff0000',
        animation: {
          duration: 15000,
          timingFunc: 'easeIn'
        }
      });
      setTimeout(() => {
        (this as any).setPhotoPlayerShown(false);
      }, 1200);
    },

    onFirstImageLoad() {
      this.setData({
        activatedIndex: 0
      });
      this.preloadDeactivatedImageInSeconds(4000);
    },

    onSecondImageLoad() {
      this.setData({
        activatedIndex: 1
      });
      this.preloadDeactivatedImageInSeconds(4000);
    },

    preloadDeactivatedImageInSeconds(timeout: number) {
      if ((this as any).data.imageSwitching) {
        return;
      }

      this.setData({
        imageSwitching: true
      });

      setTimeout(() => {
        const newIndex = ((this as any).data.currentImageIndex + 1) % (this as any).data.photos.length;
        const url = (this as any).data.photos[newIndex].imageUrl
        this.setData({
          currentImageIndex: newIndex
        });
        if ((this as any).data.activatedIndex === 0) {
          this.setData({
            secondImageUrl: url
          });
        } else {
          this.setData({
            firstImageUrl: url
          });
        }

        this.setData({
          imageSwitching: false
        });
      }, timeout);
    },

    initialize() {
      setTimeout(() => {
        this.setData({
          firstImageUrl: (this as any).data.photos[0].imageUrl,
        });
      }, 1500);
    },
  }
})