// components/album/album.ts
import { ComponentWithStore } from 'mobx-miniprogram-bindings';
import { uiStore } from '../../stores/uiStore'

ComponentWithStore({
  storeBindings: [
    {
      store: uiStore,
      fields: ['displayedAlbumIndex'],
      actions: ['setDisplayedAlbumIndex'],
    }
  ],

  /**
   * 组件的属性列表
   */
  properties: {
    albumId: {
      type: String,
      value: undefined
    },
    albumTitle: {
      type: String,
      value: undefined
    },
    photos: {
      type: Array,
      value: [{imageUrl: ''}]
    },
    index: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    firstImageUrl: '',
    secondImageUrl: '',
    activatedIndex: -1,
    currentImageIndex: 0,
    pending: true,
    imageSwitching: false,
    deleted: false
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
    onFirstImageLoad() {
      this.setData({
        activatedIndex: 0
      });
      if (this.data.index === (this as any).data.displayedAlbumIndex) {
        this.setData({
          pending: false
        });
        this.preloadDeactivatedImageInSeconds(4000);
      } else {
        this.setData({
          pending: true
        });
      }
    },

    onSecondImageLoad() {
      this.setData({
        activatedIndex: 1
      });
      if (this.data.index === (this as any).data.displayedAlbumIndex) {
        this.setData({
          pending: false
        });
        this.preloadDeactivatedImageInSeconds(4000);
      } else {
        this.setData({
          pending: true
        });
      }
    },

    initialize() {
      this.setData({
        activatedIndex: -1,
        currentImageIndex: 0,
        firstImageUrl: this.data.photos[0].imageUrl,
      });
    },

    continueSwitching() {
      this.setData({
        pending: false
      });
      this.preloadDeactivatedImageInSeconds(4000);
    },


    // when only 2 images, 1st container load 1st iamge, 2nd container preload 2nd iamge. Then 1st container preload 1st image again (if we have more than 2 iamge then in this situation 1st container will preload 3rd imgae) which will not trigger bindload method.
    preloadDeactivatedImageInSeconds(timeout: number) {
      if ((this as any).data.imageSwitching) {
        return;
      }

      this.setData({
        imageSwitching: true
      });

      console.log(`Changed image for ${this.data.index}th album to ${(this as any).data.currentImageIndex}th image`)
      setTimeout(() => {
        const newIndex = ((this as any).data.currentImageIndex + 1) % this.data.photos.length;
        const url = this.data.photos[newIndex].imageUrl
        this.setData({
          currentImageIndex: newIndex
        });
        if ((this as any).data.activatedIndex === 0) {
          if (url === (this as any).data.secondImageUrl) {
            this.setData({
              secondImageUrl: ''
            });
          }
          this.setData({
            secondImageUrl: url
          });
        } else {
          if(url === (this as any).data.firstImageUrl) {
            this.setData({
              firstImageUrl: ''
            });
          }
          this.setData({
            firstImageUrl: url
          });
        }

        this.setData({
          imageSwitching: false
        });
      }, timeout);
    },

    onDeleting() {
      this.setData({
        deleted: true
      });
    },

    onDeleted() {
      this.setData({
        deleted: false
      });
    }

  },

})