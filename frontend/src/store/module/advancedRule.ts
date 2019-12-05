import { SET_ADVANCE_RULE } from "../mutation";

const state = {
    defaultRule: 0,
    acRuleList: [],
    adRuleList: [],
    rjRuleList: []
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