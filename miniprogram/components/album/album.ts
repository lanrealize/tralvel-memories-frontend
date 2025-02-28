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
    backgroundUrl: ''
  },

  lifetimes: {
    attached: function() {
      this.changeBgWithTimeout(0);
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeBgWithTimeout(currentIndex: number): void {
      console.log('changed')
      if (this.data.isShown) {
        const currentValue = this.data.photos[currentIndex].imageUrl;
        this.setBackgroundUrl(currentValue)
        currentIndex = (currentIndex + 1) % this.data.photos.length;
      } else {
        return;
      }
      setTimeout(() => this.changeBgWithTimeout(currentIndex), 5000);
    },

    setBackgroundUrl(bgUrl: string): void {
      this.setData({
        backgroundUrl: bgUrl
      });
    },

  },

})