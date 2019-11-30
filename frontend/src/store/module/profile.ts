import apiService from "../../commons/api";
import { WEIXIN_LOGIN, LOGIN, FETCH_PROFILE, FETCH_ALUMN, GOTO_QHR } from "../action";
import { SET_PROFILE, SET_ALUMN } from "../mutation";

const state = {
  name: "未登录",
  campusIdentity: [],
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
    console.log("login")
    return apiService.get("/login", { code }).then(data => {
      if (data["result"] == "exist") {
        apiService.session = data["session"];
        commit(SET_PROFILE, { openId: data["openId"] });
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
    console.log("goto qhr")
    uni.navigateToMiniProgram({ ...state["alumn"] }
    );
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
