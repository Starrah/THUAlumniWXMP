import apiService from "../../commons/api";
import {FETCH_ALL_ACTIVITY_LIST, FETCH_MORE_ACTIVITY, FETCH_RECOMMEND, SUBMIT_NEW_ACTIVITY} from "../action";
import {
    ADD_MORE_ACTIVITY, ADD_RECOMMEND, SET_ADVAN_SEARCH_DATA,
    SET_ALL_ACTIVITY_LIST,
    SET_RECOMMEND,
    SET_RECOMMEND_PAGE_ID
} from "../mutation";
import {ActivitySchema} from "@/apps/typesDeclare/ActivitySchema";
import {handleNetExcept} from "@/apps/utils/networkUtils";

const state: {
    activityList: Array<ActivitySchema>,
    activityId: string,
    advanced: boolean,
    advanData: any
} = {
    activityList: [],
    activityId: "",
    advanced: false,
    advanData: undefined
};

const mutations = {
    [SET_RECOMMEND](state, ne) {
        Object.assign(state, ne);
    },
    [SET_RECOMMEND_PAGE_ID] (state, {activityId, advanced}){
        state.activityId = activityId;
        state.advanced = advanced || false;
    },
    [SET_ADVAN_SEARCH_DATA](state, data){
        state.advanData = data;
    },
    [ADD_RECOMMEND](state, ne){
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
    async [FETCH_RECOMMEND]({state, commit, rootState}, param){
        if(!param)param = {};
        param.most = param.most || 15;
        try {
            let res;
            if(state.advanced){
                try {
                    let url = `/searchActivityAdvanced?most=${param.most}`;
                    if(param.lastSeenId)url += `&lastSeenId=${param.lastSeenId}`;
                    res = await apiService.post(url, state.advanData);
                }catch(e){
                    if(e.errid && e.errid === 201){
                        uni.showToast({title: e.errmsg, icon: "none"});
                        res = {activityList: []};
                    }else throw e;
                }
            }
            else if(state.activityId && state.activityId !== "") {
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
            if(state.advanced && param.lastSeenId)commit(ADD_RECOMMEND, res);
            else commit(SET_RECOMMEND, res);
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
