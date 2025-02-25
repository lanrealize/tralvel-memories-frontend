import { action, observable } from "mobx-miniprogram";

export const uiStore = observable({

  photosTitleColor: 'black',
  mainStartLoading: false,

  setPhotosTitleColor: action(
    (photosTitleColor: string) => {
      uiStore.photosTitleColor = photosTitleColor
    }
  ),

  setMainStartLoading: action(
    (mainStartLoading: boolean) => {
      uiStore.mainStartLoading = mainStartLoading
    }
  ),

});