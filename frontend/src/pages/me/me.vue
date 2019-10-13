<template>
  <div class="me-bg">
    <view class="cu-card dynamic">
      <view class="cu-item shadow">
        <view class="cu-list menu-avatar">
          <view class="cu-item">
            <view
              class="cu-avatar round lg"
              :style="'backgroundImage: url(/static/' + gender + '.png);'"
            ></view>
            <view class="content flex-sub">
              <view>{{name}}</view>
              <view class="text-gray text-sm flex justify-between">已验证 清华大学软件学院</view>
            </view>
          </view>
        </view>
        <view class="cu-list menu-avatar comment">
          <view class="cu-timeline">
            <view class="cu-time">如今</view>
            <view class="cu-item cur cuIcon-evaluate_fill">
              <view class="content">
                <view class="cu-capsule radius">
                  <view class="cu-tag bg-cyan">软件学院</view>
                  <view class="cu-tag line-cyan">2018</view>
                </view>
                <view class="margin-top">博士生</view>
              </view>
            </view>
            <view class="cu-item cur cuIcon-evaluate_fill">
              <view class="content">
                <view class="cu-capsule radius">
                  <view class="cu-tag bg-blue">软件学院</view>
                  <view class="cu-tag line-blue">2014</view>
                </view>
                <view class="margin-top">本科生</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </div>
</template>

<script>
import Vue from "vue";
const app = getApp();
export default Vue.extend({
  data() {
    return {
      name: app.globalData.name,
      globalData: app.globalData,
      gender: app.globalData.gender || "male"
    };
  }
});
</script>

<style>
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
