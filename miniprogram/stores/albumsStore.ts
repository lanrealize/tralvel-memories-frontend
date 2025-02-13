import { action, observable } from "mobx-miniprogram";

export const albumsStore = observable({

  albums: [] as object[],

  setAlbums: action(
    (albums: object[]) => {
      albumsStore.albums = albums
    }
  ),

});