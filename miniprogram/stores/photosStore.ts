import { action, observable } from "mobx-miniprogram";
import { getAlbumPhotos } from "../utils/apis";
import { parseDate } from "../utils/utils";

export const photosStore = observable({

  photos: [] as { timestamp: string, imageUrl: string }[],
  normalOrdered: true,
  photoUrls: [] as string[],

  updatePhotos: action(
    async (userID: string, albumID: string) => {
      const photos = await getAlbumPhotos(userID, albumID);
      photosStore.photos = photos;
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

  orderPhotos: action(
    () => {
      photosStore.photos.sort((a, b) => {
        const dateA = parseDate(a.timestamp);
        const dateB = parseDate(b.timestamp);
        if (photosStore.normalOrdered) {
          return dateA.getTime() - dateB.getTime();
        } else {
          return dateB.getTime() - dateA.getTime();
        }
      });
      photosStore.photoUrls = photosStore.photos.map(item => item.imageUrl);
    }
  )

});