// components/album/album.ts
Component({

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
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShown: true,
    firstImageUrl: '',
    secondImageUrl: '',
    activatedIndex: 0,
    currentImageIndex: 0
  },

  lifetimes: {
    attached: function() {
      this.setData({
        firstImageUrl: this.data.photos[0].imageUrl
      });
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
      setTimeout(() => {
        const newIndex = (this.data.currentImageIndex + 1) % this.data.photos.length;
        const url = this.data.photos[newIndex].imageUrl
        this.setData({
          currentImageIndex: newIndex
        });
        this.setData({
          secondImageUrl: url
        });
      }, 4000);
    },

    onSecondImageLoad() {
      this.setData({
        activatedIndex: 1
      });
      setTimeout(() => {
        const newIndex = (this.data.currentImageIndex + 1) % this.data.photos.length;
        const url = this.data.photos[newIndex].imageUrl
        this.setData({
          currentImageIndex: newIndex
        });
        this.setData({
          firstImageUrl: url
        });
      }, 4000);
    },

  },

})