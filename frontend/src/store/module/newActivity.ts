import apiService from "../../commons/api";
import {SUBMIT_NEW_ACTIVITY} from "../action";
import {SET_NEW_ACTIVITY} from "../mutation";
import {ActivityStatus} from "@/apps/typesDeclare/ActivityEnum";

interface NewActivitySchema {
    name: string;
    place: string;
    type: string;
    start: string;
    end: string
    signupBeginAt?: string;
    signupStopAt?: string;
    maxUser?: number;
    minUser?: number;
    status?: ActivityStatus;
    canBeSearched: boolean;
    rules?: SignupRule
}

const state: NewActivitySchema = {
    signupBeginAt: "",
    signupStopAt: "",
    name: "",
    place: "",
    start: "",
    end: "",
    type: "",
    maxUser: -1,
    minUser: -1,
    status: 2,
    canBeSearched: true,
};

const mutations = {
    [SET_NEW_ACTIVITY](state: NewActivitySchema, ne: NewActivitySchema) {
        state.name = ne.name;
        state.place = ne.place;
        state.start = ne.start;
        state.end = ne.end;
        state.type = ne.type;
        state.signupBeginAt = ne.signupBeginAt;
        state.signupStopAt = ne.signupStopAt;
        state.minUser = ne.minUser;
        state.maxUser = ne.maxUser;
        state.status = state.signupBeginAt?ActivityStatus.BeforeSignup:ActivityStatus.Signup;
        state.canBeSearched = ne.canBeSearched;
        state.rules = ne.rules;
    }
};

const actions = {
    async [SUBMIT_NEW_ACTIVITY]({state, commit, rootState}){
        try {
            let res = await apiService.post('/createActivity', state);
            return res.activityId;
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
