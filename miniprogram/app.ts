// app.ts
App<IAppOption>({
  globalData: {
    navigationInfo: {
      menuHeight: undefined,
      menuTop: undefined,
      menuRight: undefined
    },
  },

  onLaunch() {
    this.setNavigationInfo();
  },

  setNavigationInfo() {
    const systemInfo = wx.getSystemInfoSync();
    const screenWidth = systemInfo.windowWidth; 

    const menuInfo = wx.getMenuButtonBoundingClientRect();
    this.globalData.navigationInfo.menuHeight = menuInfo.height;
    this.globalData.navigationInfo.menuTop = menuInfo.top;
    this.globalData.navigationInfo.menuRight = screenWidth - menuInfo.right;
  },

})