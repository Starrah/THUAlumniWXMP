import {SET_ADVANCE_RULE, SET_ADVANCE_RULE_SAVED} from "../mutation";
import {SignupRule} from "@/apps/typesDeclare/SignupRule";

const state: {rule: SignupRule, saved: boolean} = {
    rule: {
        ruleType: 0,
        accept: [],
        needAudit: [],
        reject: []
    },
    saved: false
};

const mutations = {
  [SET_ADVANCE_RULE](state, newAdvanceRule: SignupRule) {
    state.rule = newAdvanceRule;
  },
  [SET_ADVANCE_RULE_SAVED](state, b: boolean){
      state.saved = b;
  }
};

const actions = {

};

export default {
  state,
  mutations,
  actions
}