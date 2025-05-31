import { action, observable } from "mobx-miniprogram";
import { getAlbum } from "../utils/apis";
import { parseDate, calculateColor, calculateLeft, formatReadableTime } from "../utils/utils";

export const photosStore = observable({

  photos: [] as { timestamp: string, imageUrl: string, location: string, id: string }[],
  normalOrdered: true,
  photoUrls: [] as string[],
  photoCount: 0,
  photoCountArray: [0],
  albumTitle: '',
  updatePhotos: action(
    async (userID: string, albumID: string, activedIndex: number = 0, photoID: string = '') => {
      const album = await getAlbum(userID, albumID);
      photosStore.photos = album.images;
      photosStore.normalOrdered = false;
      photosStore.orderPhotos();

      photosStore.photoCount = album.images.length;
      photosStore.photoCountArray = [...Array(album.images.length).keys()];
      if (photoID) {
        activedIndex = photosStore.photos.findIndex(item => item.id === photoID);
      }
      photosStore.photoDisplayIndex = activedIndex;
      photosStore.photoColorArray = photosStore.photoCountArray.map(num => calculateColor(
        photosStore.photoCount, num, photosStore.photoDisplayIndex));
      photosStore.photoDisplayLeft = calculateLeft(photosStore.photoCount, photosStore.photoDisplayIndex);
      photosStore.setShownPhotoTimestamp(photosStore.photos[photosStore.photoDisplayIndex].timestamp);
      if (photosStore.photos[photosStore.photoDisplayIndex].location) {
        photosStore.setShownPhotoLocation(photosStore.photos[photosStore.photoDisplayIndex].location);
      } else {
        photosStore.setShownPhotoLocation('无位置信息');
      }

      photosStore.albumTitle = album.title;
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
  }),

  photoDisplayIndex: 0,
  setPhotoDisplayIndex: action(
    (photoDisplayIndex: number) => {
      photosStore.photoDisplayIndex = photoDisplayIndex;
    }
  ),

  photoColorArray: [''],
  setPhotoColorArray: action(
    (photoColorArray: []) => {
      photosStore.photoColorArray = photoColorArray;
    }
  ),

  photoDisplayLeft: 0,
  setPhotoDisplayLeft: action(
    (photoDisplayLeft: number) => {
      photosStore.photoDisplayLeft = photoDisplayLeft;
    }
  ),

  shownPhotoLocation: '',
  setShownPhotoLocation: action(
    (shownPhotoLocation: string) => {
      photosStore.shownPhotoLocation = shownPhotoLocation;
    }
  ),

  shownPhotoTimestamp: '',
  setShownPhotoTimestamp: action(
    (shownPhotoTimestamp: string) => {
      photosStore.shownPhotoTimestamp = formatReadableTime(shownPhotoTimestamp);
    }
  ),

  photoIsSwitching: false,
  setPhotoIsSwitching: action(
    (photoIsSwitching: boolean) => {
      photosStore.photoIsSwitching = photoIsSwitching
    }
  ),

});