import { action, observable } from "mobx-miniprogram";
import { getCurrentTime, getIndicesFromDate } from "../utils/utils"
import { getLocationInfo } from "../utils/utils"

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
  isGettingLocation: false,
  setPhoteCreationLocation: action(
    (photeCreationLocation: string) => {
      photoCreationStore.photeCreationLocation = photeCreationLocation
    }
  ),
  updatePhoteCreationLocation: action(
    async () => {
      try {
        photoCreationStore.setIsGettingLocation(true);
        const location = await getLocationInfo();
        photoCreationStore.photeCreationLocation = location;
      } catch(e) { } finally {
        photoCreationStore.setIsGettingLocation(false);
      }
    }
  ),
  setIsGettingLocation: action(
    (isGettingLocation: boolean) => {
      photoCreationStore.isGettingLocation = isGettingLocation
    }
  ),

  photoCreationTime: [] as number[],
  setPhotoCreationTime: action(
    (photoCreationTime: number[]) => {
      photoCreationStore.photoCreationTime = photoCreationTime;
    }
  ),
  correctPhotoCreationTime: action(
    () => {
      photoCreationStore.setPhotoCreationTime(getIndicesFromDate(getCurrentTime()));
    }
  ),

});