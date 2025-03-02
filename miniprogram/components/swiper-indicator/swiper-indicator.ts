// components/swiper-indicator/swiper-indicator.ts
import { ComponentWithStore } from 'mobx-miniprogram-bindings';
import { albumsStore } from '../../stores/albumsStore';
import { uiStore } from '../../stores/uiStore';

ComponentWithStore({
  storeBindings: [
    {
      store: albumsStore,
      fields: ['albums'],
      actions: ['uddateAlbums'],
    },
    {
      store: uiStore,
      fields: ['displayedAlbumIndex'],
      actions: ['setDisplayedAlbumIndex'],
    }
  ],

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})