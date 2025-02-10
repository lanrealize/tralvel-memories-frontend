// components/albums/albums.ts
Component({

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
    duration: 500,
    circular: true
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})