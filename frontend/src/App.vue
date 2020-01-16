<script lang="ts">
import Vue from "vue";
import initialGlobalData from "./apps/typesDeclare/InitialGlobalData";
import store from "./store";
import apiService from "./commons/api";
import {FETCH_PROFILE, TRY_LOGIN_WITHOUT_NEW_CODE} from "./store/action";

//#ifdef MP-WEIXIN
apiService.init(null, "https://thalu.starrah.cn");
//#endif
//#ifndef MP-WEIXIN
apiService.init(null, "http://thaluapitest.starrah.cn");
//#endif


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
  async onShow(res) {
    if(!!res && !!res["referrerInfo"] && !!res["referrerInfo"]["extraData"] && !!res["referrerInfo"]["extraData"]["oAuthSuccess"]) {
        uni.showLoading({title: "加载中", mask: true});
        try{
            await store.dispatch(FETCH_PROFILE);
        }finally {
            uni.hideLoading();
        }
    }
  },
  mpType: "app",
    onLaunch(){
        //#ifdef MP-WEIXIN
        uni.setEnableDebug({
            enableDebug: true
        });
        //#endif
        this.$store.dispatch(TRY_LOGIN_WITHOUT_NEW_CODE);
    }
});
</script>

<style>
@import "colorui/main.css";
@import "colorui/icon.css";
</style>
