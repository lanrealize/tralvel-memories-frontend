import { devUrlPrefix } from "../configs/network";

export const getAlbums = async (): Promise<{ images: { imageUrl: string }[] }[]> => {
  return new Promise((resolve, reject) => {
    try {
      let openID = wx.getStorageSync('openID');
      if (!openID) {
        reject('Without openID');
      }
      wx.request({
        url: devUrlPrefix + '/users/' + openID + '/albums',
        method: 'GET',
        data: {
          type: 'createdAlbums',
        },
        success: (res: any) => {
          resolve(res.data)
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