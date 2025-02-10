// components/albums/albums.ts
import { getAlbums } from '../../utils/apis';
import { mockWxLogin } from '../../utils/utils';

Component({

  lifetimes: {
    attached: async function() {
      this.setOffsetValue();
      await mockWxLogin();
      await this.updateAlubms();
      console.log(this.data.albums);
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
    albums: [] as object[]
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

    setAlbums(albums: any): void {
      this.setData({
        'albums': albums
      });
    },

    async updateAlubms() {
      try {
        const albumList = await getAlbums();
        this.setAlbums(albumList);
      } catch (e) {
        throw (e);
      }
    }

  }

})