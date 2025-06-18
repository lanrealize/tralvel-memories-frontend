import { action, observable } from "mobx-miniprogram";
import { getAlbum } from "../utils/apis";
import { parseDate, formatReadableTime, calculateTimeAxisSpacing } from "../utils/utils";

export const photosStore = observable({

  photos: [] as { timestamp: string, imageUrl: string, location: string, id: string }[],
  normalOrdered: true,
  photoCount: 0,
  photoCountArray: [] as Number[],
  albumTitle: '',
  timelineSpacings: [] as String[],
  updatePhotos: action(
    async (userID: string, albumID: string, activedIndex: number = 0, photoID: string = '') => {
      try {
        const album = await getAlbum(userID, albumID);
        photosStore.photos = album.images;
        // photosStore.normalOrdered = false;
        photosStore.orderPhotos();
        photosStore.timelineSpacings = calculateTimeAxisSpacing(photosStore.photos.map(item => item.timestamp));
  
        photosStore.photoCount = album.images.length;
        photosStore.photoCountArray = [...Array(album.images.length).keys()];
        if (photoID) {
          activedIndex = photosStore.photos.findIndex(item => item.id === photoID);
          if (activedIndex === -1) {
            throw new Error(`Photo with ID ${photoID} not found in album`);
          }
        }
        photosStore.photoDisplayIndex = activedIndex;
        photosStore.setPhotoDisplayLeft();
        if(photosStore.photos[photosStore.photoDisplayIndex]) {
          photosStore.setShownPhotoTimestamp(photosStore.photos[photosStore.photoDisplayIndex].timestamp);
          if (photosStore.photos[photosStore.photoDisplayIndex].location) {
            photosStore.setShownPhotoLocation(photosStore.photos[photosStore.photoDisplayIndex].location);
          } else {
            photosStore.setShownPhotoLocation('无位置信息');
          }
        } else {
          photosStore.setShownPhotoLocation('');
          photosStore.shownPhotoTimestamp = '';
        }
        photosStore.albumTitle = album.title;
      } catch(e) {
        photosStore.photos = [];
        throw e;
      }
    }
  ),

  reversePhotos: action(
    () => {
      photosStore.normalOrdered = !photosStore.normalOrdered;
      photosStore.orderPhotos();
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
  }),

  photoDisplayIndex: 0,
  setPhotoDisplayIndex: action(
    (photoDisplayIndex: number) => {
      photosStore.photoDisplayIndex = photoDisplayIndex;
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

  photoDisplayLeft: '',
  setPhotoDisplayLeft: action(
    (idx: number = -1) => {
      if (idx === -1) idx = photosStore.photoDisplayIndex;
      let px = idx * 8;
      let vw = photosStore.timelineSpacings.slice(0, idx)
      .map(str => parseFloat(str as any))
      .reduce((total, num) => total + num, 0);
      photosStore.photoDisplayLeft = `calc(-${vw}vw + -${px}px)`;
    }
  )

});