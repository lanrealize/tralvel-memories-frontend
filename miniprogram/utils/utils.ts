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
export const setNavBarTextColor = (color: string, condition: string) => {
  if (condition === 'index') return
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
        if (!res.authSetting['scope.userFuzzyLocation']) {
          wx.authorize({
            scope: 'scope.userFuzzyLocation',
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
        if (res.authSetting['scope.userFuzzyLocation']) {
          wx.getFuzzyLocation({
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
                    resolve(result.address_component.city + ' ' + result.address_component.street);
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

/**
 * ===============================================
 * Readable times
 * ===============================================
*/
interface TimeComponents {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

export const formatReadableTime = (input: string): string => {
  // 1. 解析输入时间并验证格式
  const parts = input.split('/');
  if (parts.length !== 5) {
      throw new Error('Invalid format, should be YYYY/MM/DD/HH/mm');
  }

  const components: TimeComponents = {
    year: parseInt(parts[0]),
    month: parseInt(parts[1]),
    day: parseInt(parts[2]),
    hour: parseInt(parts[3]),
    minute: parseInt(parts[4])
  };

  // 验证数字有效性
  if (Object.values(components).some(isNaN)) {
      throw new Error('Invalida numbers');
  }

  // 2. 创建日期对象（注意月份从0开始）
  const inputDate = new Date(
      components.year,
      components.month - 1,
      components.day,
      components.hour,
      components.minute
  );
  
  // 验证日期有效性
  if (isNaN(inputDate.getTime())) {
      throw new Error('Invalide date');
  }

  const now = new Date();
  
  // 3. 计算时间差（毫秒）
  const timeDiff = now.getTime() - inputDate.getTime();
  const minuteDiff = Math.floor(timeDiff / (1000 * 60));
  const hourDiff = Math.floor(minuteDiff / 60);
  
  // 4. 辅助函数：获取日期部分（忽略时间）
  const getDateValue = (date: Date): number => 
      date.getFullYear() * 10000 + 
      (date.getMonth() + 1) * 100 + 
      date.getDate();
  
  // 5. 计算日期差
  const todayValue = getDateValue(now);
  const inputDateValue = getDateValue(inputDate);
  const dateDiff = todayValue - inputDateValue;
  
  // 6. 修改后的时间段格式化函数
  const formatTime = (h: number, m: number): string => {
    const totalMinutes = h * 60 + m;
    
    // 定义时间段规则
    if (totalMinutes >= 0 && totalMinutes < 300) return "深夜";         // 00:00-05:00
    if (totalMinutes < 420) return "凌晨";                            // 05:00-07:00
    if (totalMinutes < 510) return "清晨";                            // 07:00-08:30
    if (totalMinutes < 600) return "早上";                            // 08:30-10:00
    if (totalMinutes < 690) return "上午";                            // 10:00-11:30
    if (totalMinutes < 780) return "中午";                            // 11:30-13:00
    if (totalMinutes < 900) return "午后";                            // 13:00-15:00
    if (totalMinutes < 1020) return "下午";                           // 15:00-17:00
    if (totalMinutes < 1140) return "傍晚";                           // 17:00-19:00
    if (totalMinutes < 1260) return "晚上";                           // 19:00-21:00
    if (totalMinutes < 1380) return "夜间";                           // 21:00-23:00
    return "午夜";                                                   // 23:00-00:00
  };
  
  // 7. 按优先级判断时间范围
  if (minuteDiff < 3) return "刚刚";  // 3分钟内
  
  if (dateDiff === 0) {  // 当天
      if (minuteDiff < 60) return `${minuteDiff}分钟前`;
      return `${hourDiff}小时前`;
  }
  
  if (dateDiff === 1) return `昨天 ${formatTime(components.hour, components.minute)}`;
  if (dateDiff === 2) return `前天 ${formatTime(components.hour, components.minute)}`;
  
  // 8. 处理更早时间
  const isCurrentYear = now.getFullYear() === components.year;
  
  return isCurrentYear
      ? `${components.month}月${components.day}日 ${formatTime(components.hour, components.minute)}`
      : `${components.year}年${components.month}月${components.day}日 ${formatTime(components.hour, components.minute)}`;
}

/**
 * ===============================================
 * Share related
 * ===============================================
*/
export const buildShareLink = (
  openID: string = '',
  albumID: string = '',
  photoID: number = -1) => {
    let sharePath = `/pages/photos/photos?openID=${encodeURIComponent(openID)}&albumID=${encodeURIComponent(albumID)}&photoID=${encodeURIComponent(photoID)}&isShared=${true}`;
    return sharePath;
}

/**
 * ===============================================
 * Timeline related
 * ===============================================
*/
export const calculateTimeAxisSpacing = (timestamps: string[]): string[] => {
  const parseDate = (timestamp: string): Date => {
      const [year, month, day, hour, minute] = timestamp.split('/').map(Number);
      return new Date(year, month - 1, day, hour, minute);
  };

  const dates = timestamps.map(parseDate);
  const spacings: string[] = [];

  for (let i = 0; i < dates.length - 1; i++) {
      const diffMs = dates[i + 1].getTime() - dates[i].getTime();
      const diffMinutes = diffMs / (1000 * 60);

      let vw;
      if (diffMinutes < 5) vw = 7.5;
      else if (diffMinutes < 15) vw = 10;
      else if (diffMinutes < 30) vw = 12.5;
      else if (diffMinutes < 60) vw = 15;
      else if (diffMinutes < 120) vw = 17.5;
      else if (diffMinutes < 240) vw = 20;
      else if (diffMinutes < 480) vw = 22.5;
      else if (diffMinutes < 1440) vw = 25;
      else if (diffMinutes < 4320) vw = 27.5;
      else vw = 30;

      spacings.push(`${vw}`);
  }

  return spacings;
}