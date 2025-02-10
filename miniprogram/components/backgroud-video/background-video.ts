// components/backgroud-video/background-video.ts
import { wxLogin } from "../../utils/utils";

Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isLogging: false
  },

  /**
   * 组件的方法列表
   */
  methods: {

    async onStartClick() {
      try {
        this.setIsLogging(true);
        const openID = await wxLogin();
        console.log(openID);
      } catch (e) {
        console.log("Login failed!" + e);
      } finally {
        this.setIsLogging(false);
      }
    },

    setIsLogging(isLogging: boolean) {
      this.setData({
        isLogging: isLogging
      });
    }

  }
})