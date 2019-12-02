import apiService from "../../commons/api";
import {SUBMIT_ACTIVITY_STATUS_CHANGE, SUBMIT_NEW_ACTIVITY} from "../action";
import {SET_NEW_ACTIVITY, SYNC_RULE_NEW_ACTIVITY} from "../mutation";
import {ActivitySchema} from "@/apps/typesDeclare/ActivitySchema";
import {ActivityCheckStatus, ActivityGlobalStatus, ActivityJoinStatus} from "@/apps/typesDeclare/ActivityEnum";
import {Store} from "vuex";
import {OneSpecificSingupRule} from "@/apps/typesDeclare/SignupRule";

const state: ActivitySchema = {
    id: undefined,
    name: "",
    place: "",
    start: "",
    end: "",
    type: "",
    avatarUrl: "",
    maxUser: -1,
    minUser: -1,
    canBeSearched: true,
    statusGlobal: ActivityGlobalStatus.Normal,
    statusJoin: ActivityJoinStatus.Before,
    statusCheck: ActivityCheckStatus.Before,
    rules: {ruleType: 1},
    tags: [],
    description: ""
};

const mutations = {
    [SET_NEW_ACTIVITY](state: ActivitySchema, ne: ActivitySchema) {
        state.name = ne.name;
        state.place = ne.place;
        state.start = ne.start;
        state.end = ne.end;
        state.type = ne.type;
        state.tags = ne.tags;
        state.avatarUrl = ne.avatarUrl;
        state.signupBeginAt = ne.signupBeginAt;
        state.signupStopAt = ne.signupStopAt;
        state.minUser = ne.minUser;
        state.maxUser = ne.maxUser;
        state.canBeSearched = ne.canBeSearched;
        state.tags = ne.tags;
        state.description = ne.description || "";
        state.statusGlobal = ActivityGlobalStatus.Normal;
        state.statusCheck = ActivityCheckStatus.Before;
        state.statusJoin = ne.signupBeginAt ? ActivityJoinStatus.Before : ActivityJoinStatus.Continue
        state.id = undefined
    },
    [SYNC_RULE_NEW_ACTIVITY](state: ActivitySchema, rootState) {
        let advancedObj: {
            defaultRule: number,
            acRuleList: Array<OneSpecificSingupRule>,
            adRuleList: Array<OneSpecificSingupRule>,
            rjRuleList: Array<OneSpecificSingupRule>
        } = rootState.advancedRule;
        console.log(advancedObj);
        //TODO 和advancedRule的vuex对接
    }
};

const actions = {
    async [SUBMIT_NEW_ACTIVITY]({state, commit, rootState}){
        try {
            let res = await apiService.post('/createActivity', state);
            return res.activityId;
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
