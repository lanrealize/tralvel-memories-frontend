// pages/photos/photos.ts
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { photosStore } from '../../stores/photosStore';
import { photoCreationStore } from '../../stores/photoCreationStore';
import { uiStore } from '../../stores/uiStore';
import { calculateColor, calculateLeft, chooseImage, setNavBarTextColor, buildShareLink } from "../../utils/utils";
import { getRandomWord, deletePhoto } from '../../utils/apis';

Page({

  photosStorageBinding: undefined as any,
  photoCreationStoreBinding: undefined as any,
  pagesStorageBinding: undefined as any,

  /**
   * 页面的初始数据
   */
  data: {
    openID: '',
    albumID: '',

    style: 'opacity: 1; transition: opacity 0.5s ease-in-out;',
    title: '',
    subTitle: '',
    coverPhotoIsLoading: true,
    threshold: 0,
    photoCreationComponentTop: 100,
    photoIndexTarget: '',

    autoplay: false,
    interval: 6000,
    duration: 800,
    circular: false,

    apearAnimationClass: '',
    showAppearAnimation: false,

    openAlbumMaskShown: true,

    isShared: false,
    sharedInitialized: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options: any) {
    this.adjustMenubarPosition();

    this.photosStorageBinding = createStoreBindings(this, 
      {
        store: photosStore,
        fields: ['photos', 'photoUrls', 'photoDisplayIndex', 'photoCountArray', 'photoCount', 'photoIsSwitching'],
        actions: ['updatePhotos', 'reversePhotos', 'setPhotoDisplayIndex', 'setPhotoColorArray', 'setPhotoDisplayLeft', 'setPhotoIsSwitching', 'setShownPhotoLocation', 'setShownPhotoTimestamp']
      }
    );

    this.photoCreationStoreBinding = createStoreBindings(this, 
      {
        store: photoCreationStore,
        fields: ['photoCreationComponentTop'],
        actions: ['setPhotoCreationComponentTop', 'setPhotoCreationPath', 'setPhoteCreationDescription', 'updatePhoteCreationLocation', 'correctPhotoCreationTime']
      }
    );

    this.pagesStorageBinding = createStoreBindings(this, 
      {
        store: uiStore,
        fields: ['photosTitleColor', 'photoPlayerShown', 'photoPlayerOpacity'],
        actions: ['setPhotosTitleColor', 'setPhotoPlayerShown', 'setPhotoPlayerOpacity']
      }
    );
    
    if (options.isShared) {
      this.setData({
        openID: options.openID,
        albumID: options.albumID,
        isShared: true
      });
    } else {
      this.setData({
        openID: wx.getStorageSync('openID'),
        albumID: wx.getStorageSync('albumID')
      });
    }
    
    try {
      await (this as any).updatePhotos(
        this.data.openID, 
        this.data.albumID,
        options.index ? parseInt(options.index) : 0);
      this.photosStorageBinding.updateStoreBindings();
    } catch (e) { 
      console.log('Failed to load images in album on photos page.');
    }
    this.setData({
      photoIndexTarget: options.index ? options.index : 0
    });
    setTimeout(() => {
      (this as any).setPhotoIsSwitching(false);
    }, 2000);
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
    this.photosStorageBinding?.destroyStoreBindings();
    this.photoCreationStoreBinding?.destroyStoreBindings();
    this.pagesStorageBinding?.destroyStoreBindings();
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
    const shareLink = buildShareLink(this.data.openID, this.data.albumID, (this as any).data.photoDisplayIndex);
    return {
      path: shareLink
    };
  },

  onSwiperChange(e: any) {
    // update displayed time and location
    wx.nextTick(() => {
      setTimeout(() => {
        if ((this as any).data.photos[e.detail.current].location) {
          (this as any).setShownPhotoLocation((this as any).data.photos[e.detail.current].location);
        } else {
          (this as any).setShownPhotoLocation('无位置信息')
        }
        (this as any).setShownPhotoTimestamp((this as any).data.photos[e.detail.current].timestamp);
      }, 200);
    });

    // update swiper related items
    let colorArray = (this as any).data.photoCountArray.map((num: number) => calculateColor(
      (this as any).data.photoCount, num, e.detail.current));
    (this as any).setPhotoColorArray(colorArray);
    (this as any).setPhotoDisplayLeft(calculateLeft((this as any).data.photoCount, e.detail.current));

    // photo display animation related
    if(e.detail.source === 'touch') {
      this.manageDisplyedImgaeAnimation((this as any).data.photoDisplayIndex, e.detail.current);
    }
    
    // update index
    (this as any).setPhotoDisplayIndex(e.detail.current);
  },

  onSwiperTransition() {
    if (!(this as any).data.photoIsSwitching) {
      (this as any).setPhotoIsSwitching(true);
    }
  },

  onSwiperAnimationFinish() {
    (this as any).setPhotoIsSwitching(false);
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
  },

  async onAddClick() {
    try {
      const photoPath = await chooseImage();
      (this as any).setPhotoCreationPath(photoPath);
      (async () => {
        const description = await getRandomWord();
        (this as any).setPhoteCreationDescription(description);
        (this as any).updatePhoteCreationLocation();
      })();
      (this as any).correctPhotoCreationTime();
      setNavBarTextColor('black', '');
      (this as any).setPhotoCreationComponentTop(0);
    } catch (e) {
      console.log(e);
    }
  },

  onHomeClick() {
    const pages = getCurrentPages(); // 获取当前页面栈
    const prevPage = pages[pages.length - 2]; // 上一页页面对象（如果存在）

    // 检查上一页是否是首页（根据页面路径判断）
    const isPrevPageHome = prevPage && prevPage.route === 'pages/index/index';

    if (isPrevPageHome) {
      // 情况1：上一页是首页，直接返回
      wx.navigateBack();
    } else {
      // 情况2：上一页不是首页，跳转到首页
      wx.navigateTo({
        url: '/pages/index/index'
      });
    }
  },

  manageDisplyedImgaeAnimation(beforeIndex: number = -1, afterIndex: number) {
    if (-1 !== beforeIndex) {
      const childBefore = this.selectComponent(`.photos--${beforeIndex}`);
      if (childBefore) {
        childBefore.revertShowAnimation();
      }
    }
    const childAfter = this.selectComponent(`.photos--${afterIndex}`);
    if (childAfter) {
      childAfter.setShowAnimation();
    }
  },

  viewInitialize() {
    if (this.data.isShared) {
      this.showAppearAnimation();
      setTimeout(() => {
        this.setData({
          sharedInitialized: true
        });
        setTimeout(() => {
          this.manageDisplyedImgaeAnimation(-1, (this as any).data.photoDisplayIndex)
        }, 1500);
      }, 4000);
    } else {
      setTimeout(() => {
        this.setData({
          openAlbumMaskShown: false
        });
        setTimeout(() => {
          this.manageDisplyedImgaeAnimation(-1, (this as any).data.photoDisplayIndex)
        }, 300);
      }, 300);
    }
  },

  onImageload() {
    this.setData({
      coverPhotoIsLoading: false
    });
    this.viewInitialize();
  },

  async onDeleteClick() {
    const oldPhotoIndex = (this as any).data.photoDisplayIndex;
    const oldPhotoId = (this as any).data.photos[oldPhotoIndex].id;
    const newPhotoIndex = (this as any).data.photoDisplayIndex === 0 ? 1 : (this as any).data.photoDisplayIndex - 1;
    (this as any).setPhotoDisplayIndex(newPhotoIndex);
    this.setData({
      photoIndexTarget: newPhotoIndex as any
    });

    await deletePhoto(this.data.openID, this.data.albumID, oldPhotoId);

    setTimeout(async () => {
      await (this as any).updatePhotos(
        this.data.openID, 
        this.data.albumID,
        oldPhotoIndex === 0 ? 0 : newPhotoIndex);
    }, 800);
  },

})