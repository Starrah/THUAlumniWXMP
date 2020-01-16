import apiService from "../../commons/api";
import {FETCH_DEPARTMENT_LIST} from "../action";
import {SET_DEPARTMENT_LIST} from "../mutation";
import {handleNetExcept} from "@/apps/utils/networkUtils";

interface DepartmentListSchema {
    departments: Array<string>
    initialized: boolean
}

const state: DepartmentListSchema = {
    departments: ["加载中"],
    initialized: false
};

const mutations = {
    [SET_DEPARTMENT_LIST](state: DepartmentListSchema, ne: DepartmentListSchema) {
        ne["initialized"] = ne["initialized"] || true;
        Object.assign(state, ne);
    }
};

const actions = {
    async [FETCH_DEPARTMENT_LIST]({state, commit, rootState}){
        try {
            let res = await apiService.get('/departmentsList');
            commit(SET_DEPARTMENT_LIST, res);
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
