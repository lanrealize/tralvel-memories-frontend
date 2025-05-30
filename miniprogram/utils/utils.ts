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
 * Photos swiper indicator related methods
 * ===============================================
*/
export const calculateColor = (count: number, index: number, activeIndex: number): string => {
  const normalColor = "rgb(180, 180, 180)";
  const edgeColor = "rgb(100, 100, 100)";
  
  // 总项目数小于7时，全部使用普通颜色
  if (count < 7) return normalColor;

  // 处理特殊状态（activeIndex等于总数）
  if (activeIndex === count - 1) {
      return (activeIndex - index < 5) ? normalColor : edgeColor;
  }

  // 处理活跃项在前5项的情况
  if (activeIndex < 5) {
      return (index < 5) ? normalColor : edgeColor;
  }

  // 处理常规活跃项（>=6）
  const diff = activeIndex - index;
  return (diff > 0 && diff < 4) ? normalColor : edgeColor;
}

export const calculateLeft = (count: number, activeIndex: number): number => {
  if (count < 7) return 0;

  if (activeIndex < 5) return 0;

  // Actually it at position 'activeIndex' but displayed on position 6
  if (activeIndex === count - 1) return -1.6 * (activeIndex - 5)

  // Actually it at position 'activeIndex' but displayed on position 5)
  return -1.6 * (activeIndex - 4) 
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
  
  // 6. 格式化小时和分钟（移除前导零）
  const formatTime = (h: number, m: number): string => 
      `${h}:${m.toString().padStart(2, '0')}`;
  
  // 7. 按优先级判断时间范围
  if (minuteDiff < 3) return "刚刚";  // 3分钟内
  
  if (dateDiff === 0) {  // 当天
      if (minuteDiff < 60) return `${minuteDiff}分钟前`;
      return `${hourDiff}小时前`;
  }
  
  if (dateDiff === 1) return `昨天 ${formatTime(components.hour, components.minute)}`;
  if (dateDiff === 2) return `前天${formatTime(components.hour, components.minute)}`;
  
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
  index: number = -1) => {
    let sharePath = `/pages/photos/photos?openID=${encodeURIComponent(openID)}&albumID=${encodeURIComponent(albumID)}&index=${encodeURIComponent(index)}&isShared=${true}`;
    return sharePath;
}