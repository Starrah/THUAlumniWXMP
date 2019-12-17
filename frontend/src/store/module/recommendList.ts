import apiService from "../../commons/api";
import {FETCH_ALL_ACTIVITY_LIST, FETCH_MORE_ACTIVITY, FETCH_RECOMMEND, SUBMIT_NEW_ACTIVITY} from "../action";
import {
    ADD_MORE_ACTIVITY,
    SET_ALL_ACTIVITY_LIST,
    SET_RECOMMEND,
    SET_RECOMMEND_PAGE_ID
} from "../mutation";
import {ActivitySchema} from "@/apps/typesDeclare/ActivitySchema";

const state: {
    activityList: Array<ActivitySchema>,
    activityId: string
} = {
    activityList: [],
    activityId: ""
};

const mutations = {
    [SET_RECOMMEND](state, ne) {
        Object.assign(state, ne);
    },
    [SET_RECOMMEND_PAGE_ID] (state, id){
        state.activityId = id;
    }
};

const actions = {
    async [FETCH_RECOMMEND]({state, commit, rootState}, param){
        console.log("fetchRecommend")
        if(!param)param = {};
        param.most = param.most || 15;
        try {
            let res;
            if(state.activityId && state.activityId !== "") {
                param.activityId = state.activityId;
                try {
                    res = await apiService.get('/recommendByActivity', param);
                }catch(e){
                    if(e.errid && e.errid === 201){
                        uni.showToast({title: e.errmsg, icon: "none"});
                        res = {activityList: []};
                    }else throw e;
                }
            }else{
                try {
                    res = await apiService.get('/recommendByUser', param);
                }catch(e){
                    if(e.errid && e.errid === 201){
                        uni.showToast({title: e.errmsg, icon: "none"});
                        res = {activityList: []};
                    }else throw e;
                }
            }
            commit(SET_RECOMMEND, res);
        }catch (e) {
            if (e.errid && e.errid >= 500 && e.errid <= 599) rootState.errMsg = e.errmsg;
            throw e;
        }
    },
    async [FETCH_MORE_ACTIVITY]({state, commit, rootState}, param){
        if(!param)param = {};
        param.most = param.most || 15;
        try {
            let res;
            if(param.searchWord && param.searchWord !== "") {
                try {
                    res = await apiService.get('/searchActivity', param);
                }catch(e){
                    if(e.errid && e.errid === 201){
                        uni.showToast({title: e.errmsg, icon: "none"});
                        res = {activityList: []};
                    }else throw e;
                }
            }else{
                res = await apiService.get('/getAllActivity', param);
            }
            commit(ADD_MORE_ACTIVITY, res)
        }catch (e) {
            if (e.errid && e.errid >= 500 && e.errid <= 599) rootState.errMsg = e.errmsg;
            throw e;
        }
    }

};

export default {
  state,
  mutations,
  actions
};
