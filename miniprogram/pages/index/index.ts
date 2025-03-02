// index.ts
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { generalStore } from '../../stores/generalStore';
import { albumsStore } from '../../stores/albumsStore';
import { photoCreationStore } from '../../stores/photoCreationStore';
import { uiStore } from '../../stores/uiStore'
import { chooseImage, wxLogin } from '../../utils/utils';
import { getRandomWord } from '../../utils/apis';

Page({

  generalStorageBinding: undefined as any,
  albumsStorageBinding: undefined as any,
  photoCreationStoreBinding: undefined as any,
  uiStoreBinding: undefined as any,

  data: {
    photoCreationComponentTop: 100
  },

  async onLoad() {

  },

  onReady() {
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
        actions: ['setPhotoCreationComponentTop', 'setPhotoCreationPath', 'setPhoteCreationDescription']
      }
    );

    this.uiStoreBinding = createStoreBindings(this, 
      {
        store: uiStore,
        fields: ['mainStartLoading', 'displayedAlbumTitle', 'displayedAlbumIndex'],
        actions: ['setMainStartLoading', 'setDisplayedAlbumTitle']
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
      (this as any).setDisplayedAlbumTitle((this as any).data.albums[(this as any).data.displayedAlbumIndex].title);
      (this as any).setLoginStatus(true);
      if (0 === (this as any).data.albums.length) {
        const photoPath = await chooseImage();
        (this as any).setPhotoCreationPath(photoPath);
        const description = await getRandomWord();
        (this as any).setPhoteCreationDescription(description);
        (this as any).setPhotoCreationComponentTop(0);
      }
    } catch (e) {
      console.log("Login failed: " + e);
    } finally {
      setTimeout(() => {
        if ((this as any).setMainStartLoading) {
          (this as any).setMainStartLoading(false);
        }
      }, 500);
    }
  },

  async onNewAlbum() {
    const photoPath = await chooseImage();
    (this as any).setPhotoCreationPath(photoPath);
    const description = await getRandomWord();
    (this as any).setPhoteCreationDescription(description);
    (this as any).setPhotoCreationComponentTop(0);
  },

})
