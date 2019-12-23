<template>
  <div>
    <view class="cu-card flex mecard margin-bottom-xl">
      <div class="cu-avatar round xl mecardavatar" :style="'background-image:url(' + fullUrl(profile.avatarUrl) + ');'"></div>
      <div class="content mecardtext" style>
        <div class="name">{{profile.name}}</div>
        <div v-if="!profile.status" class="cu-capsule round">
          <span class="'cu-tag bg-red">封禁中</span>
        </div>
        <div class="cu-capsule round">
          <span class="'cu-tag bg-cyan">积分</span>
          <span class="'cu-tag line-cyan">{{profile.point}}</span>
        </div>
        <div v-for="(item, idx) in profile.campusIdentity" :key="idx" :class="'cu-capsule round'">
          <span :class="'cu-tag bg-' + colorList[idx]">{{item.department}}</span>
          <span :class="'cu-tag line-' + colorList[idx]">{{item.enrollmentType}}</span>
        </div>
      </div>
    </view>
    <view v-if="ext" class="margin-top-xl">
      <view class="cu-form-group margin-top-sm" v-if="ext.phone && ext.phone !== ''">
        <view class="title">
          <text class="cuIcon-phone margin-right-xs"></text>
          <text>电话</text>
        </view>
        <text :selectable="true">{{ext.phone}}</text>
      </view>
      <view class="cu-form-group margin-top-sm" v-if="ext.wechat && ext.wechat !== ''">
        <view class="title">
          <text class="cuIcon-weixin margin-right-xs"></text>
          <text>微信号</text>
        </view>
        <text :selectable="true">{{ext.wechat}}</text>
      </view>
      <view class="cu-form-group margin-top-sm" v-if="ext.trade && ext.trade !== ''">
        <view class="title">
          <text class="cuIcon-profile margin-right-xs"></text>
          <text>行业</text>
        </view>
        <text :selectable="true">{{ext.trade}}</text>
      </view>
      <view class="cu-form-group margin-top-sm" v-if="ext.company && ext.company !== ''">
        <view class="title">
          <text class="cuIcon-group margin-right-xs"></text>
          <text>公司</text>
        </view>
        <text :selectable="true">{{ext.company}}</text>
      </view>
      <view class="cu-form-group margin-top-sm" v-if="ext.gender && ext.gender !== ''">
        <view class="title">
          <text class="cuIcon-my margin-right-xs"></text>
          <text>性别</text>
        </view>
        <text :selectable="true">{{ext.gender}}</text>
      </view>
      <view class="cu-form-group margin-top-sm" v-if="ext.email && ext.email !== ''">
        <view class="title">
          <text class="cuIcon-mail margin-right-xs"></text>
          <text>邮箱</text>
        </view>
        <text :selectable="true">{{ext.email}}</text>
      </view>
      <view class="cu-form-group margin-top-sm" v-if="ext.weibo && ext.weibo !== ''">
        <view class="title">
          <text class="cuIcon-weibo margin-right-xs"></text>
          <text>微博</text>
        </view>
        <text :selectable="true">{{ext.weibo}}</text>
      </view>
    </view>

  </div>
</template>


<script lang="ts">
import { mapState } from "vuex";
import {LOGIN, FETCH_PROFILE, WEIXIN_LOGIN, FETCH_MY_ACTIVITY_LIST, FETCH_PROFILE_OTHER} from "@/store/action";
import {fullUrl} from "@/apps/utils/networkUtils";
import {SET_OTHER_ID} from "@/store/mutation";

export default {
  data() {
    return { colorList: ["blue", "orange", "purple", "green", "yellow", ] };
  },

  computed: {
    profile: function () {
      return this.$store.state.otherProfile
    },
    ext: function () {
      let data;
      try {
        data = JSON.parse(this.profile.extraData);
      }finally {}
      return data;
    }
  },

  methods: {
    fullUrl(s){
      return fullUrl(s);
    }
  },

  onLoad(param){
    this.$store.commit(SET_OTHER_ID, param.openId);
    this.$store.dispatch(FETCH_PROFILE_OTHER, this.$store.state.activityDetail.activity.id);
  }
};
</script>


<style>
  .cu-form-group .title{
    min-width: calc(5em + 30upx);
  }

.mecard {
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: #fff;
  text-align: inherit;
  line-height: inherit;
}

  .mecardavatar {
  vertical-align: middle;
  margin-left: 10%;
}

.mecardtext {
  vertical-align: middle;
  padding-left: 12px;
}

  .name {
  font-size: 18px;
}

</style>
