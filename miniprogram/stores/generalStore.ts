import { action, observable } from "mobx-miniprogram";

export const generalStore = observable({

  loginStatus: false,

  setLoginStatus: action(
    (loginStatus: boolean) => {
      generalStore.loginStatus = loginStatus
    }
  ),

});