import { devUrlPrefix } from "../configs/network";

/**
 * ===============================================
 * Album Layer
 * ===============================================
*/

export const postAlbum = async (
  openID: string, 
  title: string) => {
  
  return new Promise((resolve, reject) => {
    try {
      wx.request({
        url: devUrlPrefix + '/users/' + openID + '/albums',
        method: 'POST',
        data: { 
          type: 'createdAlbums',
          title: title
        },
        success: (res: any) => {
          resolve(res.data.id)
        },
        fail: (e) => {
          reject(e)
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}

export const getAlbums = async (openID: string): Promise<{ images: { imageUrl: string }[] }[]> => {
  return new Promise((resolve, reject) => {
    try {
      wx.request({
        url: devUrlPrefix + '/users/' + openID + '/albums',
        method: 'GET',
        data: {
          type: 'createdAlbums',
        },
        success: (res: any) => {
          const newArray = res.data.map((item: { subTitle: any; title: any; }) => {
            const [year, location] = item.subTitle.split('·');
            const newTitle = `${year}年${item.title}${location ? `${location}` : ''}`;
            return {
              ...item,
              newTitle: newTitle
            };
          });
          resolve(newArray.slice(0, 5));
        },
        fail: (e) => {
          reject(e)
        }
      })
    } catch (e) {
      reject(e);
    }
  })
}

/**
 * ===============================================
 * Photo Layer
 * ===============================================
*/

export const postPhoto = async (
  openID: string, 
  albumID: string, 
  photoPath: string, 
  photoDescription: string, 
  photoTimestamp: string) => {

  return new Promise((resolve, reject) => {
    try {
      wx.uploadFile({
        url: devUrlPrefix + '/users/' + openID + '/albums/' + albumID + '/pictures',
        filePath: photoPath,
        name: 'picture',
        formData: {
          description: photoDescription,
          timeStamp: photoTimestamp,
          type: 'createdAlbums'
        },
        success: (res: any) => {
          resolve(res.data.id);
        },
        fail: (e) => {
          reject(e);
        }
      })
    } catch (e) {
      reject(e);
    }
  })
}

export const getRandomWord = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      wx.request({
        url: devUrlPrefix + '/words/random',
        method: 'GET',
        success: (res: any) => {
          resolve(res.data[0].content)
        },
        fail: (e) => {
          reject(e)
        }
      })
    } catch (e) {
      reject(e);
    }
  })
}
