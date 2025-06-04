// components/photo/photo.ts
import { photosStore } from '../../stores/photosStore';
import { ComponentWithStore } from 'mobx-miniprogram-bindings';

ComponentWithStore({
  storeBindings: [
    {
      store: photosStore,
      fields: ['photos', 'photoDisplayIndex'],
      actions: ['updatePhotos']
    }
  ],

  /**
   * 组件的属性列表
   */
  properties: {
    photoId: {
      type: String,
      value: undefined
    },
    title: {
      type: String,
      value: undefined
    },
    subTitle: {
      type: String,
      value: undefined
    },
    location: {
      type: String,
      value: undefined
    },
    description: {
      type: String,
      value: undefined
    },
    photoUrl: {
      type: String,
      value: undefined
    },
    type: {
      type: String,
      value: undefined
    },
    photoUrls: {
      type: Array,
      value: []
    },
    photoOrientation: {
      type: String,
      value: ''
    },
    photoLocation: {
      type: String,
      value: ''
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
    deleted: false,
    isDeleting: false,
    isLoading: true,
    longLoading: false,
    animationClass: ''
  },
  
  lifetimes: {
    attached: function() {
      setTimeout(() => {
        this.setData({
        longLoading: true
        });
      }, 1000);
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPhotoLoad() {
      this.setData({
        isLoading: false
      });
      if (this.data.index === (this as any).data.photoDisplayIndex) {
        this.triggerEvent('onImageload', {index: this.data.index});
      } 
    },

    setShowAnimation (delay: number = 0) {
      setTimeout(() => {
        this.setData({
          animationClass: 'animation'
        });
      }, 800 + delay);
    },

    revertShowAnimation () {
      setTimeout(() => {
        this.setData({
          animationClass: ''
        });
      }, 800);
    },
  }
})