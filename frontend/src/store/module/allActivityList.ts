import apiService from "../../commons/api";
import {FETCH_ALL_ACTIVITY_LIST, FETCH_MORE_ACTIVITY, SUBMIT_NEW_ACTIVITY} from "../action";
import {ADD_MORE_ACTIVITY, SET_ALL_ACTIVITY_LIST, SET_NEW_ACTIVITY} from "../mutation";
import {ActivitySchema} from "@/apps/typesDeclare/ActivitySchema";
import {handleNetExcept} from "@/apps/utils/networkUtils";

const state: {
    activityList: Array<ActivitySchema>
} = {
    activityList: []
};

const mutations = {
    [SET_ALL_ACTIVITY_LIST](state, ne) {
        Object.assign(state, ne);
    },
    [ADD_MORE_ACTIVITY](state, ne){
        if(ne.activityList && ne.activityList.length !== 0) {
            if (state.activityList.length !== 0) {
                let lastId = state.activityList[state.activityList.length - 1].id;
                let lastIndex = ne.activityList.findIndex((v)=>v.id === lastId);
                if(lastIndex === -1)state.activityList = state.activityList.concat(ne.activityList);
                else{
                    for(let i=lastIndex+1;i<ne.activityList.length;i++){
                        state.activityList.push(ne.activityList[i]);
                    }
                }
            } else state.activityList.concat(ne.activityList)
        }
    }
};

const actions = {
    async [FETCH_ALL_ACTIVITY_LIST]({state, commit, rootState}, param){
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
            commit(SET_ALL_ACTIVITY_LIST, res);
        }catch (e) {
            handleNetExcept(e, true);
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
            handleNetExcept(e, true);
        }
    }

};

export default {
  state,
  mutations,
  actions
};
