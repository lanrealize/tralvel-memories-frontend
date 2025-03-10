// pages/photos/photos.ts
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { photosStore } from '../../stores/photosStore';
import { photoCreationStore } from '../../stores/photoCreationStore';
import { uiStore } from '../../stores/uiStore';
import { getScrollViewTop, setNavBarTextColor } from '../../utils/utils'

Page({

  photosStorageBinding: undefined as any,
  photoCreationStoreBinding: undefined as any,
  pagesStorageBinding: undefined as any,

  /**
   * 页面的初始数据
   */
  data: {
    style: 'opacity: 1; transition: opacity 0.5s ease-in-out;',
    title: '',
    subTitle: '',
    loading: false,
    threshold: 0,
    photoCreationComponentTop: 100,
    photoDisplayTarget: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function() {

    this.calculateScrollThreshold();

    this.photosStorageBinding = createStoreBindings(this, 
      {
        store: photosStore,
        fields: ['photos', 'photoUrls'],
        actions: ['updatePhotos', 'reversePhotos']
      }
    );

    this.photoCreationStoreBinding = createStoreBindings(this, 
      {
        store: photoCreationStore,
        fields: ['photoCreationComponentTop'],
        actions: ['setPhotoCreationComponentTop']
      }
    );

    this.pagesStorageBinding = createStoreBindings(this, 
      {
        store: uiStore,
        fields: ['photosTitleColor', 'photoPlayerShown', 'photoPlayerOpacity'],
        actions: ['setPhotosTitleColor', 'setPhotoPlayerShown', 'setPhotoPlayerOpacity']
      }
    );

    const app: IAppOption = getApp();
    this.setData({
      menuHeight: app.globalData.navigationInfo.menuHeight,
      menuTop: app.globalData.navigationInfo.menuTop,
    });

    await this.updatePhotosOnPage();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    const scrollTop = await getScrollViewTop('scrollarea');
    this.adjustTitlebar(scrollTop as number);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    (this as any).setPhotoPlayerOpacity(0);
    (this as any).setPhotoPlayerShown(false);
    this.photosStorageBinding.destroyStoreBindings();
    this.photoCreationStoreBinding.destroyStoreBindings();
    this.pagesStorageBinding.destroyStoreBindings();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  async updatePhotosOnPage() {
    const openID =wx.getStorageSync('openID');
    const albumID =wx.getStorageSync('albumID');
    (this as any).updatePhotos(openID, albumID);
    this.setFadeInOut();

  },

  setFadeInOut() {
    this.setData({
      style: 'opacity: 0;'
    });
    wx.nextTick(() => {
      this.setData({
        style: 'opacity: 1; transition: opacity 0.5s ease-in-out;'
      });
    })
  },

  onScroll(event: any) {
    this.adjustTitlebar(event.detail.scrollTop);
  },

  calculateScrollThreshold() {
    const app: IAppOption = getApp();
    const threshold = app.globalData.navigationInfo.menuTop + app.globalData.navigationInfo.menuHeight - 70;
    this.setData({
      threshold: threshold
    });
  },

  receivePhotoDelete() {
    // this.setFadeInOut();
  },

  // async adjustTitleBar() {
  //   const scrollTop = await getScrollViewTop('scrollarea');
  // },

  adjustTitlebar(ScrollTop: number) {
    if (ScrollTop > this.data.threshold) {
      if ((this as any).data.photosTitleColor === "black") {
        (this as any).setPhotosTitleColor('white');
        setNavBarTextColor('white');
      };
    } else {
      if ((this as any).data.photosTitleColor === "white") {
        (this as any).setPhotosTitleColor('black');
        setNavBarTextColor('black');
      }
    }
  },

  onAddNewPhoto(event: any) {
    wx.nextTick(() => {
      this.setData({
        photoDisplayTarget: event.detail.id
      });
    });
  }

})