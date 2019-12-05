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
import {OneSpecificSingupRule, SignupRule} from "@/apps/typesDeclare/SignupRule";
import SureModal from "@/components/SureModal.vue";

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
            let res = await apiService.post(`/modifyActivity?activityId=${activityId}`, newStatus);
            return res.activityId;
        }catch (e) {
            if (e.errid && e.errid >= 500 && e.errid <= 599) rootState.errMsg = e.errmsg;
            throw e;
        }
    },
    async [SUBMIT_ACTIVITY_CHANGE]({state, rootState}){
        let submitObj = {};
        for(let key in state.changeBuffer){
            if(state.changeBuffer[key] !== undefined && state.changeBuffer[key] !== state.activity[key]){
                submitObj[key] = state.changeBuffer[key];
            }
        }
        try {
            let res = await apiService.post(`/modifyActivity?activityId=${state.id}`, submitObj);
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

function assertRuleSame(r1: SignupRule, r2: SignupRule) {
    if(r1.ruleType !== r2.ruleType)return false;
    if(r1.accept){
        if(!r2.accept || r1.accept.length !== r2.accept.length)return false;
        for(let i=0;i<r1.accept.length;i++){
            if(assertRuleItemSame(r1.accept[i], r2.accept[i]))return false;
        }
    }
    if(r1.needAudit){
        if(!r2.needAudit || r1.needAudit.length !== r2.needAudit.length)return false;
        for(let i=0;i<r1.needAudit.length;i++){
            if(assertRuleItemSame(r1.needAudit[i], r2.needAudit[i]))return false;
        }
    }
    if(r1.reject){
        if(!r2.reject || r1.reject.length !== r2.reject.length)return false;
        for(let i=0;i<r1.reject.length;i++){
            if(assertRuleItemSame(r1.reject[i], r2.reject[i]))return false;
        }
    }
    return true;
}

function assertRuleItemSame(i1: OneSpecificSingupRule, i2: OneSpecificSingupRule) {
    return i1.department === i2.department && i1.enrollmentType === i2.enrollmentType && i1.minEnrollmentYear === i2.minEnrollmentYear && i1.maxEnrollmentYear === i2.maxEnrollmentYear;
}