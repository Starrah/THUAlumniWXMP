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
import {reject} from "q";

const state = {
  name: "未登录",
  campusIdentity: [],
  avatarUrl: initialGlobalData.devData.DEFAULT_AVATAR_URL,
  logined: false,
  openId: "",
  alumn: {},
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
    let loginRes = await new Promise((resolve, reject) => {
      uni.login({
        provider: "weixin",
        success: loginRes => {
          resolve(loginRes);
        },
        fail: () => {
          rootState.errMsg = "微信接口调用失败，请重试";
          reject();
        }
      });
    });
    await dispatch(LOGIN, {
      code: loginRes["code"]
    });
  },

  async [LOGIN]({ dispatch, commit }, { code }) {
    console.log("login");
    let data = await apiService.get("/login", { code });
    let session = data["session"];
    uni.setStorageSync("session", session);
    apiService.session = session;
    commit(SET_PROFILE, { openId: data["openId"] });
    if (data["result"] == "exist") {
      await dispatch(FETCH_PROFILE);
    } else {
        uni.showModal({
          title: '无有效信息',
          content: '请前往清华人小程序填写您的教育信息后返回重试',
          success(res) {
            if (res.confirm)dispatch(FETCH_ALUMN);
            else reject();
          },
        });
    }
  },

  async [FETCH_ALUMN]({ commit, dispatch }) {
    uni.showLoading({title: "加载中", mask: true});
    try {
      let data = await apiService.get("/alumniCheck");
      commit(SET_ALUMN, data["params"]);
      dispatch(GOTO_QHR);
    }finally {
      uni.showLoading();
    }
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
        return; //有某一次成功，函数则正常返回；
      }catch(err) {
        if (err.errid && err.errid === 101) {
          await delay(500);
        } else {
          handleNetExcept(err, true);
        }
      }
    }
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
