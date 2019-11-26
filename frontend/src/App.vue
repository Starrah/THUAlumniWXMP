<script lang="ts">
import Vue from "vue";
import initialGlobalData from "./apps/typesDeclare/InitialGlobalData";
import store from "./store";
import apiService from "./commons/api";
import {WEIXIN_LOGIN, FETCH_SESSION, LOGIN} from "./store/action";

apiService.init("aaa", "https://thalu.starrah.cn");

export default Vue.extend({
  globalData: initialGlobalData,
  store,
  mounted: () => {
    store.watch(
      state => state.errMsg, //watch state.errMsg
      newErrMsg => {         //when new errMsg come
        console.error(newErrMsg);
        uni.showToast({
          title: String(newErrMsg) || "无法预知的错误，请稍后重试",
          icon: "none"
        });
      }
    );
  },
  //@ts-ignore
  onShow(res) {
    console.log("onShow");
    console.log(res);
    if(!!res && !!res["referrerInfo"] && !!res["referrerInfo"]["extraData"]["oAuthSuccess"]) {
      store.dispatch(WEIXIN_LOGIN);
    }
  },
  mpType: "app"
});
</script>

<style>
@import "colorui/main.css";
@import "colorui/icon.css";
</style>
