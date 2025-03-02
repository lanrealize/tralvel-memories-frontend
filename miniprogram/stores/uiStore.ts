import { action, observable } from "mobx-miniprogram";

export const uiStore = observable({

  photosTitleColor: 'black',
  mainStartLoading: false,
  displayedAlbumIndex: 0,
  displayedAlbumTitle: '',

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

  setDisplayedAlbumIndex: action(
    (displayedAlbumIndex: number) => {
      uiStore.displayedAlbumIndex = displayedAlbumIndex
    }
  ),

  setDisplayedAlbumTitle: action(
    (displayedAlbumTitle: string) => {
      uiStore.displayedAlbumTitle = displayedAlbumTitle
    }
  )

});