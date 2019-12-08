import { SET_ADVANCE_RULE } from "../mutation";
import {SignupRule} from "@/apps/typesDeclare/SignupRule";

const state: SignupRule = {
    ruleType: 0,
    accept: [],
    needAudit: [],
    reject: []
};

const mutations = {
  [SET_ADVANCE_RULE](state, newAdvanceRule) {
    Object.assign(state, newAdvanceRule);
  }
};

const actions = {

};

export default {
  state,
  mutations,
  actions
}