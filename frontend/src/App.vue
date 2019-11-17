<script lang="ts">
import Vue from "vue";
import initialGlobalData from "./apps/typesDeclare/InitialGlobalData";
import store from "./store";
import apiService from "./commons/api";

apiService.init("aaa", "http://yapi.starrah.cn/mock/11");

export default Vue.extend({
  globalData: initialGlobalData,
  store,
  mounted: () => {
    store.watch(
      state     => (state.errMsg),  //watch state.errMsg
      newErrMsg => {                //when new errMsg come
        console.error(newErrMsg);
        uni.showToast({
          title: String(newErrMsg) || "无法预知的错误，请稍后重试",
          icon: "none"
        });
      }
    );
  },
  mpType: "app"
});
</script>

<style>
@import "colorui/main.css";
@import "colorui/icon.css";
</style>
