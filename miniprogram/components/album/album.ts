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
    pending: true
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
        setTimeout(() => {
          const newIndex = ((this as any).data.currentImageIndex + 1) % this.data.photos.length;
          const url = this.data.photos[newIndex].imageUrl
          this.setData({
            currentImageIndex: newIndex
          });
          this.setData({
            secondImageUrl: url
          });
        }, 4000);
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
        setTimeout(() => {
          const newIndex = ((this as any).data.currentImageIndex + 1) % this.data.photos.length;
          const url = this.data.photos[newIndex].imageUrl
          this.setData({
            currentImageIndex: newIndex
          });
          this.setData({
            firstImageUrl: url
          });
        }, 4000);
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
      setTimeout(() => {
        const newIndex = ((this as any).data.currentImageIndex + 1) % this.data.photos.length;
        const url = this.data.photos[newIndex].imageUrl
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
      }, 4000);
    }

  },

})