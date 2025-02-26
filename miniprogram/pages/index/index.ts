// index.ts
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { generalStore } from '../../stores/generalStore';
import { albumsStore } from '../../stores/albumsStore';
import { photoCreationStore } from '../../stores/photoCreationStore';
import { uiStore } from '../../stores/uiStore'
import { chooseImage, wxLogin } from '../../utils/utils';

Page({

  generalStorageBinding: undefined as any,
  albumsStorageBinding: undefined as any,
  photoCreationStoreBinding: undefined as any,
  uiStoreBinding: undefined as any,

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

    this.uiStoreBinding = createStoreBindings(this, 
      {
        store: uiStore,
        fields: ['mainStartLoading'],
        actions: ['setMainStartLoading']
      }
    );
 
  },

  onUnload() {
    this.generalStorageBinding.destroyStoreBindings();
    this.albumsStorageBinding.destroyStoreBindings();
    this.photoCreationStoreBinding.destroyStoreBindings();
    this.uiStoreBinding.destroyStoreBindings();
  },

  async receiveLoginSuccess() {
    try {
      (this as any).setMainStartLoading(true);
      const openID = await wxLogin();
      await (this as any).updateAlbums(openID);
      this.albumsStorageBinding.updateStoreBindings();
      (this as any).setLoginStatus(true);
      if (0 === (this as any).data.albums.length) {
        const photoPath = await chooseImage();
        (this as any).setPhotoCreationPath(photoPath);
        (this as any).setPhotoCreationComponentTop(0);
      }
    } catch (e) {
      console.log("Login failed: " + e);
    } finally {
      setTimeout(() => {
        (this as any).setMainStartLoading(false);
      }, 500);
    }
  }

})
