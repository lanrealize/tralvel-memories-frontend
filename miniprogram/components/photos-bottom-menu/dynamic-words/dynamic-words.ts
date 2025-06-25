// components/photos-bottom-menu/dynamic-words/dynamic-words.ts
import { ComponentWithStore } from 'mobx-miniprogram-bindings';
import { uiStore } from '../../../stores/uiStore';
import { photosStore } from '../../../stores/photosStore';

ComponentWithStore({
  storeBindings: [
    {
      store: uiStore,
      fields: ['dynamicWordsAnimationClass'],
      actions: ['setDynamicWordsAnimationClass']
    },
    {
      store: photosStore,
      fields: ['photoDisplayIndex', 'photoCount'],
      actions: []
    }
  ],

  properties: {
    text: {
      type: String,
      value: '左滑查看后续照片',
      observer: 'prepareCharacters'
    },
    direction: {
      type: String,
      value: 'left', // 默认向右动画
      observer: 'prepareCharacters' // 方向变化时重新计算
    },
    delayStep: {
      type: Number,
      value: 0.1
    },
    primaryColor: {
      type: String,
      value: 'white' // 默认主题色
    }
  },

  data: {
    characters: [] as any,
  },

  lifetimes: {
    attached() {
      this.updateTextAndDirection();
    },

    detached() {
      (this as any).setDynamicWordsAnimationClass('');
    }
  },

  methods: {
    prepareCharacters(text: string) {
      const { delayStep, direction } = this.data;
      const chars = text.split('');
      const charactersData = chars.map((char, index) => {
        const delay = direction === 'left' 
          ? (chars.length - 1 - index) * delayStep 
          : index * delayStep;
        return { char, delay };
      });
      this.setData({ characters: charactersData });
    },

    updateTextAndDirection() {
      let text = '';
      let direction = '';

      if ((this as any).data.photoCount === 1) {
        text = '当前展示唯一照片';
      } else if ((this as any).data.photoDisplayIndex === (this as any).data.photoCount - 1) {
        text = '右滑查看之前照片';
        direction = 'right';
      } else {
        text = '左滑查看后续照片';
        direction = 'left';
      }

      this.setData({
        text,
        direction
      }, () => {
        this.prepareCharacters(text);
      });
    },
  }
})