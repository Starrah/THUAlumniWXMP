<template>
  <div :style="{position: 'relative', height: '100%'}">
    <div class="cu-list menu-avatar" v-for="(user, idx) in needAuditUsers" :key="idx">
      <div class="cu-item">
        <div class="cu-avatar round lg" :style="'background-image:url('+user.avatarUrl+');'" />
        <div class="content">
          <div class>{{user.name}}</div>
          <div class="text-sm flex">
            <div class="text-cut">{{user.submitMsg}}</div>
          </div>
        </div>
        <div>
          <div v-if="isAccepted(user.openId)" class="text-grey">已同意</div>
          <div v-else-if="isRejected(user.openId)" class="text-grey">已拒绝</div>
          <div v-else>
            <button @click="submit(user.openId, true)" class="cu-btn">接受</button>
            <button @click="submit(user.openId, false)" class="cu-btn margin-left-xs">拒绝</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!needAuditUsers">
      <view class="flex-sub text-center">
        <view class="solid-bottom text-df padding">
          <text class="lg text-gray cuIcon-emoji" />
          <text class="text-black">空空如也</text>
        </view>
      </view>
    </div>

    <div>
      <navigator open-type="navigateBack">
        <button :style="{objectPosition: 'bottom', position: 'absolute'}">返回</button>
      </navigator>
    </div>
  </div>
</template>



<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { UserStatus } from "../../../apps/typesDeclare/UserEnum";
import apiService from "../../../commons/api";

@Component
export default class memberReveiw extends Vue {
  acceptedUsers = [];
  rejectedUsers = [];
  needAuditUsers = [];
  isAccepted(userId) {
    return this.acceptedUsers.includes(userId);
  }
  isRejected(userId) {
    return this.rejectedUsers.includes(userId);
  }
  onShow() {
    this.acceptedUsers = [];
    this.rejectedUsers = [];
    this.needAuditUsers = [];
    this.fetchNeedReview(this.$store.state.activityDetail.id).then(res => {
      this.needAuditUsers = res.users;
      console.log(this.needAuditUsers);
    });
    console.log(this.needAuditUsers);
  }
  submit(userId, pass) {
    const activityId = this.$store.state.activityDetail.id;
    this.handleAudit(activityId, userId, pass).then(() => {
      if (pass) this.acceptedUsers.push(userId);
      else this.rejectedUsers.push(userId);
    });
  }
  async fetchNeedReview(activityId: string) {
    return apiService.get(`/needReview?activityId=${activityId}`);
  }
  async handleAudit(activityId, userId, pass) {
    const url = `/handleAudit?activityId=${activityId}&userId=${userId}&pass=${pass}`;
    return apiService.post(url);
  }
}
</script>
