import apiService from "../../commons/api";
import {FETCH_ACTIVITY_TYPE_LIST, FETCH_DEPARTMENT_LIST, FETCH_EDUCATION_LIST, SUBMIT_NEW_ACTIVITY} from "../action";
import {SET_ACTIVITY_TYPE_LIST, SET_DEPARTMENT_LIST, SET_EDUCATION_LIST, SET_NEW_ACTIVITY} from "../mutation";
import {handleNetExcept} from "@/apps/utils/networkUtils";

interface EducationTypesListSchema {
    types: Array<string>
    initialized: boolean
}

const state: EducationTypesListSchema = {
    types: ["加载中"],
    initialized: false
};

const mutations = {
    [SET_EDUCATION_LIST](state: EducationTypesListSchema, ne: EducationTypesListSchema) {
        ne["initialized"] = ne["initialized"] || true;
        Object.assign(state, ne);
    }
};

const actions = {
    async [FETCH_EDUCATION_LIST]({state, commit, rootState}){
        try {
            let res = await apiService.get('/educationTypesList');
            commit(SET_EDUCATION_LIST, res);
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
