import { action, observable } from "mobx-miniprogram";
import { getAlbums } from '../utils/apis';

export const albumsStore = observable({

  albums: [] as object[],

  updateAlbums: action(
    async (openID: string) => {
      const albums = await getAlbums(openID);
      albumsStore.albums = albums;
    }
  ),

});