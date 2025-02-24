import { action, observable } from "mobx-miniprogram";

export const pagesStore = observable({

  photosTitleColor: 'black',

  setPhotosTitleColor: action(
    (photosTitleColor: string) => {
      pagesStore.photosTitleColor = photosTitleColor
    }
  ),

});