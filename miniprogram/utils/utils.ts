import { devUrlPrefix } from "../configs/network";
import { loginTimeThreshold, qqmapkey } from "../configs/normal"

/**
 * ===============================================
 * Login related
 * ===============================================
*/
export const wxLogin = () => {
  return new Promise((resolve, reject) => {
    try {
      let openID = wx.getStorageSync('openID');
      // According to current logic, if code reach here openID can not be true, so will not go into if branch and will absolutely go to else branch
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
                // Handle loginTime
                const now = new Date();
                wx.setStorageSync('loginTime', now.toISOString());

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

export const parseDate = (dateString: string) => {
  const [year, month, day, hours, minutes] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

/**
 * ===============================================
 * time related methods
 * ===============================================
*/
export const isTimeDiffGreaterThanThreshold = (dateA: any, dateB: any) => {
  const diffMs = dateA.getTime() - dateB.getTime();
  const diffMinutes = Math.abs(Math.round(diffMs / 60000)); 
  return diffMinutes > loginTimeThreshold ? true : false;
}

/**
 * ===============================================
 * Scroll view related methods
 * ===============================================
*/
export const getScrollViewTop = (scrollViewId: string) => {
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery();
    query.select(`.${scrollViewId}`).fields({
      scrollOffset: true
    });
    query.exec((res) => {
      if (res[0]) {
        resolve(res[0].scrollTop);
      } else {
        reject(new Error('Failed to get scroll-view node.'));
      }
    });
  });
}

/**
 * ===============================================
 * Navigation bar related methods
 * ===============================================
*/
export const setNavBarTextColor = (color: string) => {
  setTimeout(() => {
    
    if (color === 'white') {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#ff0000',
        animation: {
          duration: 900,
          timingFunc: 'easeInOut'
        }
      });
    } else {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ff0000',
        animation: {
          duration: 900,
          timingFunc: 'easeInOut'
        }
      });
    }

  }, 200);
}

/**
 * ===============================================
 * Location related methods
 * ===============================================
*/
export const getLocationPermission = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              resolve('Got location permission.');
            },
            fail() {
              reject('Failed to get location permission');
            }
          });
        } else {
          resolve('Already got location permission.');
        }
      },
      fail() {
        reject('Failed to get location permission');
      }
    });
  });
}

export const getLocationInfo = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userLocation']) {
          wx.getLocation({
            type: 'wgs84',
            success(res) {
              wx.request({
                url: 'https://apis.map.qq.com/ws/geocoder/v1/',
                data: {
                  location: `${res.latitude},${res.longitude}`,
                  key: qqmapkey,
                  get_poi: 0
                },
                success(res) {
                  if ((res as any).data.status === 0) {
                    const result = (res as any).data.result;
                    // resolve({
                    //   city: result.address_component.city,
                    //   address: result.address
                    // });
                    resolve(result.address_component.city);
                  } else {
                    console.log(res)
                    reject('解析位置失败');
                  }
                },
                fail() {
                  reject('QQ map request failed.');
                }
              });
            },
            fail(e: any) {
              wx.showToast({
                title: '获取位置失败',
                icon: 'none'
              });
              reject(e);
            }
          });
        } else {
          reject('No location permission.');
        }
      },
      fail() {
        reject('Get permissions failed.');
      }
    });
  });
}
