<template>
  <div>
    <button class="cu-card flex mecard" open-type="getUserInfo" @getuserinfo="nameClick">
      <div class="cu-avatar round xl mecardavatar" :style="'background-image:url(' + fullUrl(profile.avatarUrl) + ');'"></div>
      <div class="content mecardtext" style>
        <div class="name">{{profile.name}}</div>
        <div v-if="!profile.status" class="cu-capsule round">
          <span class="'cu-tag bg-red">封禁中</span>
        </div>
        <div v-if="profile.logined" class="cu-capsule round">
          <span class="'cu-tag bg-cyan">积分</span>
          <span class="'cu-tag line-cyan">{{profile.point}}</span>
        </div>
        <div v-for="(item, idx) in profile.campusIdentity" :key="idx" class="cu-capsule round">
          <span :class="'cu-tag bg-' + colorList[idx]">{{item.department}}</span>
          <span :class="'cu-tag line-' + colorList[idx]">{{item.enrollmentType}}</span>
        </div>
      </div>
    </button>

    <div class="cu-card mycard2">
      <div class="cu-list grid no-border justify-around">
        <div class="cu-item" key="1">
          <navigator url="/pages/me/myActivityList?type=myParticipate">
            <div>{{myActivityList.myParticipate.length}}</div>
            <div class="margin-top-xs">我参与的</div>
          </navigator>
        </div>
        <div class="cu-item" key="2">
          <navigator url="/pages/me/myActivityList?type=mySponsor">
            <div>{{myActivityList.mySponsor.length}}</div>
            <div class="margin-top-xs">我发起的</div>
          </navigator>
        </div>
        <div class="cu-item" key="3">
          <navigator url="/pages/me/myActivityList?type=history">
            <div>{{myActivityList.history.length}}</div>
            <div class="margin-top-xs">历史记录</div>
          </navigator>
        </div>
      </div>
    </div>
    <view class="cu-bar bg-white solid-bottom margin-top arrow" @click="jumpToExtraEdit">
      <view class="action">
        <text class="cuIcon-title text-green"></text>
        <text class="text-xl">编辑个人补充信息</text>
      </view>
    </view>
    <view class="cu-bar bg-white solid-bottom arrow" @click="jumpToRecommend">
      <view class="action">
        <text class="cuIcon-title text-green"></text>
        <text class="text-xl">为我推荐的活动</text>
      </view>
    </view>
    <view class="cu-bar bg-white solid-bottom arrow" @click="jumpToAbout">
      <view class="action">
        <text class="cuIcon-title text-green"></text>
        <text class="text-xl">关于</text>
      </view>
    </view>

  </div>
</template>


<script lang="ts">
import { mapState } from "vuex";
import {LOGIN, FETCH_PROFILE, WEIXIN_LOGIN, FETCH_MY_ACTIVITY_LIST} from "@/store/action";
import {fullUrl} from "@/apps/utils/networkUtils";
import delay from 'delay';

export default {
  data() {
    return { colorList: ["blue", "orange", "purple", "green", "yellow", ] };
  },

  computed: {
    ...mapState(["profile"]),
    ...mapState(["myActivityList"])
  },

  methods: {
    async nameClick() {
      if (!this.profile.logined) {
        uni.showLoading({title: "加载中", mask: true});
        this.$store.dispatch(WEIXIN_LOGIN);
        while(this.$store.state.profile.inLoginStatus){
            await delay(100);
        }
        uni.hideLoading();
      }else{
        this.jumpToExtraEdit();
      }
    },
    fullUrl(s){
      return fullUrl(s);
    },
    jumpToRecommend(){
      uni.navigateTo({
        url: "/pages/activityList/recommend/recommend"
      })
    },
    jumpToAbout(){
      uni.navigateTo({
        url: "/pages/me/About"
      })
    },
    jumpToExtraEdit(){
      uni.navigateTo({
        url: "/pages/me/extraEdit"
      })
    }
  },

  onShow(){
    this.$store.dispatch(FETCH_MY_ACTIVITY_LIST);
  },
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
.arrow {
  padding-right: 90upx
}

.arrow:before {
  position: absolute;
  right: 30upx;
  display: block;
  width: 30upx;
  height: 30upx;
  color: #8799a3;
  content: "\e6a3";
  text-align: center;
  font-size: 34upx;
  font-family: cuIcon;
  line-height: 30upx
}
</style>
