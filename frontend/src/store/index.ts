import Vue from "vue";
import Vuex from "vuex";

import profile from "./module/profile";
import newActivity from "./module/newActivity"
import activity from "./module/activity";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    "errMsg": ""
  },
  modules: {
    profile,
    newActivity,
    activity
  }
})