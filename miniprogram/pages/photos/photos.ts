// pages/photos/photos.ts
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { photosStore } from '../../stores/photosStore';
import { photoCreationStore } from '../../stores/photoCreationStore';
import { uiStore } from '../../stores/uiStore';

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
    photoDisplayTarget: '',

    autoplay: false,
    interval: 6000,
    duration: 800,
    circular: false,

    apearAnimationClass: '',
    showAppearAnimation: false,

    openAlbumMaskShown: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function() {
    this.adjustMenubarPosition();

    this.photosStorageBinding = createStoreBindings(this, 
      {
        store: photosStore,
        fields: ['photos', 'photoUrls', 'photoDisplayIndex'],
        actions: ['updatePhotos', 'reversePhotos', 'setPhotoDisplayIndex']
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
    
    try {
      await this.updatePhotosOnPage();
    } catch (e) {
      //TODO need handle here
    }
    
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
    setTimeout(() => {
      this.setData({
        openAlbumMaskShown: false
      });
    }, 300);
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
    const openID = wx.getStorageSync('openID');
    const albumID = wx.getStorageSync('albumID');
    (this as any).updatePhotos(openID, albumID);
  },

  onSwiperChange(e: any) {
    (this as any).setPhotoDisplayIndex(e.detail.current);
  },

  showAppearAnimation() {
    this.setData({
      showAppearAnimation: true,
      apearAnimationClass: 'active'
    });
  },

  adjustMenubarPosition() {
    const app: IAppOption = getApp();
      this.setData({
        menuHeight: app.globalData.navigationInfo.menuHeight,
        menuTop: app.globalData.navigationInfo.menuTop,
        menuLeft: app.globalData.navigationInfo.menuLeft
      });
  }

})