import { action, observable } from "mobx-miniprogram";

export const photoCreationStore = observable({

  photoCreationComponentTop: 100,
  setPhotoCreationComponentTop: action(
    (photoCreationComponentTop: number) => {
      photoCreationStore.photoCreationComponentTop = photoCreationComponentTop
    }
  ),

  photoCreationPath: "",
  setPhotoCreationPath: action(
    (photoCreationPath: string) => {
      photoCreationStore.photoCreationPath = photoCreationPath
    }
  ),

  photeCreationDescription: "",
  setPhoteCreationDescription: action(
    (photeCreationDescription: string) => {
      photoCreationStore.photeCreationDescription = photeCreationDescription
    }
  ),

  photeCreationLocation: "",
  setPhoteCreationLocation: action(
    (photeCreationLocation: string) => {
      photoCreationStore.photeCreationLocation = photeCreationLocation
    }
  ),

});