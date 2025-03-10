// components/photo-player-item/photo-player-item.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    top: {
      type: Number,
      value: 0
    },
    height: {
      type: Number,
      value: 0
    },
    imageExist: {
      type: Boolean,
      value: false
    },
    ImageUrl: {
      type: String,
      value: ''
    },
    selfIndex: {
      type: String,
      value: ''
    },
    imageDescription: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onimageLoad() {
      this.triggerEvent('onImageLoad', {index: this.data.selfIndex});
    }
  }
})