import apiService from "../../commons/api";
import {FETCH_ACTIVITY_TYPE_LIST, SUBMIT_NEW_ACTIVITY} from "../action";
import {SET_ACTIVITY_TYPE_LIST, SET_NEW_ACTIVITY} from "../mutation";
import {handleNetExcept} from "@/apps/utils/networkUtils";

interface ActivityTypeListSchema {
    types: Array<{
        name: string,
        children: Array<{
            name: string
        }>
    }>
    level: number
    initialized: boolean
}

const state: ActivityTypeListSchema = {
    types: [{
        name: "加载中",
        children: [{
            name: "加载中"
        }]
    }],
    level:2,
    initialized: false
};

const mutations = {
    [SET_ACTIVITY_TYPE_LIST](state: ActivityTypeListSchema, ne: ActivityTypeListSchema) {
        ne["initialized"] = ne["initialized"] || true;
        Object.assign(state, ne);
    }
};

const actions = {
    async [FETCH_ACTIVITY_TYPE_LIST]({state, commit, rootState}){
        try {
            let res = await apiService.get('/activityTypesList');
            commit(SET_ACTIVITY_TYPE_LIST, res);
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
