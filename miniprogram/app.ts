// app.ts
App<IAppOption>({
  globalData: {
    navigationInfo: {
      menuHeight: undefined,
      menuTop: undefined
    },
  },

  onLaunch() {
    this.setNavigationInfo();
  },

  setNavigationInfo() {
    const menuInfo = wx.getMenuButtonBoundingClientRect();
    this.globalData.navigationInfo.menuHeight = menuInfo.height;
    this.globalData.navigationInfo.menuTop = menuInfo.top;
  },

})