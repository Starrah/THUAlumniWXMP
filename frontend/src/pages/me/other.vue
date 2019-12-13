<template>
  <div>
    <button class="cu-card flex mecard">
      <div class="cu-avatar round xl mecardavatar" :style="'background-image:url(' + fullUrl(profile.avatarUrl) + ');'"></div>
      <div class="content mecardtext" style>
        <div class="name">{{profile.name}}</div>
<!--        <button class="cu-btn bg-green" >点击登录</button>-->
        <div v-for="(item, idx) in profile.campusIdentity" :key="idx" :class="'cu-capsule round'">
          <span :class="'cu-tag bg-' + colorList[idx]">{{item.department}}</span>
          <span :class="'cu-tag line-' + colorList[idx]">{{item.enrollmentType}}</span>
        </div>
      </div>
    </button>
  </div>
</template>


<script lang="ts">
import { mapState } from "vuex";
import {LOGIN, FETCH_PROFILE, WEIXIN_LOGIN, FETCH_MY_ACTIVITY_LIST, FETCH_PROFILE_OTHER} from "@/store/action";
import {fullUrl} from "@/apps/utils/networkUtils";
import {SET_OTHER_ID} from "@/store/mutation";

export default {
  data() {
    return { colorList: ["cyan", "blue", "orange", "yellow"] };
  },

  computed: {
    profile: function () {
      return this.$store.state.otherProfile
    }
  },

  methods: {
    fullUrl(s){
      return fullUrl(s);
    }
  },

  onLoad(param){
    this.$store.commit(SET_OTHER_ID, param.openId);
    this.$store.dispatch(FETCH_PROFILE_OTHER);
  }
};
</script>


<style>
.mecard {
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: #fff;
  text-align: inherit;
  line-height: inherit;
}

.mycard2 {
  background-color: #fff;
  margin-top: 10px;
}

.mecardavatar {
  vertical-align: middle;
  margin-left: 10%;
}

.mecardtext {
  vertical-align: middle;
  padding-left: 12px;
}

.me-info {
  height: 180px;
}

.name {
  font-size: 18px;
}

.tag {
  margin-left: 8px;
  vertical-align: middle;
}

.me-avatar {
  width: 70px;
  height: 70px;
  background-position: 0% 0%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.me-verified {
  background-color: #5e068c !important;
  color: #fff;
}
</style>
