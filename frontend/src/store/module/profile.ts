import apiService from "../../commons/api";
import { LOGIN, FETCH_PROFILE } from "../action";
import { SET_PROFILE } from "../mutation";

const state = {
  name: "未登录",
  campusIdentity: [],
  logined: false
};

const mutations = {
  [SET_PROFILE](state, newProfile) {
    Object.assign(state, newProfile);
  }
};

const actions = {
  async [LOGIN]({ dispatch }) {
    uni.login({
      provider: "weixin",
      success: loginRes => {
        apiService.session = loginRes["code"];
        dispatch(FETCH_PROFILE);
      }
    })
  },

  async [FETCH_PROFILE]({ commit, rootState }) {
    return apiService.get("/userData").then(data => {
      commit(SET_PROFILE, {
        ...data,
        logined: true
      });
    }).catch(err => {
      if(err.errid && err.errid >= 500 && err.errid <= 599) {
        rootState.errMsg = err.errmsg;
      }
    });
  }
};

export default {
  state,
  mutations,
  actions
};
