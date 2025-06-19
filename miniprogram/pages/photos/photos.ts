// pages/photos/photos.ts
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { photosStore } from '../../stores/photosStore';
import { photoCreationStore } from '../../stores/photoCreationStore';
import { uiStore } from '../../stores/uiStore';
import { chooseImage, setNavBarTextColor, buildShareLink } from "../../utils/utils";
import { getRandomWord, deletePhoto, deleteAlbum } from '../../utils/apis';

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
    duration: 650,
    circular: false,

    apearAnimationClass: '',
    showAppearAnimation: false,

    openAlbumMaskShown: true,

    isShared: false,
    sharedInitialized: false,

    forceRemoveAnimation: false,

    loadPhotosFailed: false,

    isPlaying: false,
    playShow: true,
    timer: -1,
    autoPlayTimers: [] as any [],
    isPlaySwitching: false,

    dynamicWordsTimers: [] as any[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options: any) {
    this.adjustMenubarPosition();

    this.photosStorageBinding = createStoreBindings(this, 
      {
        store: photosStore,
        fields: ['photos', 'photoDisplayIndex', 'photoCount', 'photoIsSwitching'],
        actions: ['updatePhotos', 'reversePhotos', 'setPhotoDisplayIndex', 'setPhotoIsSwitching', 'setShownPhotoLocation', 'setShownPhotoTimestamp', 'setPhotoDisplayLeft']
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
        actions: ['setPhotosTitleColor', 'setPhotoPlayerShown', 'setPhotoPlayerOpacity', 'setDynamicWordsAnimationClass']
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
        0, 
        options.photoID ? options.photoID : '');
      this.photosStorageBinding.updateStoreBindings();
    } catch (e) {
      this.setData({loadPhotosFailed: true});
      console.log('Failed to load images in album on photos page.' + e);
      return;
    }
    this.switchWithoutAnimation((this as any).data.photoDisplayIndex);
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
    this.pausePlay();
    this.clearDynamicWordsTimer();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.pausePlay();
    this.clearDynamicWordsTimer();
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
    const photoID = (this as any).data.photos[(this as any).data.photoDisplayIndex].id;
    const shareLink = buildShareLink(this.data.openID, this.data.albumID, photoID);
    return {
      path: shareLink,
      imageUrl: (this as any).data.photos[(this as any).data.photoDisplayIndex].imageUrl
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

    // update timeline related items
    (this as any).setPhotoDisplayLeft(e.detail.current);

    // photo display animation related
    if(e.detail.source === 'touch') {
      this.pausePlay();
    }
    
    // update index
    (this as any).setPhotoDisplayIndex(e.detail.current);
  },

  onSwiperTransition() {
    if (!(this as any).data.photoIsSwitching) {
      (this as any).setPhotoIsSwitching(true);
      this.clearDynamicWordsTimer();
      (this as any).setDynamicWordsAnimationClass('');
    }
  },

  onSwiperAnimationFinish(e: any) {
    (this as any).setPhotoIsSwitching(false);
    if(e.detail.source === 'touch') {
      this.manageDisplyedImgaeAnimation(true, e.detail.current);
    }
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

  beforeAddNewPhoto() {
    this.setForceRemoveAnimation(true);
  },

  onAddNewPhoto() {
    this.pausePlay();
    setTimeout(() => {
      this.switchWithoutAnimation((this as any).data.photoCount - 1);
      setTimeout(() => {
        this.setForceRemoveAnimation(false);
      }, 100);
    }, 200);
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
      // wx.navigateTo({
      //   url: '/pages/index/index'
      // });
      wx.reLaunch({
        url: '/pages/index/index' // 替换为目标页面路径
      })
    }
  },

  manageDisplyedImgaeAnimation(adjustBeforeIndex: boolean = false, afterIndex: number, delay: number = 0) {
    if (adjustBeforeIndex) {
      for (let idx = 0; idx < (this as any).data.photoCount; idx++) {
        if (idx !== afterIndex) {
          const childBefore = this.selectComponent(`.photos--${idx}`);
          if (childBefore) {
            childBefore.revertShowAnimation();
          }
        }
      }
    }

    const childAfter = this.selectComponent(`.photos--${afterIndex}`);
    if (childAfter) {
      childAfter.setShowAnimation(delay);
    }
    this.scheduleDynamicWordsAnimation();
  },

  viewInitialize() {
    if (this.data.isShared) {
      this.showAppearAnimation();
      setTimeout(() => {
        this.setData({
          sharedInitialized: true
        });
        setTimeout(() => {
          this.manageDisplyedImgaeAnimation(false, (this as any).data.photoDisplayIndex);

        }, 1500);
      }, 4000);
    } else {
      setTimeout(() => {
        this.setData({
          openAlbumMaskShown: false
        });
        setTimeout(() => {
          this.manageDisplyedImgaeAnimation(false, (this as any).data.photoDisplayIndex);
        }, 300);
      }, 150);
    }
  },

  startAutoPlay() {
    this.clearAutoPlayTimer();
    const autoPlayTimer = setTimeout(() => {
      this.startPlay();
    }, 6000);
    const currentAutoPlayTimers = this.data.autoPlayTimers;
    this.setData({
      autoPlayTimers: [...currentAutoPlayTimers, autoPlayTimer]
    });
  },

  onImageload() {
    this.setData({
      coverPhotoIsLoading: false
    });
    this.viewInitialize();
  },

  async onDeleteClick() {
    this.pausePlay();
    const length = (this as any).data.photoCount;
    const oldPhotoIndex = (this as any).data.photoDisplayIndex;
    const oldPhotoId = (this as any).data.photos[oldPhotoIndex].id;
    const newPhotoIndex = (this as any).data.photoDisplayIndex === 0 ? 1 : (this as any).data.photoDisplayIndex - 1;
    (this as any).setPhotoDisplayIndex(newPhotoIndex);
    this.setData({
      photoIndexTarget: newPhotoIndex as any
    });

    await deletePhoto(this.data.openID, this.data.albumID, oldPhotoId);

    setTimeout(async () => {
      this.setForceRemoveAnimation(true);
      await (this as any).updatePhotos(
        this.data.openID, 
        this.data.albumID,
        oldPhotoIndex === 0 ? 0 : newPhotoIndex);
      
      if (oldPhotoIndex === 0) {
        this.switchWithoutAnimation(0);
      }
      setTimeout(() => {
        this.setForceRemoveAnimation(false);
      }, 100);

      if (length === 1) {
        await deleteAlbum(this.data.openID, this.data.albumID);
        wx.reLaunch({
          url: '/pages/index/index'
        })
      }
    }, 800);
  },

  switchWithoutAnimation(index: number) {
    this.setData({
      duration: 0
    });
    this.setData({
      photoIndexTarget: index as any
    });
    this.setData({
      duration: 650
    });
  },

  setForceRemoveAnimation(forceRemoveAnimation: boolean) {
    this.setData({
      forceRemoveAnimation: forceRemoveAnimation
    });
  },

  photoPlayNext() {
    const shownUpTimeout = 800;
    const showAnimationTimeout = 1000;

    this.setData({
      playShow: false,
      isPlaySwitching: true
    });
    const newIndex = (this as any).data.photoDisplayIndex === (this as any).data.photoCount - 1 ? 0 : (this as any).data.photoDisplayIndex + 1;
    setTimeout(() => {
      this.switchWithoutAnimation(newIndex);
      this.setData({
        playShow: true,
        isPlaySwitching: false
      });
      setTimeout(() => {
        this.manageDisplyedImgaeAnimation(true, newIndex);
      }, showAnimationTimeout);
    }, shownUpTimeout);
  },

  // core of start: show next + add timer + set isPlaying
  startPlay() {
    this.photoPlayNext();
    this.setData({ isPlaying: true });
    this.scheduleNext();
  },

  // core of pause: remove timer + set isPlaying
  pausePlay(): void {
    this.clearTimer();
    this.clearAutoPlayTimer();
    this.setData({ 
      isPlaying: false
    });
  },

  clearTimer() {
    if (this.data.timer !== -1) {
      clearTimeout(this.data.timer);
      this.setData({ timer: -1 });
    }
  },

  clearAutoPlayTimer() {
    for (let timer of this.data.autoPlayTimers) {
      clearTimeout(timer);
    }
    this.setData({ autoPlayTimers: [] });

  },

  clearDynamicWordsTimer() {
    for (let timer of this.data.dynamicWordsTimers) {
      clearTimeout(timer);
    }
    this.setData({ dynamicWordsTimers: [] });
  },

  scheduleNext() {
    this.clearTimer();
    const timer = setTimeout(() => {
      this.photoPlayNext();
      if (this.data.isPlaying) {
        this.scheduleNext();
      }
    }, 8000);
    this.setData({ timer });
  },

  onPlayClick() {
    this.startPlay();
  },

  onPauseClick() {
    this.pausePlay();
  },

  scheduleDynamicWordsAnimation() {
    const dynamicWordsTimer = setTimeout(() => {
      (this as any).setDynamicWordsAnimationClass('animation');
    }, 5500);
    const currentDynamicWordsTimers = this.data.dynamicWordsTimers;
    this.setData({
      dynamicWordsTimers: [...currentDynamicWordsTimers, dynamicWordsTimer]
    });
  }

})