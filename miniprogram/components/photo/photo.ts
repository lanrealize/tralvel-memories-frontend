// components/photo/photo.ts
Component({

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
      // await deletePhoto(this.properties.photoId);
      this.setOpacity(0);
    }
  }
})