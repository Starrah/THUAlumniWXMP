import apiService from "../../commons/api";
import {
  WEIXIN_LOGIN,
  LOGIN,
  FETCH_PROFILE,
  FETCH_ALUMN,
  GOTO_QHR,
  UPDATE_USER_AVATAR,
  FETCH_MY_ACTIVITY_LIST
} from "../action";
import {SET_PROFILE, SET_ALUMN} from "../mutation";
import initialGlobalData from "@/apps/typesDeclare/InitialGlobalData";

const state = {
  name: "未登录",
  campusIdentity: [],
  avatarUrl: initialGlobalData.devData.DEFAULT_AVATAR_URL,
  logined: false,
  openId: "",
  alumn: {}
};

const mutations = {
  [SET_PROFILE](state, newProfile) {
    Object.assign(state, newProfile);
  },
  [SET_ALUMN](state, newAlumn) {
    state["alumn"] = newAlumn;
  }
};

const actions = {
  async [WEIXIN_LOGIN]({ dispatch, rootState }) {
    uni.login({
      provider: "weixin",
      success: loginRes => {
        dispatch(LOGIN, {
          code: loginRes["code"]
        });
      },
      fail: () => {
        rootState.errMsg = "微信接口调用失败，请重试";
      }
    });
  },

  async [LOGIN]({ dispatch, commit }, { code }) {
    console.log("login");
    return apiService.get("/login", { code }).then(data => {
      console.log(data);
      apiService.session = data["session"];
      commit(SET_PROFILE, { openId: data["openId"] });
      console.log(apiService.session);
      if (data["result"] == "exist") {
        dispatch(FETCH_PROFILE);
      } else {
        uni.showModal({
          title: '无有效信息',
          content: '请前往清华人小程序填写您的教育信息后返回重试',
          success(res) {
            if (res.confirm)  dispatch(FETCH_ALUMN);
          }
        });
      }
    })
  },

  async [FETCH_ALUMN]({ commit, dispatch }) {
    console.log("fetch alumn")
    return apiService.get("/alumniCheck").then(data => {
      console.log(data["params"])
      commit(SET_ALUMN, data["params"]);
      dispatch(GOTO_QHR);
    })
  },

  async [GOTO_QHR]({ state }) {
    console.log("goto qhr");
    uni.navigateToMiniProgram({ ...state["alumn"] }
    );
  },

  async [FETCH_PROFILE]({ dispatch, commit, rootState, state }) {
    return apiService.get("/userData").then(data => {
      commit(SET_PROFILE, {
        ...data,
        logined: true
      });
      uni.getUserInfo({
        provider: 'weixin',
        success: function (infoRes) {
          if(state.avatarUrl !== infoRes.userInfo.avatarUrl) {
            commit(SET_PROFILE, {
              avatarUrl: infoRes.userInfo.avatarUrl
            });
            dispatch(UPDATE_USER_AVATAR)
          }
        }
      });
      dispatch(FETCH_MY_ACTIVITY_LIST);
    }).catch(err => {
      if (err.errid && err.errid === 101){
        setTimeout(()=>{
          dispatch(FETCH_PROFILE)
        }, 500)
      }
      if(err.errid && err.errid >= 500 && err.errid <= 599) {
        rootState.errMsg = err.errmsg;
      }
    });
  },

  async [UPDATE_USER_AVATAR]({state}){
    await apiService.post("/setAvatarUrl", {avatarUrl: state.avatarUrl})
  }
};


export default {
  state,
  mutations,
  actions
};
