import { action, observable } from "mobx-miniprogram";

export const uiStore = observable({

  photosTitleColor: 'black',
  mainStartLoading: false,
  displayedAlbumIndex: 0,
  displayedAlbumTitle: '',
  indexInitialized: false,
  photoPlayerShown: false,
  photoPlayerOpacity: 0,
  photoPlayerNodeActivatedIndex: '',

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
  ),

  setIndexInitialized: action(
    (indexInitialized: boolean) => {
      uiStore.indexInitialized = indexInitialized
    }
  ),

  setPhotoPlayerShown: action(
    (photoPlayerShown: boolean) => {
      uiStore.photoPlayerShown = photoPlayerShown
    }
  ),

  setPhotoPlayerOpacity: action(
    (photoPlayerOpacity: number) => {
      uiStore.photoPlayerOpacity = photoPlayerOpacity
    }
  ),

  setPhotoPlayerNodeActivatedIndex: action(
    (photoPlayerNodeActivatedIndex: string) => {
      uiStore.photoPlayerNodeActivatedIndex = photoPlayerNodeActivatedIndex
    }
  ),

});