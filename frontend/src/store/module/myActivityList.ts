import apiService from "../../commons/api";
import {FETCH_ALL_ACTIVITY_LIST, FETCH_MY_ACTIVITY_LIST, SUBMIT_NEW_ACTIVITY} from "../action";
import {SET_ALL_ACTIVITY_LIST, SET_MY_ACTIVITY_LIST, SET_NEW_ACTIVITY} from "../mutation";
import {ActivitySchema} from "@/apps/typesDeclare/ActivitySchema";

const state: {
    activityList: Array<ActivitySchema>;
    history: Array<ActivitySchema>;
    myParticipate: Array<ActivitySchema>;
    mySponsor: Array<ActivitySchema>;
} = {
    activityList: [],
    history: [],
    myParticipate: [],
    mySponsor: []
};

const mutations = {
    [SET_MY_ACTIVITY_LIST](state, ne) {
        Object.assign(state, ne);
        state.history = state.activityList.filter((v: ActivitySchema)=>v.statusGlobal !== 1);
        state.myParticipate = state.activityList.filter((v: ActivitySchema)=>v.statusGlobal === 1 && v.selfRole !== 2);
        state.mySponsor = state.activityList.filter((v: ActivitySchema)=>v.statusGlobal === 1 && v.selfRole === 2);
    }
};

const actions = {
    async [FETCH_MY_ACTIVITY_LIST]({state, commit, rootState}){
        try {
            let res = await apiService.get('/getSelfActivity');
            commit(SET_MY_ACTIVITY_LIST, res)
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
