import apiService from "../../commons/api";
import {FETCH_ALL_ACTIVITY_LIST, SUBMIT_NEW_ACTIVITY} from "../action";
import {SET_ALL_ACTIVITY_LIST, SET_NEW_ACTIVITY} from "../mutation";
import {ActivityStatus} from "@/apps/typesDeclare/ActivityEnum";
import {ActivitySchema} from "@/apps/typesDeclare/ActivitySchema";

const state: {
    activityList: Array<ActivitySchema>
} = {
    activityList: []
};

const mutations = {
    [SET_ALL_ACTIVITY_LIST](state, ne) {
        Object.assign(state, ne);
    }
};

const actions = {
    async [FETCH_ALL_ACTIVITY_LIST]({state, commit, rootState}){
        try {
            let res = await apiService.get('/getAllActivity');
            commit(SET_ALL_ACTIVITY_LIST, res)
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
