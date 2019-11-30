<template>
  <div>
    <div>
      <div>活动名称</div>
      <div>XXXXX活动</div>
    </div>

    <div>
      <div>默认规则</div>
      <div>
        <radio-group @change="defaultRuleChanged">
          <label v-for="(item, idx) in rules" :key="item.value">
            <radio :value="item.value" :checked="idx === currentRuleIdx" />
            {{item.text}}
          </label>
        </radio-group>
      </div>
    </div>

    <div class="cu-card margin-top-sm">
      <div>直接通过的用户</div>
      <div v-for="(rule, idx) in acRuleList" :key="idx">
        <div>群体</div>
        <picker
          mode="multiSelector"
          @change="acChange"
          :range="pickerMatrix"
          :value="ruleToList(rule)"
        >
          <div @click="acClick(idx)">
            {{departmentList[rule.departIdx]}},
            {{educationList[rule.enrollIdx]}},
            入学年份从 {{rule.startAt}} 到 {{rule.endAt}}
          </div>
        </picker>
        <button @click="acAdd">+</button>
        <button v-if="acRuleList.length != 1" @click="acRemove(idx)">-</button>
      </div>
    </div>

    <div>
      <div>需要审核的用户</div>
    </div>

    <div>
      <div>不能参加的用户</div>
    </div>

    <button type="primary" @click="save">保存</button>
  </div>
</template>


<script lang="ts">
import { mapGetters } from "vuex";
import { SET_ADVANCE_RULE } from "../../store/mutation";

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
          value: "audit",
          text: "需审核"
        },
        {
          value: "reject",
          text: "拒绝"
        }
      ],
      departmentList: ["软件学院", "人文学院", "电子系", "啦啦系"],
      educationList: ["本科", "硕士生", "博士生"],
      yearStart: 1900,
      yearEnd: 2100,
      currentRuleIdx: 0,
      acCurrentIdx: 0,
      adCurrentIdx: 0,
      rjCurrentIdx: 0,
      acRuleList: [], //ruleList
      adRuleList: [], //ruleList
      rjRuleList: [] //ruleList
    };
  },

  mounted() {
    console.log("mounted");
    this.acAdd();
  },

  methods: {
    save() {
      this.$store.commit(SET_ADVANCE_RULE, {
        defaultRule: this.currentRuleIdx,
        acRuleList: this.acRuleList,
        adRuleList: this.adRuleList,
        rjRuleList: this.rjRuleList
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
    }
  }
};
</script>