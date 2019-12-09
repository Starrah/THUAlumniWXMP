<script lang="ts">
import Vue from "vue";
import initialGlobalData from "./apps/typesDeclare/InitialGlobalData";
import store from "./store";
import apiService from "./commons/api";
import {FETCH_PROFILE, TRY_LOGIN_WITHOUT_NEW_CODE} from "./store/action";

apiService.init(null, "http://thalu.starrah.cn");

export default Vue.extend({
  globalData: initialGlobalData,
  store,
  mounted: () => {
    store.watch(
      state => state.errMsg, //watch state.errMsg
      newErrMsg => {
          if(newErrMsg && newErrMsg !== ""){//when new errMsg come
              console.error(newErrMsg);
              uni.showToast({
                  title: String(newErrMsg) || "无法预知的错误，请稍后重试",
                  icon: "none"
              });
              store.state.errMsg = ""
          }
      }
    );
  },
  //@ts-ignore
  onShow(res) {
    if(!!res && !!res["referrerInfo"] && !!res["referrerInfo"]["extraData"] && !!res["referrerInfo"]["extraData"]["oAuthSuccess"]) {
      store.dispatch(FETCH_PROFILE);
    }
  },
  mpType: "app",
    onLaunch(){
        //#ifdef MP-WEIXIN
        uni.setEnableDebug({
            enableDebug: true
        })
        //#endif
        this.$store.dispatch(TRY_LOGIN_WITHOUT_NEW_CODE);
    }
});
</script>

<style>
@import "colorui/main.css";
@import "colorui/icon.css";
</style>
