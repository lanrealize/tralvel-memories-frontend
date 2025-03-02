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
        console.log(`index: ${this.data.index}, changed photo`);
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
      }
    },

    onSecondImageLoad() {
      this.setData({
        activatedIndex: 1
      });
      if (this.data.index === (this as any).data.displayedAlbumIndex) {
        console.log(`index: ${this.data.index}, changed photo`);
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
    }

  },

})