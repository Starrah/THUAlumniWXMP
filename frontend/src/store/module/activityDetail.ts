import apiService from "../../commons/api";
import {
    FETCH_ACTIVITY_DETAIL,
    FETCH_ALL_ACTIVITY_LIST, SET_CHANGE_ACTIVITY, SUBMIT_ACTIVITY_CHANGE,
    SUBMIT_ACTIVITY_STATUS_CHANGE,
    SUBMIT_NEW_ACTIVITY
} from "../action";
import {
    SET_ACTIVITY_DETAIL,
    SET_ACTIVITY_DETAIL_ID,
    SET_ALL_ACTIVITY_LIST,
    SET_NEW_ACTIVITY,
    SYNC_CHANGE_ACTIVITY_DATA
} from "../mutation";
import {ActivitySchema} from "@/apps/typesDeclare/ActivitySchema";
import {
    ActivityCheckStatus,
    ActivityGlobalStatus,
    ActivityJoinStatus} from "@/apps/typesDeclare/ActivityEnum";
import {defaultBlankActivity} from "@/apps/utils/ActivitySchemaUtils";

const state: {
    activity: ActivitySchema,
    id: string,
    changeBuffer: ActivitySchema
} = {
    activity: defaultBlankActivity(),
    id: "",
    changeBuffer: defaultBlankActivity()
};

const mutations = {
    [SET_ACTIVITY_DETAIL](state, ne) {
        state.activity = ne;
    },
    [SET_ACTIVITY_DETAIL_ID](state, ne){
        state.id = ne;
    },
    [SYNC_CHANGE_ACTIVITY_DATA](state){
        state.changeBuffer = state.activity;
    },
    [SET_CHANGE_ACTIVITY](state, ne: ActivitySchema) {
        Object.assign(state.changeBuffer, ne)
    }
};

const actions = {
    async [FETCH_ACTIVITY_DETAIL]({state, commit, rootState}){
        try {
            let res = await apiService.get('/getActivityInfo', {activityId: state.id});
            commit(SET_ACTIVITY_DETAIL, res)
        }catch (e) {
            if (e.errid && e.errid >= 500 && e.errid <= 599) rootState.errMsg = e.errmsg;
            throw e;
        }
    },
    async [SUBMIT_ACTIVITY_STATUS_CHANGE]({state, commit, rootState}, {activityId, newStatus}){
        try {
            let res = await apiService.post(`/modifyActivity?activityId=${activityId}`, {status: newStatus});
            return res.activityId;
        }catch (e) {
            if (e.errid && e.errid >= 500 && e.errid <= 599) rootState.errMsg = e.errmsg;
            throw e;
        }
    },
    [SUBMIT_ACTIVITY_CHANGE]({state}){
        let simpleKeyNames = ["name", "place", "start", "end", "type", "avatarUrl", "statusGlobal", "statusJoin", "statusCheck", "canBeSearched", "tags", "description"]
        let submitObj = {};
        for(let key of simpleKeyNames){
            if(state.changeBuffer[key] !== state.activity[key]){
                submitObj[key] = state.changeBuffer[key];
            }
        }
        if()
    }
};

export default {
  state,
  mutations,
  actions
};
