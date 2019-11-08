<template>
  <div>
    <view class="cu-card flex mecard">
      <div
        class="cu-avatar round xl mecardavatar"
        :style="'background-image:url(/static/' + gender + '.png);'"
      ></div>
      <div class="content mecardtext" style>
        <div class="name">{{name}}</div>
        <div v-for="(item, idx) in education" :key="idx" :class="'cu-capsule round'">
          <span :class="'cu-tag bg-' + colorList[idx]">{{item.department}}</span>
          <span :class="'cu-tag line-' + colorList[idx]">{{item.type}}</span>
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
import Vue from "vue";
import { Component } from "vue-property-decorator";
import promisify from "../../apps/Promisify";

@Component
export default class me extends Vue {
  name!: "me";

  mounted() {
    this.updateUserInfo();
  }

  async updateUserInfo() {
    let res = await promisify.request({
      url: getApp().globalData.baseUrl + "/userData",
      method: "GET",
      dataType: "json"
    });
    console.log(res);
    getApp().globalData.userInfo = res.data;
  }

  data() {
    const app = getApp();
    return {
      name: app.globalData.userInfo.name,
      globalData: app.globalData,
      gender: app.globalData.userInfo.gender || "male",
      education: app.globalData.userInfo.education,
      colorList: ["blue", "cyan", "olive"]
    };
  }
}
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
