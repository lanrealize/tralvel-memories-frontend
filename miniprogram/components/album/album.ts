// components/album/album.ts
import { ComponentWithStore } from 'mobx-miniprogram-bindings';
import { uiStore } from '../../stores/uiStore';
import { parseDate } from "../../utils/utils";
import { albumsStore } from '../../stores/albumsStore';

ComponentWithStore({
  storeBindings: [
    {
      store: uiStore,
      fields: ['displayedAlbumIndex'],
      actions: ['setDisplayedAlbumIndex'],
    },
    {
      store: albumsStore,
      fields: [],
      actions: ['updateAlbumsCoverActivatedIndices'],
    }
  ],

  /**
   * 组件的属性列表
   */
  properties: {
    albumId: {
      type: String,
      value: undefined
    },
    albumTitle: {
      type: String,
      value: undefined
    },
    photos: {
      type: Array,
      value: [{imageUrl: '', timestamp: '', id: ''}]
    },
    index: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    firstImageUrl: '',
    secondImageUrl: '',
    activatedIndex: -1,
    currentImageIndex: 0,
    pending: true,
    imageSwitching: false,
    deleted: false,
    imageLoadTimers: [] as any [],
    showAnimation: true
  },

  lifetimes: {
    attached: function() {
      this.initialize();
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onFirstImageLoad(e: any) {
      this.setCurrentPhotoIdAccordingToUrl(e);

      this.setData({
        activatedIndex: 0
      });
      if (this.data.index === (this as any).data.displayedAlbumIndex) {
        this.setData({
          pending: false
        });
        this.preloadDeactivatedImageInSeconds(4000);
      } else {
        this.setData({
          pending: true
        });
      }
    },

    onSecondImageLoad(e: any) {
      this.setCurrentPhotoIdAccordingToUrl(e);
      this.setData({
        activatedIndex: 1
      });
      if (this.data.index === (this as any).data.displayedAlbumIndex) {
        this.setData({
          pending: false
        });
        this.preloadDeactivatedImageInSeconds(4000);
      } else {
        this.setData({
          pending: true
        });
      }
    },

    initialize() {
      this.sortPhotos();
      this.setData({
        activatedIndex: -1,
        currentImageIndex: 0,
        firstImageUrl: this.data.photos[0].imageUrl,
      });
    },

    continueSwitching(delay : number = 4000) {
      this.setData({
        pending: false
      });
      this.preloadDeactivatedImageInSeconds(delay);
    },


    // when only 2 images, 1st container load 1st iamge, 2nd container preload 2nd iamge. Then 1st container preload 1st image again (if we have more than 2 iamge then in this situation 1st container will preload 3rd imgae) which will not trigger bindload method.
    preloadDeactivatedImageInSeconds(timeout: number) {
      if ((this as any).data.imageSwitching) {
        return;
      }

      this.setData({
        imageSwitching: true
      });

      // console.log(`Changed image for ${this.data.index}th album to ${(this as any).data.currentImageIndex}th image`)
      const imageLoadTimer = setTimeout(() => {
        console.log('load image')
        this.clearImageLoadTimers();
        const newIndex = ((this as any).data.currentImageIndex + 1) % this.data.photos.length;
        const url = this.data.photos[newIndex].imageUrl
        this.setData({
          currentImageIndex: newIndex
        });
        if ((this as any).data.activatedIndex === 0) {
          if (url === (this as any).data.secondImageUrl) {
            this.setData({
              secondImageUrl: ''
            });
          }
          this.setData({
            secondImageUrl: url
          });
        } else {
          if(url === (this as any).data.firstImageUrl) {
            this.setData({
              firstImageUrl: ''
            });
          }
          this.setData({
            firstImageUrl: url
          });
        }

        this.setData({
          imageSwitching: false
        });
      }, timeout);

      const currentImageLoadTimers = (this as any).data.imageLoadTimers;
      this.setData({
        imageLoadTimers: [...currentImageLoadTimers, imageLoadTimer]
      });
    },

    onDeleting() {
      this.setData({
        deleted: true
      });
    },

    onDeleted() {
      this.setData({
        deleted: false
      });
    },

    sortPhotos(normalOrdered: boolean = true) {
      const sortedPhotos = this.data.photos.slice().sort((a, b) => {
        const dateA = parseDate(a.timestamp);
        const dateB = parseDate(b.timestamp);
        return normalOrdered ? 
          dateA.getTime() - dateB.getTime() :
          dateB.getTime() - dateA.getTime();
      });
      this.setData({
        photos: sortedPhotos
      });
    },

    setCurrentPhotoIdAccordingToUrl(e: any) {
      const targetImageUrl = e.currentTarget.dataset.src;
      const targetObj = this.data.photos.find(item => item.imageUrl === targetImageUrl);
      const photoId = targetObj ? targetObj.id : null;
      setTimeout(() => {
        (this as any).updateAlbumsCoverActivatedIndices(this.data.index, photoId);
      }, 500);
    },

    ////////////////////////////////////
    // Animation management
    ////////////////////////////////////
    clearImageLoadTimers() {
      for (let timer of (this as any).data.imageLoadTimers) {
        clearTimeout(timer);
      }
      this.setData({ imageLoadTimers: [], imageSwitching: false });
    },

    clearAllAnimation() {
      this.setData({showAnimation: false});
    },

    clearAnimationWithTimers() {
      this.clearImageLoadTimers();
      this.clearAllAnimation();
    },

    addAllAnimation() {
      this.setData({showAnimation: true});
    },

    resumeAnimation(delay: number = 0) {
      this.addAllAnimation();
      this.continueSwitching(delay);
    }
  },
})