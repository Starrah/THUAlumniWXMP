<template>
  <view>
    <view class="cu-form-group margin-top-sm" style="border-left-width: 4px;border-left-style: solid; border-left-color: rgb(238,238,238);border-right-width: 4px;border-right-style: solid;border-right-color: rgb(238,238,238)">
      <view class="title">活动名称</view>
      <view>XXXXX活动</view>
    </view>

    <view class="cu-form-group margin-top-sm" style="border-left-width: 4px;border-left-style: solid; border-left-color: rgb(238,238,238);border-right-width: 4px;border-right-style: solid;border-right-color: rgb(238,238,238)">
      <view class="title">默认规则</view>
      <view>
        <radio-group @change="defaultRuleChanged" :disabled="!allowModify">
          <label v-for="(item, idx) in rules" :key="item.value" style="margin-left: 5px">
            <radio :value="item.value" :checked="idx === currentRuleIdx" />
            {{item.text}}
          </label>
        </radio-group>
      </view>
    </view>

    <view class="cu-card margin-top-sm" v-if="currentRuleIdx !== 0" style="border-left-width: 4px;border-left-style: solid; border-left-color: rgb(238,238,238);border-right-width: 4px;border-right-style: solid;border-right-color: rgb(238,238,238)">
      <view class="cu-form-group">
        <text class="title">直接通过的用户</text>
        <button v-if="allowModify" @click="acAdd" class="cu-btn line-green round cuIcon">
          <text style="color: #555555">+</text>
        </button>
      </view>
      <view v-for="(rule, idx) in acRuleList" :key="idx">
        <view>群体</view>
        <picker
          mode="multiSelector"
          @change="acChange"
          :range="pickerMatrix"
          :value="ruleToList(rule)"
          :disabled="!allowModify"
        >
          <view @click="acClick(idx)">
            {{departmentList[rule.departIdx]}},
            {{educationList[rule.enrollIdx]}},
            入学年份从 {{yearList[rule.startIdx]}} 到 {{yearList[rule.endIdx]}}
          </view>
        </picker>
        <button v-if="allowModify" @click="acAdd" class="cu-btn line-green round cuIcon">
          <text style="color: #555555">+</text>
        </button>
        <button v-if="allowModify" @click="acRemove(idx)" class="cu-btn line-green round cuIcon">
          <text style="color: #555555">-</text>
        </button>
      </view>
    </view>

    <view class="cu-card margin-top-sm" v-if="currentRuleIdx !== 1" style="border-left-width: 4px;border-left-style: solid; border-left-color: rgb(238,238,238);border-right-width: 4px;border-right-style: solid;border-right-color: rgb(238,238,238)">
      <view class="cu-form-group">
        <text class="title">需要审核的用户</text>
        <button v-if="allowModify" @click="adAdd" class="cu-btn line-green round cuIcon">
          <text style="color: #555555">+</text>
        </button>
      </view>
      <view v-for="(rule, idx) in adRuleList" :key="idx">
        <view>群体</view>
        <picker
                mode="multiSelector"
                @change="adChange"
                :range="pickerMatrix"
                :value="ruleToList(rule)"
                :disabled="!allowModify"
        >
          <view @click="adClick(idx)">
            {{departmentList[rule.departIdx]}},
            {{educationList[rule.enrollIdx]}},
            入学年份从 {{yearList[rule.startIdx]}} 到 {{yearList[rule.endIdx]}}
          </view>
        </picker>
        <button v-if="allowModify" @click="adAdd" class="cu-btn line-green round cuIcon">
          <text style="color: #555555">+</text>
        </button>
        <button v-if="allowModify" @click="adRemove(idx)" class="cu-btn line-green round cuIcon">
          <text style="color: #555555">-</text>
        </button>
      </view>
    </view>

    <view class="cu-card margin-top-sm margin-bottom-sm" v-if="currentRuleIdx !== 2" style="border-left-width: 4px;border-left-style: solid; border-left-color: rgb(238,238,238);border-right-width: 4px;border-right-style: solid;border-right-color: rgb(238,238,238)">
      <view class="cu-form-group">
        <text class="title">不能参加的用户</text>
        <button v-if="allowModify" @click="rjAdd" class="cu-btn line-green round cuIcon">
          <text style="color: #555555">+</text>
        </button>
      </view>
      <view v-for="(rule, idx) in rjRuleList" :key="idx">
        <view>群体</view>
        <picker
                mode="multiSelector"
                @change="rjChange"
                :range="pickerMatrix"
                :value="ruleToList(rule)"
                :disabled="!allowModify"
        >
          <view @click="rjClick(idx)">
            {{departmentList[rule.departIdx]}},
            {{educationList[rule.enrollIdx]}},
            入学年份从 {{yearList[rule.startIdx]}} 到 {{yearList[rule.endIdx]}}
          </view>
        </picker>
        <button v-if="allowModify" @click="rjRemove(idx)"class="cu-btn line-green round cuIcon">
          <text style="color: #555555">-</text>
        </button>
      </view>
    </view>
    <view style="display: flex;justify-content: center">
      <button type="primary" @click="save">保存</button>
    </view>
  </view>
</template>


<script lang="ts">
  import { SET_ADVANCE_RULE } from "@/store/mutation";
  import {OneSpecificSingupRule} from "@/apps/typesDeclare/SignupRule";
  import {FETCH_DEPARTMENT_LIST, FETCH_EDUCATION_LIST} from "@/store/action";

class Rule {
  departIdx = 0;
  enrollIdx = 0;
  startIdx = 0;
  endIdx = 0;
}

export default {
  computed: {
    pickerMatrix: function() {
      return [
        this.departmentList,
        this.educationList,
        this.yearList,
        this.yearList
      ];
    },
    yearList: function() {
      let r = new Array(this.yearEnd - this.yearStart)
        .fill(0)
        .map((d, i) => String(i + this.yearStart));
      return ["不限"].concat(r)
    },
    defaultYear: function() {
      return String(new Date(Date.now()).getFullYear());
    },
    departmentList: function(){
      return ["不限"].concat(this.$store.state.departmentList.departments)
    },
    educationList: function() {
      return ["不限"].concat(this.$store.state.educationTypesList.types);
    }
  },
  data() {
    return {
      rules: [
        {
          value: "accept",
          text: "接受"
        },
        {
          value: "needAudit",
          text: "需审核"
        },
        {
          value: "reject",
          text: "拒绝"
        }
      ],
      yearStart: 1911,
      yearEnd: new Date(Date.now()).getFullYear(),
      currentRuleIdx: 0,
      acCurrentIdx: 0,
      adCurrentIdx: 0,
      rjCurrentIdx: 0,
      acRuleList: [], //ruleList
      adRuleList: [], //ruleList
      rjRuleList: [], //ruleList
      allowModify: 1
    };
  },

  async mounted() {
    if(!this.$store.state.departmentList.initialized)await this.$store.dispatch(FETCH_DEPARTMENT_LIST);
    if(!this.$store.state.educationTypesList.initialized)await this.$store.dispatch(FETCH_EDUCATION_LIST);
    this.currentRuleIdx = this.$store.state.advancedRule.ruleType;
    this.acRuleList = this.$store.state.advancedRule.accept.map((v: OneSpecificSingupRule): Rule=>{
      return {
        enrollIdx: v.enrollmentType?this.educationList.indexOf(v.enrollmentType):0,
        departIdx: v.enrollmentType?this.departmentList.indexOf(v.department):0,
        startIdx: v.minEnrollmentYear?this.yearList.indexOf(v.minEnrollmentYear):0,
        endIdx: v.maxEnrollmentYear?this.yearList.indexOf(v.maxEnrollmentYear):0
      }
    });
    this.adRuleList = this.$store.state.advancedRule.needAudit.map((v: OneSpecificSingupRule): Rule=>{
      return {
        enrollIdx: v.enrollmentType?this.educationList.indexOf(v.enrollmentType):0,
        departIdx: v.enrollmentType?this.departmentList.indexOf(v.department):0,
        startIdx: v.minEnrollmentYear?this.yearList.indexOf(v.minEnrollmentYear):0,
        endIdx: v.maxEnrollmentYear?this.yearList.indexOf(v.maxEnrollmentYear):0
      }
    });
    this.rjRuleList = this.$store.state.advancedRule.reject.map((v: OneSpecificSingupRule): Rule=>{
      return {
        enrollIdx: v.enrollmentType?this.educationList.indexOf(v.enrollmentType):0,
        departIdx: v.enrollmentType?this.departmentList.indexOf(v.department):0,
        startIdx: v.minEnrollmentYear?this.yearList.indexOf(v.minEnrollmentYear):0,
        endIdx: v.maxEnrollmentYear?this.yearList.indexOf(v.maxEnrollmentYear):0
      }
    });
  },

  onLoad(param){
    if(param && param.allowModify)this.allowModify = param.allowModify;
  },

  methods: {
    save() {
      this.$store.commit(SET_ADVANCE_RULE, {
        ruleType: this.currentRuleIdx,
        accept: this.acRuleList.map((v: Rule): OneSpecificSingupRule=>{
          return {
            enrollmentType: v.enrollIdx !== 0?this.educationList[v.enrollIdx]:undefined,
            minEnrollmentYear: v.startIdx !== 0?this.yearList[v.startIdx]:undefined,
            maxEnrollmentYear: v.endIdx !== 0?this.yearList[v.endIdx]:undefined,
            department: v.departIdx !== 0?this.departmentList[v.departIdx]:undefined
          }
        }),
        needAudit: this.adRuleList.map((v: Rule): OneSpecificSingupRule=>{
          return {
            enrollmentType: v.enrollIdx !== 0?this.educationList[v.enrollIdx]:undefined,
            minEnrollmentYear: v.startIdx !== 0?this.yearList[v.startIdx]:undefined,
            maxEnrollmentYear: v.endIdx !== 0?this.yearList[v.endIdx]:undefined,
            department: v.departIdx !== 0?this.departmentList[v.departIdx]:undefined
          }
        }),
        reject: this.rjRuleList.map((v: Rule): OneSpecificSingupRule=>{
          return {
            enrollmentType: v.enrollIdx !== 0?this.educationList[v.enrollIdx]:undefined,
            minEnrollmentYear: v.startIdx !== 0?this.yearList[v.startIdx]:undefined,
            maxEnrollmentYear: v.endIdx !== 0?this.yearList[v.endIdx]:undefined,
            department: v.departIdx !== 0?this.departmentList[v.departIdx]:undefined
          }
        }),
      });
      uni.navigateBack();
    },
    ruleToList(rule: Rule) {
      return [
        rule.departIdx,
        rule.enrollIdx,
        rule.startIdx,
        rule.endIdx
      ];
    },
    defaultRuleChanged(event) {
      this.rules.forEach((r, idx) => {
        if (r.value === event.target.value) {
          this.currentRuleIdx = idx;
        }
      });
    },
    acChange({ detail }) {
      let { value } = detail;
      console.log("acChange");
      console.log(detail);
      this.acRuleList[this.acCurrentIdx].departIdx = value[0];
      this.acRuleList[this.acCurrentIdx].enrollIdx = value[1];
      this.acRuleList[this.acCurrentIdx].startIdx = value[2];
      this.acRuleList[this.acCurrentIdx].endIdx = value[3];
    },
    acClick(idx) {
      console.log("acClick: acCurrentIdx" + this.acCurrentIdx + " idx: " + idx);
      this.acCurrentIdx = idx;
    },
    acAdd() {
      let r = new Rule();
      this.acRuleList.push(r);
    },
    acRemove(idx) {
        this.acRuleList.splice(idx, 1);
    },
    adChange({ detail }) {
      let { value } = detail;
      console.log("adChange");
      console.log(detail);
      this.adRuleList[this.adCurrentIdx].departIdx = value[0];
      this.adRuleList[this.adCurrentIdx].enrollIdx = value[1];
      this.adRuleList[this.adCurrentIdx].startIdx = value[2];
      this.adRuleList[this.adCurrentIdx].endIdx =value[3];
    },
    adClick(idx) {
      console.log("adClick: adCurrentIdx" + this.adCurrentIdx + " idx: " + idx);
      this.adCurrentIdx = idx;
    },
    adAdd() {
      let r = new Rule();
      this.adRuleList.push(r);
    },
    adRemove(idx) {
        this.adRuleList.splice(idx, 1);
    },
    rjChange({ detail }) {
      let { value } = detail;
      console.log("rjChange");
      console.log(detail);
      this.rjRuleList[this.rjCurrentIdx].departIdx = value[0];
      this.rjRuleList[this.rjCurrentIdx].enrollIdx = value[1];
      this.rjRuleList[this.rjCurrentIdx].startIdx = value[2];
      this.rjRuleList[this.rjCurrentIdx].endIdx = value[3];
    },
    rjClick(idx) {
      console.log("rjClick: rjCurrentIdx" + this.rjCurrentIdx + " idx: " + idx);
      this.rjCurrentIdx = idx;
    },
    rjAdd() {
      let r = new Rule();
      this.rjRuleList.push(r);
    },
    rjRemove(idx) {
        this.rjRuleList.splice(idx, 1);
    }
  }
};
</script>
