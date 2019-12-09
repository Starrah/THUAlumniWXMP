<template>
  <div :style="{position: 'relative', height: '100%'}">

    <div class="cu-list menu-avatar" v-for="(user, idx) in participants" :key="idx">
      <div class="cu-item">


        <!-- Avatar -->
        <div class="cu-avatar round lg"
          :style="'background-image:url('+user.avatarUrl+');'"
        />


        <!-- Name and submit message -->
        <div class="content">
          <div>{{user.name}}</div>
          <div class="text-sm flex">
            <div v-if="showAuditButton || showKickButton"
              class="text-cut"
            >
              {{submitMsg(user.openId)}}
            </div>
          </div>
        </div>


        <!-- Audit mode -->
        <div v-if="showAuditButton">
          <div v-if="accepted(user.openId)" class="text-grey">已同意</div>
          <div v-else-if="rejected(user.openId)" class="text-grey">已拒绝</div>
          <div v-else>
            <button @click="submit(user.openId, true)" class="cu-btn">接受</button>
            <button @click="submit(user.openId, false)" class="cu-btn margin-left-xs">拒绝</button>
          </div>
        </div>


        <!-- Kick mode -->
        <div v-if="showKickButton">
          <div v-if="kicked(user.openId)" class="text-grey">已踢出</div>
          <div v-else>
            <button @click="kickOut(user.openId)" class="cu-btn">踢出</button>

            <div v-if="isCreator(myRole)">
              <button v-if="!isManager(user.role)"
                @click="setAsManager(user.openId, true)"
                class="cu-btn margin-left-xs"
              >
                设为管理员
              </button>
              <button v-else
                @click="setAsManager(user.openId, false)"
                class="cu-btn margin-left-xs"
              >
                移除管理员
              </button>
            </div>

          </div>
        </div>


      </div>
    </div>



    <!-- Placeholder if no data here -->
    <div v-if="!participants">
      <view class="flex-sub text-center">
        <view class="solid-bottom text-df padding">
          <text class="lg text-gray cuIcon-emoji" />
          <text class="text-black">空空如也</text>
        </view>
      </view>
    </div>

    <!-- Button to return last page -->
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
import { UserStatus, UserRole } from "../../../apps/typesDeclare/UserEnum";
import apiService from "../../../commons/api";
import { SET_ACTIVITY_DETAIL } from "../../../store/mutation";

@Component
export default class memberReveiw extends Vue {
  enableAudit = false;
  acceptedUsers = [];
  rejectedUsers = [];
  needAuditUsers = [];
  kickedUsers = [];
  get participants() {
    return this.$store.state.activityDetail.activity.participants;
  }
  get myRole() {
    return UserRole.Creator;
    return this.$store.state.activityDetail.selfRole;
  }
  get showAuditButton(): boolean {
    return this.enableAudit;
  }
  get showKickButton(): boolean {
    return true;
    return (!this.showAuditButton) && this.myRole !== UserRole.Common;
  }
  get activityId() {
    return this.$store.state.activityDetail.id;
  }
  isCreator(role) {
    return role === UserRole.Creator;
  }
  isManager(role) {
    return role === UserRole.Manager;
  }
  accepted(userId): boolean {
    return this.acceptedUsers.includes(userId);
  }
  rejected(userId): boolean {
    return this.rejectedUsers.includes(userId);
  }
  kicked(userId): boolean {
    return this.kickedUsers.includes(userId);
  }
  submitMsg(userId): string {
    const user = this.needAuditUsers.find(u => u.openId === userId);
    if (user) {
      return user.submitMsg;
    }
    return "";
  }
  setAsManager(userId, set) {
    this.handleSetRole(userId, set ? 1 : 0).then(() => {
      const newParticipants = this.participants.map(user => (
        Object.assign({}, user, {userRole: set ? UserRole.Manager : UserRole.Common})
      ))
      this.$store.commit(SET_ACTIVITY_DETAIL, Object.assign({},
        this.$store.state.activityDetail.activity,
        {participants: newParticipants}
      ))
    })
  }
  kickOut(userId) {
    const url = `/removeFromActivity?activityId=${this.activityId}&userId=${userId}`
    apiService.post(url).then(() => {
      this.kickedUsers.push(userId)
    })
  }
  onLoad({ enableAudit }: { enableAudit: boolean }) {
    this.acceptedUsers = [];
    this.rejectedUsers = [];
    this.needAuditUsers = [];
    this.kickedUsers = [];
    this.enableAudit = enableAudit;
    // Search my role in participants
    const myId = this.$store.state.profile.openId;
    // fetch needAuditUsers if neccesary
    if (this.isCreator(this.myRole) || this.isManager(this.myRole)) {
      this.fetchNeedReview().then(res => {
        console.log("res")
        console.log(res.users)
        this.needAuditUsers = res.users;
      });
    }
  }
  submit(userId, pass) {
    this.handleAudit(userId, pass).then(() => {
      if (pass) this.acceptedUsers.push(userId);
      else this.rejectedUsers.push(userId);
    });
  }
  async fetchNeedReview() {
    return apiService.get(`/needReview?activityId=${this.activityId}`);
  }
  async handleAudit(userId, pass) {
    const url = `/handleAudit?activityId=${this.activityId}&userId=${userId}&pass=${pass}`;
    return apiService.post(url);
  }
  async handleSetRole(userId, newRole) {
    const url = `/changeUserRole?activityId=${this.activityId}&userId=${userId}&newRole=${newRole}`;
    return apiService.post(url)
  }
}
</script>
