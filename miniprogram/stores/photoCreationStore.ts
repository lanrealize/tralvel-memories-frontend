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
  photeCreationSubLocation: "",
  isGettingLocation: false,
  setPhoteCreationLocation: action(
    (photeCreationLocation: string) => {
      photoCreationStore.photeCreationLocation = photeCreationLocation
    }
  ),
  setPhoteCreationSubLocation: action(
    (photeCreationSubLocation: string) => {
      photoCreationStore.photeCreationSubLocation = photeCreationSubLocation
    }
  ),
  updatePhoteCreationLocation: action(
    async () => {
      if (photoCreationStore.photeCreationLocation) {
        {}
      } else {
        try {
          photoCreationStore.setIsGettingLocation(true);
          const location = await getLocationInfo();
          photoCreationStore.photeCreationLocation = location.city;
          photoCreationStore.photeCreationSubLocation = location.poi;
        } catch(e) { } finally {
          photoCreationStore.setIsGettingLocation(false);
        }
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