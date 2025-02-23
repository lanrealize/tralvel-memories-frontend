// index.ts
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { generalStore } from '../../stores/generalStore';
import { albumsStore } from '../../stores/albumsStore';
import { photoCreationStore } from '../../stores/photoCreationStore';
import { getAlbums } from '../../utils/apis';
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
        actions: ['setAlbums']
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

  async updateAlubms() {
    try {
      const albumList = await getAlbums(wx.getStorageSync("openID"));
      (this as any).setAlbums(albumList);
      this.albumsStorageBinding.updateStoreBindings();
    } catch (e) {
      throw (e);
    }
  },

  async receiveLoginSuccess() {
    await this.updateAlubms();
    if (0 === (this as any).data.albums.length) {
      const photoPath = await chooseImage();
      (this as any).setPhotoCreationPath(photoPath);
      (this as any).setPhotoCreationComponentTop(0);
    } else {
      // show albums
    }
  }

})
