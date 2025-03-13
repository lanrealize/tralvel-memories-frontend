// components/photo-creation/photo-creation.ts
import { ComponentWithStore } from 'mobx-miniprogram-bindings';
import { photoCreationStore } from '../../stores/photoCreationStore'
import { PhotoCreationComponentData } from "../../models/component-model/photo-creation-model"
import { generateAlbumTitle, getDatefromIndices, getLocationPermission, getLocationInfo } from '../../utils/utils'
import { getRandomWord, postAlbum, postPhoto } from '../../utils/apis';
import { photosStore } from '../../stores/photosStore';
import { albumsStore } from '../../stores/albumsStore';
import { Texture } from 'XrFrame/kanata/lib/index';

ComponentWithStore<any, PhotoCreationComponentData, any, any, any>({

  storeBindings: [
    {
      store: photoCreationStore,
      fields: ['photoCreationComponentTop', 'photoCreationPath', 'photeCreationDescription', 'photeCreationLocation', 'photoCreationTime', 'isGettingLocation', 'photoCreationLocationInput'],
      actions: ['setPhotoCreationComponentTop', 'setPhotoCreationPath', 'setPhoteCreationDescription', 'setPhoteCreationLocation', 'setIsGettingLocation', 'setPhotoCreationLocationInput']
    },
    {
      store: photosStore,
      fields: ['photos'],
      actions: ['updatePhotos']
    },
    {
      store: albumsStore,
      fields: ['albums'],
      actions: ['updateAlbums']
    }
  ],

  /**
   * 组件的属性列表
   */
  properties: {
    page: {
      type: String,
      value: undefined
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isCreating: false,
    isRefreshing: false,
    inputActivated: false
  },

  /**
   * 组件的方法列表
   */
  methods: {

    onCancelClick() {
      this.setPhotoCreationComponentTop(100);
    },

    async onPublishClick() {
      if (this.data.isCreating) { return; }
      this.setIsCreating(true);
      try {
        if (this.data.page == "index") {
          // Step 1: Post album and photo
          const openID = wx.getStorageSync('openID');
          const albumID = await postAlbum(
            openID, 
            generateAlbumTitle(this.data.photoCreationTime, this.data.photeCreationLocation)
          ) as string;
          wx.setStorageSync('albumID', albumID);
          await postPhoto(openID, albumID, this.data.photoCreationPath, this.data.photeCreationDescription, getDatefromIndices(this.data.photoCreationTime));
          // Step 2: Update albums
          await (this as any).updateAlbums(openID);
          // Step 3: Adjust display
          this.setPhotoCreationComponentTop(100);
          wx.navigateTo({ url: `/pages/photos/photos` });
        } else if (this.data.page == "photos") {
            // Step 1: Post photo
            const openID = wx.getStorageSync('openID');
            const albumID = wx.getStorageSync('albumID');
            const photoID = await postPhoto(openID, albumID, this.data.photoCreationPath, this.data.photeCreationDescription, getDatefromIndices(this.data.photoCreationTime));
            // Step 2: Update albums
            await (this as any).updateAlbums(openID);
            // Step 3: Adjust display
            await this.updatePhotos(openID, albumID);
            this.setPhotoCreationComponentTop(100);
            // Step 4: Trigger event
            this.triggerEvent('onAddNewPhoto', {id: `photos--${photoID}`});
        } else {
          throw("Publish photo failed: not 'index' or 'photos'.")
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.setIsCreating(false);
      }
    },

    setIsCreating(isCreating: boolean) {
      this.setData({
        isCreating: isCreating
      });
    },

    setIsRefreshing(isRefreshing: boolean) {
      this.setData({
        isRefreshing: isRefreshing
      })
    },

    async setDescription() {
      this.setIsRefreshing(true);
      try {
        const description = await getRandomWord();
        this.setPhoteCreationDescription(description);
      } catch(e) {
        console.log(e);
      } finally {
        this.setIsRefreshing(false);
      }
    },

    async onRefreshClick() {
      await this.setDescription();
    },

    async onGetLocationClick() {
      if ( (this as any).data.photeCreationLocation ) {
        this.setData({
          inputActivated: true
        })
        // (this as any).setPhotoCreationLocationInput
      } else {
        try {
          (this as any).setIsGettingLocation(true);
          await getLocationPermission();
          const location = await getLocationInfo();
          (this as any).setPhoteCreationLocation(location);
        } catch { } finally {
          (this as any).setIsGettingLocation(false);
        } 
      }
    },

    onLocationInput() {
      this.setData({
        inputActivated: false
      })
    },

    onLocationInputBlur() {
      this.setData({
        inputActivated: false
      })
    }
  },

  lifetimes: {
    attached: function () {
      const app: IAppOption = getApp();
      this.setData({
        menuHeight: app.globalData.navigationInfo.menuHeight,
        menuTop: app.globalData.navigationInfo.menuTop,
      });
      this.setDescription();
    }
  }
})