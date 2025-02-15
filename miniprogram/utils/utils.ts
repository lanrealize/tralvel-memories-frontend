import { devUrlPrefix } from "../configs/network";

/**
 * ===============================================
 * Login related
 * ===============================================
*/

export const mockWxLogin = () => {
  console.log("oHya266aR6YbGmbD8v8OYi0kfJEM")
  wx.setStorageSync('openID', "oHya266aR6YbGmbD8v8OYi0kfJEM");
}

export const wxLogin = () => {
  return new Promise((resolve, reject) => {
    try {
      let openID = wx.getStorageSync('openID');
      if (openID) {
        console.log('has openID')
        resolve(openID)
      } else {
        console.log('no openID')
        wx.login({
          success: (res) => {
            wx.request({
              url: devUrlPrefix + '/auth/login',
              method: 'POST',
              data: { code: res.code },
              success: (res: any) => {
                console.log('get openID')
                wx.setStorageSync('openID', res.data.openID);
                resolve(res.data.openID);
                console.log('login success');
              },
              fail: (e) => {
                reject(e)
              }
            })
          },
          fail: (e) => { reject(e) }
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * ===============================================
 * Post photo related
 * ===============================================
*/

export const chooseImage = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      wx.chooseMedia({
        count: 1,
        sizeType: ['original', 'compressed'],
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        success: (res: any) => {
          console.log('get image successfully');
          const picturePath = res.tempFiles[0].tempFilePath;
          resolve(picturePath);
        },
        fail: (e) => {
          console.log('get image failed');
          reject(e);
        }
      })
    } catch (e) {
      reject(e);
    }
  })
}

export const generateAlbumTitle = (date: number[], location: string) => {
  const timestamp = getDatefromIndices(date).split('/');
  return timestamp[0] + '年' + timestamp[1] + '月' + ' ' + location;
  
}

/**
 * ===============================================
 * time picker related methods
 * ===============================================
*/

export const getDateSelections = () => {
  const years = Array.from({ length: 56 }, (_, index) => (index + 1970).toString());
  const months = Array.from({ length: 12 }, (_, index) => (index + 1).toString().padStart(2, '0'));
  const days = Array.from({ length: 31 }, (_, index) => (index + 1).toString().padStart(2, '0'));
  const hours = Array.from({ length: 24 }, (_, index) => index.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, index) => index.toString().padStart(2, '0'));

  return {
    years: years,
    months: months,
    days: days,
    hours: hours,
    minutes: minutes
  }
}

export const getCurrentTime = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const currentDay = currentDate.getDate().toString().padStart(2, '0');
  const currentHour = currentDate.getHours().toString().padStart(2, '0');
  const currentMinute = currentDate.getMinutes().toString().padStart(2, '0');

  return concateDateStrings(currentYear, currentMonth, currentDay, currentHour, currentMinute);
}

export const concateDateStrings = (year: string, month: string, day: string, hour: string, minute: string) => {
  return `${year}/${month}/${day}/${hour}/${minute}`
}

export const getIndicesFromDate = (date: string) => {
  const dateArray = date.split('/');
  const dateSelections = getDateSelections();
  return [
    dateSelections.years.indexOf(dateArray[0]),
    dateSelections.months.indexOf(dateArray[1]),
    dateSelections.days.indexOf(dateArray[2]),
    dateSelections.hours.indexOf(dateArray[3]),
    dateSelections.minutes.indexOf(dateArray[4])
  ]
}

export const getDatefromIndices = (indices: number[]) => {
  const dateSelections = getDateSelections();
  return concateDateStrings(
    dateSelections.years[indices[0]], 
    dateSelections.months[indices[1]], 
    dateSelections.days[indices[2]], 
    dateSelections.hours[indices[3]], 
    dateSelections.minutes[indices[4]]
  )
}
