import Vue from "vue";
import Vuex from "vuex";

import profile from "./module/profile";
import newActivity from "./module/newActivity"
import activityTypeList from "@/store/module/activityTypeList";
import allActivityList from "@/store/module/allActivityList";
import activityDetail from "@/store/module/activityDetail";
import advancedRule from "./module/advancedRule";
import myActivityList from "@/store/module/myActivityList";
import departmentList from "@/store/module/departmentList";
import educationTypesList from "@/store/module/educationTypesList";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    "errMsg": ""
  },
  modules: {
    profile,
    newActivity,
    activityTypeList,
    departmentList,
    educationTypesList,
    allActivityList,
    activityDetail,
    advancedRule,
    myActivityList
  }
})