import { action, observable } from "mobx-miniprogram";
import { getCurrentTime, getIndicesFromDate } from "../utils/utils"

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

  photeCreationLocation: "上海",
  setPhoteCreationLocation: action(
    (photeCreationLocation: string) => {
      photoCreationStore.photeCreationLocation = photeCreationLocation
    }
  ),

  photoCreationTime: getIndicesFromDate(getCurrentTime()),
  setPhotoCreationTime: action(
    (photoCreationTime: number[]) => {
      photoCreationStore.photoCreationTime = photoCreationTime;
    }
  ),

});