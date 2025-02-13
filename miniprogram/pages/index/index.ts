// index.ts
import { ComponentWithStore } from 'mobx-miniprogram-bindings';
import { generalStore } from '../../stores/generalStore';


ComponentWithStore({
  storeBindings: [
    {
      store: generalStore,
      fields: ['loginStatus'],
      actions: {setLoginStatus: 'setLoginStatus'}
    }],

  data: {
    
  },
  methods: {

  },

})
