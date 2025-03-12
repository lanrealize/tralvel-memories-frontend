// components/albums/albums.ts
import { ComponentWithStore } from 'mobx-miniprogram-bindings';
import { albumsStore } from '../../stores/albumsStore';
import { AlbumsComponentData } from '../../models/component-model/albums-model';
import { uiStore } from '../../stores/uiStore'
import { deleteAlbum } from '../../utils/apis'

ComponentWithStore<any, AlbumsComponentData, any, any, any>({

  storeBindings: [
    {
      store: albumsStore,
      fields: ['albums'],
      actions: ['updateAlbums'],
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
      const albumIndex = (this as any).data.displayedAlbumIndex;
      this.setData({
        albumIndexTarget: albumIndex
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
    indicatorDots: false,
    autoplay: false,
    interval: 6000,
    duration: 800,
    circular: false,
    indicatorType: "expand",
    offsetValue: [0, 0],
    spacing: 6,
    radius: 3,
    width: 6,
    height: 5,
    isSwitching: false,
    albumMaskOpacity: 0,
    albumIndexTarget: 0
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
      wx.navigateTo({ 
        url: `/pages/photos/photos`
      });
    },

    onSwiperChange(event: any) {
      (this as any).setDisplayedAlbumIndex(event.detail.current);
      wx.nextTick(() => {
        this.setDisplayedAlbumTitle(this.data.albums[this.data.displayedAlbumIndex].title);
      })
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
      }
    },

    onAnimationFinish() {
      this.setData({
        isSwitching: false
      });
    },

    onAlbumLongPress() {
      this.setData({
        albumMaskOpacity: 1
      });
    },

    onCoverClick() {
      this.setData({
        albumMaskOpacity: 0
      });
    },

    async onDeleteClick() {
      const oldAlbumIndex = (this as any).data.displayedAlbumIndex;
      const oldAlbumId = (this as any).data.albums[oldAlbumIndex].id;
      const newAlbumIndex = (this as any).data.displayedAlbumIndex === 1 ? 0 : (this as any).data.displayedAlbumIndex - 1;
      (this as any).setDisplayedAlbumIndex(newAlbumIndex);
      this.setData({
        albumIndexTarget: newAlbumIndex
      });

      const child = this.selectComponent(`.albums--${oldAlbumIndex}`);
      if (child) {
        child.onDeleting();
      }

      const openID = wx.getStorageSync('openID');
      await deleteAlbum(openID, oldAlbumId);

      setTimeout(async () => {
        await this.updateAlbums(openID);
        if (child) {
          child.onDeleted();
        }
      }, 800);
      
      this.setData({
        albumMaskOpacity: 0
      });

    }

  }

})