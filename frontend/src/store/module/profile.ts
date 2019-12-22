import apiService from "../../commons/api";
import {
  WEIXIN_LOGIN,
  LOGIN,
  FETCH_PROFILE,
  FETCH_ALUMN,
  GOTO_QHR,
  UPDATE_USER_AVATAR,
  FETCH_MY_ACTIVITY_LIST, TRY_LOGIN_WITHOUT_NEW_CODE, SUBMIT_EXTRA_DATA
} from "../action";
import {SET_PROFILE, SET_ALUMN} from "../mutation";
import initialGlobalData from "@/apps/typesDeclare/InitialGlobalData";
import delay from "delay";
import {handleNetExcept} from "@/apps/utils/networkUtils";

const state = {
  name: "未登录",
  campusIdentity: [],
  avatarUrl: initialGlobalData.devData.DEFAULT_AVATAR_URL,
  logined: false,
  openId: "",
  alumn: {},
  inLoginStatus: false,
  status: 1,
  point: 0,
  extraData: "{}"
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
  async [SUBMIT_EXTRA_DATA]({dispatch}, data){
    try{
      await apiService.post("/setExtraData", {extraData: JSON.stringify(data)});
      dispatch(FETCH_PROFILE);
    }catch (e) {
      handleNetExcept(e, true);
    }
  },
  async [TRY_LOGIN_WITHOUT_NEW_CODE]({dispatch}){
    //#ifdef MP-WEIXIN
    let session = uni.getStorageSync("session");
    let sessionValid = await new Promise((resolve, reject)=>{
      uni.checkSession({
        success(){resolve(true);},
        fail(){resolve(false);}
      })
    });
    if(session && sessionValid){
      apiService.session = session;
      try {
        await dispatch(FETCH_PROFILE);
        console.log(["autoLogin", true]);
      }catch (e) {
        console.log(["autoLogin", false])
      }
    }
    else console.log(["autoLogin", false]);
    //#endif
  },

  async [WEIXIN_LOGIN]({ dispatch, rootState, state }) {
    state.inLoginStatus = true;
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
      let session = data["session"];
      uni.setStorageSync("session", session);
      apiService.session = session;
      commit(SET_PROFILE, { openId: data["openId"] });
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
    return apiService.get("/alumniCheck").then(data => {
      commit(SET_ALUMN, data["params"]);
      dispatch(GOTO_QHR);
    })
  },

  async [GOTO_QHR]({ state }) {
    uni.navigateToMiniProgram({ ...state["alumn"] });
  },

  async [FETCH_PROFILE]({ dispatch, commit, rootState, state }) {
    for(let i=0;i<6;i++) {//由于清华人后台异步通知我们的服务器，立即请求可能会拿不到；
      //因此隔500ms自动重试，上限重试5次
      try{
        let data = await apiService.get("/userData");
        commit(SET_PROFILE, {
          ...data,
          logined: true
        });
        uni.getUserInfo({
          provider: 'weixin',
          success: function (infoRes) {
            if (state.avatarUrl !== infoRes.userInfo.avatarUrl) {
              commit(SET_PROFILE, {
                avatarUrl: infoRes.userInfo.avatarUrl
              });
              dispatch(UPDATE_USER_AVATAR)
            }
          }
        });
        await dispatch(FETCH_MY_ACTIVITY_LIST);
        state.inLoginStatus = false;
        return; //有某一次成功，函数则正常返回；
      }catch(err){
        if (err.errid && err.errid === 101){
          await delay(500);
        }else{
          handleNetExcept(err, true);
        }
      }finally {
        state.inLoginStatus = false;
      }
    }
    state.inLoginStatus = false;
    rootState.errMsg = "可能由于您拒绝了清华人的授权申请，我们无法获得您的校友信息。请您重试。";
    throw {errid: 101, errmsg: "可能由于您拒绝了清华人的授权申请，我们无法获得您的校友信息。请您重试。"};
  },

  async [UPDATE_USER_AVATAR]({state}){
    try {
      await apiService.post("/setAvatarUrl", {avatarUrl: state.avatarUrl})
    }catch (e) {
      handleNetExcept(e, true);
    }
  }
};


export default {
  state,
  mutations,
  actions
};
