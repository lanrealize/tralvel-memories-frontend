// pages/photos/photos.ts
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { photosStore } from '../../stores/photosStore';
import { photoCreationStore } from '../../stores/photoCreationStore';
import { pagesStore } from '../../stores/pagesStore';

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
    threshold: 0
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
        store: pagesStore,
        fields: ['photosTitleColor'],
        actions: ['setPhotosTitleColor']
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
  onShow() {

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
    this.photosStorageBinding.destroy();
    this.photoCreationStoreBinding.destroy();
    this.photosStorageBinding.destroy();
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
    if (event.detail.scrollTop > this.data.threshold) {
      if ((this as any).data.photosTitleColor === "black") {
        (this as any).setPhotosTitleColor('white');
      }
    } else {
      if ((this as any).data.photosTitleColor === "white") {
        (this as any).setPhotosTitleColor('black');
      }
    }
  },

  calculateScrollThreshold() {
    const app: IAppOption = getApp();
    const threshold = app.globalData.navigationInfo.menuTop + app.globalData.navigationInfo.menuHeight
    this.setData({
      threshold: threshold
    });
  }

})