// components/albums/albums.ts
import { ComponentWithStore } from 'mobx-miniprogram-bindings';
import { albumsStore } from '../../stores/albumsStore';
import { AlbumsComponentData } from '../../models/component-model/albums-model';
import { uiStore } from '../../stores/uiStore'

ComponentWithStore<any, AlbumsComponentData, any, any, any>({

  storeBindings: [
    {
      store: albumsStore,
      fields: ['albums'],
      actions: ['uddateAlbums'],
    },
    {
      store: uiStore,
      fields: ['displayedAlbumIndex', 'displayedAlbumTitle'],
      actions: ['setDisplayedAlbumIndex', 'setDisplayedAlbumTitle'],
    }
  ],

  lifetimes: {
    attached: async function() {
      this.setOffsetValue();
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
    indicatorDots: false,
    autoplay: false,
    interval: 6000,
    duration: 800,
    circular: true,
    indicatorType: "expand",
    offsetValue: [0, 0],
    spacing: 6,
    radius: 3,
    width: 6,
    height: 5,
    isSwitching: false
  },

  /**
   * 组件的方法列表
   */
  methods: {

    setOffsetValue() {
      const systemInfo = wx.getSystemInfoSync();
      const windowHeight = systemInfo.windowHeight;
      const offsetInVh = 3.8;
      const offsetInPx = (windowHeight * offsetInVh) / 100;
      this.setData({
        offsetValue: [0, offsetInPx]
      });
    },

    onAlbumClick(event: any) {
      var albumid = event.currentTarget.dataset.albumid;
      wx.setStorageSync('albumID', albumid);
      wx.navigateTo({ url: `/pages/photos/photos` });
    },

    onSwiperChange(event: any) {
      (this as any).setDisplayedAlbumIndex(event.detail.current);
      const child = this.selectComponent(`.albums--${event.detail.current}`);
      if (child) {
        child.continueSwitching();
      }
    },

    onSwiperTransition() {
      if (!this.data.isSwitching) {
        this.setData({
          isSwitching: true
        });
        setTimeout(() => {
          this.setDisplayedAlbumTitle(this.data.albums[this.data.displayedAlbumIndex].title);
        }, 150);
      }
    },

    onAnimationFinish() {
      this.setData({
        isSwitching: false
      });
    }

  }

})