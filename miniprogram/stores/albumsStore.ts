import { action, observable } from "mobx-miniprogram";
import { getAlbums } from '../utils/apis';

export const albumsStore = observable({

  albums: [] as object[],
  updateAlbums: action(
    async (openID: string, initializeIndices: boolean = false) => {
      const albums = await getAlbums(openID);
      albumsStore.albums = albums;
      if (initializeIndices) albumsStore.initializeAlbumsCoverActivatedIndices();
    }
  ),

  albumsCoverActivatedIndices: [] as string[],
  initializeAlbumsCoverActivatedIndices: action(
    async () => {
      albumsStore.albumsCoverActivatedIndices = new Array(albumsStore.albums.length).fill('');
    }
  ),
  updateAlbumsCoverActivatedIndices: action(
    async (idx: number, photoId: string) => {
      let tempArray = albumsStore.albumsCoverActivatedIndices.map((item, index) => index === idx ? photoId : item);
      albumsStore.albumsCoverActivatedIndices = tempArray;
    }
  ),

  albumShowTimers: [] as any[],
  setAlbumShowTimers: action(
    async (albumShowTimers: any[]) => {
      albumsStore.albumShowTimers = albumShowTimers;
    }
  ),
});