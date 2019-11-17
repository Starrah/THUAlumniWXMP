import Vue from "vue";
import Vuex from "vuex";

import profile from "./module/profile";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    "errMsg": ""
  },
  modules: {
    profile
  }
})