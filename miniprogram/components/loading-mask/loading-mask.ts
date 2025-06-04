// components/loading-mask/loading-mask.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    isLoading: {
      type: Boolean,
      value: true
    },
    isFailed: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    longLoading: false
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },

  lifetimes: {
    attached: function() {
      setTimeout(() => {
        this.setData({
          longLoading: true
        });
      }, 1500);
    }
  }
})