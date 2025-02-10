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