<template>
  <view>
    <view>
      <view>活动名称</view>
      <view>XXXXX活动</view>
    </view>

    <view>
      <view>默认规则</view>
      <view>
        <radio-group @change="defaultRuleChanged">
          <label v-for="(item, idx) in rules" :key="item.value">
            <radio :value="item.value" :checked="idx === currentRuleIdx" />
            {{item.text}}
          </label>
        </radio-group>
      </view>
    </view>

    <view class="cu-card margin-top-sm">
      <view>直接通过的用户</view>
      <view v-for="(rule, idx) in acRuleList" :key="idx">
        <view>群体</view>
        <picker
          mode="multiSelector"
          @change="acChange"
          :range="pickerMatrix"
          :value="ruleToList(rule)"
        >
          <view @click="acClick(idx)">
            {{departmentList[rule.departIdx]}},
            {{educationList[rule.enrollIdx]}},
            入学年份从 {{rule.startAt}} 到 {{rule.endAt}}
          </view>
        </picker>
        <button @click="acAdd">+</button>
        <button v-if="acRuleList.length != 1" @click="acRemove(idx)">-</button>
      </view>
    </view>

    <view class="cu-card margin-top-sm">
      <view>需要审核的用户</view>
      <view v-for="(rule, idx) in adRuleList" :key="idx">
        <view>群体</view>
        <picker
                mode="multiSelector"
                @change="adChange"
                :range="pickerMatrix"
                :value="ruleToList(rule)"
        >
          <view @click="adClick(idx)">
            {{departmentList[rule.departIdx]}},
            {{educationList[rule.enrollIdx]}},
            入学年份从 {{rule.startAt}} 到 {{rule.endAt}}
          </view>
        </picker>
        <button @click="adAdd">+</button>
        <button v-if="adRuleList.length != 1" @click="adRemove(idx)">-</button>
      </view>
    </view>

    <view class="cu-card margin-top-sm">
      <view>不能参加的用户</view>
      <view v-for="(rule, idx) in rjRuleList" :key="idx">
        <view>群体</view>
        <picker
                mode="multiSelector"
                @change="rjChange"
                :range="pickerMatrix"
                :value="ruleToList(rule)"
        >
          <view @click="rjClick(idx)">
            {{departmentList[rule.departIdx]}},
            {{educationList[rule.enrollIdx]}},
            入学年份从 {{rule.startAt}} 到 {{rule.endAt}}
          </view>
        </picker>
        <button @click="rjAdd">+</button>
        <button v-if="rjRuleList.length != 1" @click="rjRemove(idx)">-</button>
      </view>
    </view>

    <button type="primary" @click="save">保存</button>
  </view>
</template>


<script lang="ts">
  import { SET_ADVANCE_RULE } from "@/store/mutation";
import {OneSpecificSingupRule} from "@/apps/typesDeclare/SignupRule";
  import {FETCH_DEPARTMENT_LIST, FETCH_EDUCATION_LIST} from "@/store/action";

class Rule {
  departIdx = 0;
  enrollIdx = 0;
  startAt = "1900";
  endAt = "1900";
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
      return new Array(this.yearEnd - this.yearStart)
        .fill(0)
        .map((d, i) => String(i + this.yearStart));
    },
    defaultYear: function() {
      return String(new Date(Date.now()).getFullYear());
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
      departmentList: this.$store.state.departmentList.departments,
      educationList: this.$store.state.educationTypesList.types,
      yearStart: 1911,
      yearEnd: new Date(Date.now()).getFullYear(),
      currentRuleIdx: 0,
      acCurrentIdx: 0,
      adCurrentIdx: 0,
      rjCurrentIdx: 0,
      acRuleList: [], //ruleList
      adRuleList: [], //ruleList
      rjRuleList: [] //ruleList
    };
  },

  async mounted() {
    if(!this.$store.state.departmentList.initialized)await this.$store.dispatch(FETCH_DEPARTMENT_LIST);
    if(!this.$store.state.educationTypesList.initialized)await this.$store.dispatch(FETCH_EDUCATION_LIST);
    this.currentRuleIdx = this.$store.state.advancedRule.ruleType;
    this.acRuleList = this.$store.state.advancedRule.accept.map((v: OneSpecificSingupRule): Rule=>{
      return {
        enrollIdx: this.educationList.indexOf(v.enrollmentType),
        departIdx: this.departmentList.indexOf(v.department),
        startAt: String(v.minEnrollmentYear),
        endAt: String(v.maxEnrollmentYear)
      }
    });
    this.adRuleList = this.$store.state.advancedRule.needAudit.map((v: OneSpecificSingupRule): Rule=>{
      return {
        enrollIdx: this.educationList.indexOf(v.enrollmentType),
        departIdx: this.departmentList.indexOf(v.department),
        startAt: String(v.minEnrollmentYear),
        endAt: String(v.maxEnrollmentYear)
      }
    });
    this.rjRuleList = this.$store.state.advancedRule.reject.map((v: OneSpecificSingupRule): Rule=>{
      return {
        enrollIdx: this.educationList.indexOf(v.enrollmentType),
        departIdx: this.departmentList.indexOf(v.department),
        startAt: String(v.minEnrollmentYear),
        endAt: String(v.maxEnrollmentYear)
      }
    });
  },

  methods: {
    save() {
      this.$store.commit(SET_ADVANCE_RULE, {
        ruleType: this.currentRuleIdx,
        accept: this.acRuleList.map((v: Rule): OneSpecificSingupRule=>{
          return {
            enrollmentType: this.educationList[v.enrollIdx],
            minEnrollmentYear: Number(v.startAt),
            maxEnrollmentYear:  Number(v.endAt),
            department: this.departmentList[v.departIdx]
          }
        }),
        needAudit: this.adRuleList.map((v: Rule): OneSpecificSingupRule=>{
          return {
            enrollmentType: this.educationList[v.enrollIdx],
            minEnrollmentYear: Number(v.startAt),
            maxEnrollmentYear:  Number(v.endAt),
            department: this.departmentList[v.departIdx]
          }
        }),
        reject: this.rjRuleList.map((v: Rule): OneSpecificSingupRule=>{
          return {
            enrollmentType: this.educationList[v.enrollIdx],
            minEnrollmentYear: Number(v.startAt),
            maxEnrollmentYear:  Number(v.endAt),
            department: this.departmentList[v.departIdx]
          }
        }),
      });
    },
    ruleToList(rule: Rule) {
      let start = parseInt(rule.startAt);
      let end = parseInt(rule.endAt);
      return [
        rule.departIdx,
        rule.enrollIdx,
        start - this.yearStart,
        end - this.yearStart
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
      this.acRuleList[this.acCurrentIdx].startAt = this.yearList[value[2]];
      this.acRuleList[this.acCurrentIdx].endAt = this.yearList[value[3]];
    },
    acClick(idx) {
      console.log("acClick: acCurrentIdx" + this.acCurrentIdx + " idx: " + idx);
      this.acCurrentIdx = idx;
    },
    acAdd() {
      let r = new Rule();
      r.startAt = this.defaultYear;
      r.endAt = this.defaultYear;
      this.acRuleList.push(r);
    },
    acRemove(idx) {
      if (this.acRuleList.length != 1) {
        console.log(
          "acRemove: acCurrentIdx" + this.acCurrentIdx + " idx: " + idx
        );
        this.acRuleList.splice(idx, 1);
      }
    },
    adChange({ detail }) {
      let { value } = detail;
      console.log("adChange");
      console.log(detail);
      this.adRuleList[this.adCurrentIdx].departIdx = value[0];
      this.adRuleList[this.adCurrentIdx].enrollIdx = value[1];
      this.adRuleList[this.adCurrentIdx].startAt = this.yearList[value[2]];
      this.adRuleList[this.adCurrentIdx].endAt = this.yearList[value[3]];
    },
    adClick(idx) {
      console.log("adClick: adCurrentIdx" + this.adCurrentIdx + " idx: " + idx);
      this.adCurrentIdx = idx;
    },
    adAdd() {
      let r = new Rule();
      r.startAt = this.defaultYear;
      r.endAt = this.defaultYear;
      this.adRuleList.push(r);
    },
    adRemove(idx) {
      if (this.adRuleList.length != 1) {
        console.log(
                "adRemove: adCurrentIdx" + this.adCurrentIdx + " idx: " + idx
        );
        this.adRuleList.splice(idx, 1);
      }
    },
    rjChange({ detail }) {
      let { value } = detail;
      console.log("rjChange");
      console.log(detail);
      this.rjRuleList[this.rjCurrentIdx].departIdx = value[0];
      this.rjRuleList[this.rjCurrentIdx].enrollIdx = value[1];
      this.rjRuleList[this.rjCurrentIdx].startAt = this.yearList[value[2]];
      this.rjRuleList[this.rjCurrentIdx].endAt = this.yearList[value[3]];
    },
    rjClick(idx) {
      console.log("rjClick: rjCurrentIdx" + this.rjCurrentIdx + " idx: " + idx);
      this.rjCurrentIdx = idx;
    },
    rjAdd() {
      let r = new Rule();
      r.startAt = this.defaultYear;
      r.endAt = this.defaultYear;
      this.rjRuleList.push(r);
    },
    rjRemove(idx) {
      if (this.rjRuleList.length != 1) {
        console.log(
                "rjRemove: rjCurrentIdx" + this.rjCurrentIdx + " idx: " + idx
        );
        this.rjRuleList.splice(idx, 1);
      }
    }
  }
};
</script>