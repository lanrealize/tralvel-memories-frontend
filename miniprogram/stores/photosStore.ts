import { action, observable } from "mobx-miniprogram";
import { getAlbum } from "../utils/apis";
import { parseDate } from "../utils/utils";

export const photosStore = observable({

  photos: [] as { timestamp: string, imageUrl: string }[],
  normalOrdered: true,
  photoUrls: [] as string[],
  albumTitle: '',

  updatePhotos: action(
    async (userID: string, albumID: string) => {
      const album = await getAlbum(userID, albumID);
      photosStore.photos = album.images;
      photosStore.albumTitle = album.title;
      photosStore.orderPhotos();
      photosStore.photoUrls = photosStore.photos.map(item => item.imageUrl);
    }
  ),

  reversePhotos: action(
    () => {
      photosStore.normalOrdered = !photosStore.normalOrdered;
      photosStore.orderPhotos();
      photosStore.photoUrls = photosStore.photos.map(item => item.imageUrl);
    }
  ),

  orderPhotos: action(() => {
    photosStore.photos = photosStore.photos.slice().sort((a, b) => {
      const dateA = parseDate(a.timestamp);
      const dateB = parseDate(b.timestamp);
      return photosStore.normalOrdered ? 
        dateA.getTime() - dateB.getTime() :
        dateB.getTime() - dateA.getTime();
    });
    photosStore.photoUrls = photosStore.photos.map(item => item.imageUrl);
  })

});