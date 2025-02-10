// components/albums/albums.ts
Component({

  lifetimes: {
    attached: async function() {
      const systemInfo = wx.getSystemInfoSync();
      const windowHeight = systemInfo.windowHeight;
      const offsetInVh = 3.8;
      const offsetInPx = (windowHeight * offsetInVh) / 100;
      this.setData({
        offsetValue: [0, offsetInPx]
      });
    }
  },

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrls: [
      "https://upload-images.jianshu.io/upload_images/15219429-8950836e290475a3.jpeg?imageMogr2/auto-orient/strip|imageView2/2/w/600/format/webp",
      "https://upload-images.jianshu.io/upload_images/15219429-374221497e90fdae.jpeg?imageMogr2/auto-orient/strip|imageView2/2/w/600/format/webp",
      "https://upload-images.jianshu.io/upload_images/15219429-4db7adec7e9a47fe.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp"
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 800,
    circular: true,
    indicatorType: "expand",
    offsetValue: [0, 0],
    spacing: 6,
    radius: 3,
    width: 6,
    height: 5,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  }

})