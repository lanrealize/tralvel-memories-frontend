// index.ts
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { generalStore } from '../../stores/generalStore';
import { albumsStore } from '../../stores/albumsStore';
import { getAlbums } from '../../utils/apis';

Page({

  generalStorageBinding: undefined as any,
  albumsStorageBinding: undefined as any,

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


    await this.updateAlubms();
    // Promise.resolve().then(() => {
    //   this.updateAlubms();
    //   console.log(this.data);
    // });

    setTimeout(() => {
      console.log(this.data.albums)
    }, 0);

  },

  onUnload() {
    this.generalStorageBinding.destroy();
    this.albumsStorageBinding.destroy();
  },

  async updateAlubms() {
    try {
      const albumList = await getAlbums();
      (this as any).setAlbums(albumList);
      this.albumsStorageBinding.updateStoreBindings();
      console.log((this as any).data.albums);
    } catch (e) {
      throw (e);
    }
  }

})
