// index.ts
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { generalStore } from '../../stores/generalStore';

Page({

  storageBinding: undefined as any,

  data: {
    
  },

  methods: {

  },

  onLoad() {
    this.storageBinding = createStoreBindings(this, {
      store: generalStore,
      fields: ['loginStatus'],
      actions: {setLoginStatus: 'setLoginStatus'}
    });
  }

})
