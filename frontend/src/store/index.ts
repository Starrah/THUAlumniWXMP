import Vue from "vue";
import Vuex from "vuex";

import profile from "./module/profile";
import newActivity from "./module/newActivity"
import activityTypeList from "@/store/module/activityTypeList";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    "errMsg": ""
  },
  modules: {
    profile,
    newActivity,
    activityTypeList
  }
})