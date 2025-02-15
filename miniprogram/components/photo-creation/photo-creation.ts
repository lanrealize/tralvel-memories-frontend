// components/photo-creation/photo-creation.ts
import { ComponentWithStore } from 'mobx-miniprogram-bindings';
import { photoCreationStore } from '../../stores/photoCreationStore'
import { PhotoCreationComponentData } from "../../models/component-model/photo-creation-model"
import { generateMockAlbumTitle } from '../../utils/utils'
import { getRandomWord, postAlbum, postPhoto } from '../../utils/apis';

ComponentWithStore<any, PhotoCreationComponentData, any, any, any>({

  storeBindings: [
    {
      store: photoCreationStore,
      fields: ['photoCreationComponentTop', 'photoCreationPath', 'photeCreationDescription', 'photeCreationLocation'],
      actions: ['setPhotoCreationComponentTop', 'setPhotoCreationPath', 'setPhoteCreationDescription', 'setPhoteCreationLocation']
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
    isRefreshing: false
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
          const albumID = await postAlbum(openID, generateMockAlbumTitle()) as string;
          await postPhoto(openID, albumID, this.data.photoCreationPath, this.data.photeCreationDescription, 'test');
          // Step 2: Adjust display
          this.setImageCreationComponentTop(100);
          wx.navigateTo({ url: '/pages/photos/photos' });
        } else if (this.data.page == "photos") {
            console.log("Need to be done.")
        } else {
          throw("Publish photo failed: not 'albums' or 'photos'.")
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
      })
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

    setLocationValue(locationValue: string) {
      this.setPhoteCreationLocation(locationValue);
    },

    onLocationInput(event: any) {
      const location = event.detail.value;
      this.setLocationValue(location);
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