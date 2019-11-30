<template>
  <div>
    <view class="cu-card flex mecard" @click="nameClick">
      <div
        class="cu-avatar round xl mecardavatar"
        :style="'background-image:url(/static/male.png);'"
      ></div>
      <div class="content mecardtext" style>
        <div class="name">{{profile.name}}</div>
        <div v-for="(item, idx) in profile.campusIdentity" :key="idx" :class="'cu-capsule round'">
          <span :class="'cu-tag bg-' + colorList[idx]">{{item.department}}</span>
          <span :class="'cu-tag line-' + colorList[idx]">{{item.enrollmentType}}</span>
        </div>
      </div>
    </view>

    <div class="cu-card mycard2">
      <div class="cu-list grid no-border justify-around">
        <div class="cu-item" key="1">
          <navigator url="/pages/me/myParticipate">
            <div>100</div>
            <div class="margin-top-xs">我参与的</div>
          </navigator>
        </div>
        <div class="cu-item" key="2">
          <navigator url="/pages/me/mySponsor">
            <div>200</div>
            <div class="margin-top-xs">我发起的</div>
          </navigator>
        </div>
        <div class="cu-item" key="3">
          <navigator url="/pages/me/history">
            <div>300</div>
            <div class="margin-top-xs">历史记录</div>
          </navigator>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { mapState } from "vuex";
import { LOGIN, FETCH_PROFILE, WEIXIN_LOGIN } from "../../store/action";
import { SET_PROFILE } from "../../store/mutation";

export default {
  data() {
    return { colorList: ["cyan", "blue", "orange", "yellow"] };
  },

  computed: {
    ...mapState(["profile"])
  },

  methods: {
    nameClick(param) {
      if (!this.profile.logined) {
        this.$store.dispatch(WEIXIN_LOGIN);
      }
    }
  },
};
</script>


<style>
.mecard {
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: #fff;
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
