import apiService from "../../commons/api";
import {FETCH_ALL_ACTIVITY_LIST, FETCH_MY_ACTIVITY_LIST, SUBMIT_NEW_ACTIVITY} from "../action";
import {SET_ALL_ACTIVITY_LIST, SET_MY_ACTIVITY_LIST, SET_NEW_ACTIVITY} from "../mutation";
import {ActivitySchema} from "@/apps/typesDeclare/ActivitySchema";
import {handleNetExcept} from "@/apps/utils/networkUtils";

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
        state.history = state.activityList.filter((v: ActivitySchema)=>(v.statusGlobal === 0 || v.statusGlobal === 2));
        state.myParticipate = state.activityList.filter((v: ActivitySchema)=>v.statusGlobal === 1 && v.selfRole !== 2);
        state.mySponsor = state.activityList.filter((v: ActivitySchema)=>(v.statusGlobal === 1 || v.statusGlobal === 3) && v.selfRole === 2);
    }
};

const actions = {
    async [FETCH_MY_ACTIVITY_LIST]({state, commit, rootState}){
        try {
            let res = await apiService.get('/getSelfActivity');
            commit(SET_MY_ACTIVITY_LIST, res)
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
