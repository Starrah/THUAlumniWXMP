import apiService from "../../commons/api";
import initialGlobalData from "@/apps/typesDeclare/InitialGlobalData";
import {SET_OTHER_ID, SET_PROFILE_OTHER} from "@/store/mutation";
import {FETCH_PROFILE_OTHER} from "@/store/action";

const state = {
  name: "加载中",
  campusIdentity: [],
  avatarUrl: initialGlobalData.devData.DEFAULT_AVATAR_URL,
  openId: "",
};

const mutations = {
  [SET_PROFILE_OTHER](state, newProfile) {
    Object.assign(state, newProfile);
  },
  [SET_OTHER_ID](state, openId){
    state.openId = openId;
  }
};

const actions = {
  async [FETCH_PROFILE_OTHER]({ dispatch, commit, rootState, state }) {
    console.log("prother")
    return apiService.get("/userData", {openId: state.openId}).then(data => {
      commit(SET_PROFILE_OTHER, {
        ...data,
      });
    }).catch(err => {
      if (err.errid && err.errid === 101){
        rootState.errMsg = "该用户未通过清华校友身份认证！";
      }
      if(err.errid && err.errid >= 500 && err.errid <= 599) {
        rootState.errMsg = err.errmsg;
      }
    });
  },
};


export default {
  state,
  mutations,
  actions
};
