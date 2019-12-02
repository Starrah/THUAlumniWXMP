import Vue from "vue";
import Vuex from "vuex";

import profile from "./module/profile";
import newActivity from "./module/newActivity"
import activityTypeList from "@/store/module/activityTypeList";
import allActivityList from "@/store/module/allActivityList";
import activityDetail from "@/store/module/activityDetail";
import advancedRule from "./module/advancedRule";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    "errMsg": ""
  },
  modules: {
    profile,
    newActivity,
    activityTypeList,
    allActivityList,
    activityDetail,
    advancedRule
  }
})