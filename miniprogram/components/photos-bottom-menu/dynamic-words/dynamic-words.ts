// components/photos-bottom-menu/dynamic-words/dynamic-words.ts
import { ComponentWithStore } from 'mobx-miniprogram-bindings';
import { uiStore } from '../../../stores/uiStore';

ComponentWithStore({
  storeBindings: [
    {
      store: uiStore,
      fields: ['dynamicWordsAnimationClass'],
      actions: ['setDynamicWordsAnimationClass']
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
    }
  },

  data: {
    characters: [] as any,
  },

  lifetimes: {
    attached() {
      this.prepareCharacters(this.data.text);
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

    startAnimation() {
      (this as any).setDynamicWordsAnimationClass('animation');
    },

    endAnimation() {
      (this as any).setDynamicWordsAnimationClass('');
    }
  }
})