import apiService from "../../commons/api";
import { FETCH_PROFILE } from "../action";
import { SET_PROFILE } from "../mutation";

const state = {
  name: "未登录",
  campusIdentity: []
};

const mutations = {
  [SET_PROFILE](state, profile) {
    console.log(state.name)
    Object.assign(state, profile)
    console.log(state.name)
  }
};

const actions = {
  async [FETCH_PROFILE](context) {
    return apiService.get("/userData").then(data => {
      console.log("fetch data")
      context.commit(SET_PROFILE, data)
    }).catch(err => {
      console.log("fetch error")
      console.log(err)
    });
  }
};

export default {
  state,
  mutations,
  actions
};
