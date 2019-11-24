import apiService from "../../commons/api";
import {FETCH_ACTIVITY_DETAIL, FETCH_ALL_ACTIVITY_LIST, SUBMIT_NEW_ACTIVITY} from "../action";
import {SET_ACTIVITY_DETAIL, SET_ACTIVITY_DETAIL_ID, SET_ALL_ACTIVITY_LIST, SET_NEW_ACTIVITY} from "../mutation";
import {ActivityStatus} from "@/apps/typesDeclare/ActivityEnum";
import {ActivitySchema} from "@/apps/typesDeclare/ActivitySchema";

const state: {
    activity: ActivitySchema,
    id: string
} = {
    activity: {id: "", name:"", start: "", end: "", place: "", curUser: 0, type: "", status: 0},
    id: ""
};

const mutations = {
    [SET_ACTIVITY_DETAIL](state, ne) {
        Object.assign(state.activity, ne);
    },
    [SET_ACTIVITY_DETAIL_ID](state, ne){
        state.id = ne;
    }
};

const actions = {
    async [FETCH_ACTIVITY_DETAIL]({state, commit, rootState}){
        try {
            let res = await apiService.get('/getActivityInfo', {activityId: state.id});
            commit(SET_ACTIVITY_DETAIL, res)
        }catch (e) {
            if (e.errid && e.errid >= 500 && e.errid <= 599) rootState.errMsg = e.errmsg;
        }
    }
};

export default {
  state,
  mutations,
  actions
};
