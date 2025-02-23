// index.ts
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { generalStore } from '../../stores/generalStore';
import { albumsStore } from '../../stores/albumsStore';
import { photoCreationStore } from '../../stores/photoCreationStore';
import { chooseImage } from '../../utils/utils';

Page({

  generalStorageBinding: undefined as any,
  albumsStorageBinding: undefined as any,
  photoCreationStoreBinding: undefined as any,

  data: {
    
  },

  async onLoad() {

    this.generalStorageBinding = createStoreBindings(this, 
      {
        store: generalStore,
        fields: ['loginStatus'],
        actions: ['setLoginStatus']
      }
    );

    this.albumsStorageBinding = createStoreBindings(this, 
      {
        store: albumsStore,
        fields: ['albums'],
        actions: ['updateAlbums']
      }
    );

    this.photoCreationStoreBinding = createStoreBindings(this, 
      {
        store: photoCreationStore,
        fields: ['photoCreationComponentTop', 'photoCreationPath'],
        actions: ['setPhotoCreationComponentTop', 'setPhotoCreationPath']
      }
    );
 
  },

  onUnload() {
    this.generalStorageBinding.destroy();
    this.albumsStorageBinding.destroy();
    this.photoCreationStoreBinding.destroy();
  },

  async receiveLoginSuccess() {
    const openID = wx.getStorageSync("openID");
    await (this as any).updateAlbums(openID);
    this.albumsStorageBinding.updateStoreBindings();
    if (0 === (this as any).data.albums.length) {
      const photoPath = await chooseImage();
      (this as any).setPhotoCreationPath(photoPath);
      (this as any).setPhotoCreationComponentTop(0);
    }
  }

})
