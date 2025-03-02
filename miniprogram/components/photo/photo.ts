// components/photo/photo.ts
import { deletePhoto } from '../../utils/apis';
import { photosStore } from '../../stores/photosStore';
import { ComponentWithStore } from 'mobx-miniprogram-bindings';

ComponentWithStore({
  storeBindings: [
    {
      store: photosStore,
      fields: ['photos'],
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
    index: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    opacity: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    previewImage() {
      wx.previewImage({
        current: this.properties.photoUrl,
        urls: this.properties.photoUrls
      });
    },

    onLongPress() {
      this.setOpacity(1);
    },

    setOpacity(opacity: number) {
      this.setData({
        opacity: opacity
      })
    },

    onCoverClick() {
      this.setOpacity(0);
    },

    async onDeleteClick() {
      const openID = wx.getStorageSync('openID');
      const albumID = wx.getStorageSync('albumID');
      await deletePhoto(openID, albumID, this.properties.photoId);
      (this as any).updatePhotos(openID, albumID);
      this.setOpacity(0);
    }
  }
})