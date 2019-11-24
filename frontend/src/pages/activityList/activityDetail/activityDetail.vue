<template>
    <view>
    <view class="cu-bar bg-white">
        <view class="action" @click="back">
            <text class="cuIcon-back text-gray"></text> 返回
        </view>
        <view class="content text-bold">
            活动详情
        </view>
    </view>
        <view>
            <view class="cu-form-group margin-top-sm">
                <view class="title">活动名称</view>
                <text>{{activityData.name}}</text>
            </view>
            <view class="cu-form-group margin-top-sm">
                <view class="title">活动类型</view>
                <text>{{activityData.type}}</text>
            </view>
            <view class="cu-form-group margin-top-sm">
                <view class="title">当前状态</view>
                <text>{{ActivityStatusShowStrings[activityData.status]}}</text>
            </view>
            <view class="cu-form-group margin-top">
                <view class="title">公开活动</view>
                <checkbox class="round" :class="activityData.canBeSearched?'checked':''" :checked="activityData.canBeSearched" ></checkbox>
            </view>
            <view class="cu-form-group margin-top-sm">
                <view class="title">地点</view>
                <text>{{activityData.place}}</text>
            </view>
            <view class="cu-form-group margin-top">
                <view class="title">开始时间</view>
                <text>{{withoutSec(activityData.start)}}</text>
            </view>
            <view class="cu-form-group margin-top">
                <view class="title">结束时间</view>
                <text>{{withoutSec(activityData.end)}}</text>
            </view>
            <view v-if="activityData.signupBeginAt" class="cu-form-group margin-top">
                <view class="title">报名开始</view>
                <text>{{withoutSec(activityData.signupBeginAt)}}</text>
            </view>
            <view v-if="activityData.signupStopAt" class="cu-form-group margin-top">
                <view class="title">报名截止</view>
                <text>{{activityData.signupStopAt?withoutSec(activityData.signupStopAt):'直到活动开始前均可报名'}}</text>
            </view>
            <view class="cu-form-group margin-top">
                <view class="title">人数</view>
                <view>
                    <view class="cu-avatar-group">
                        <view v-for="ava in avatarShowList" class="cu-avatar round sm" :style="'background-image:url('+ ava +');'"></view>
                    </view>
                    <text>等{{activityData.curUser}}人</text>
                    <text>/</text>
                    <text>{{userNeedString}}</text>
                </view>
            </view>
            <view class="cu-form-group margin-top">
                <view class="title">我的状态</view>
                <text>{{UserStatusShowStrings[activityData.selfStatus]}}</text>
            </view>
        </view>
        <view v-if="activityData.selfRole === UserRole.Common || activityData.selfRole === UserRole.None" style="display: flex;justify-content: space-around;">
            <button v-if="activityData.status === ActivityStatus.BeforeSignup" class="cu-btn bg-green lg align-center" :disabled="true">报名尚未开始</button>
            <button v-if="activityData.status === ActivityStatus.Signup && (activityData.selfStatus === UserStatus.None || activityData.selfStatus === UserStatus.Refused)" class="cu-btn bg-green lg align-center" @click="onPressAttend" :disabled="activityData.ruleForMe === 'reject'">{{signupButtonWords}}</button>
            <button v-if="activityData.status === ActivityStatus.SignupPaused && (activityData.selfStatus === UserStatus.None || activityData.selfStatus === UserStatus.Refused)" class="cu-btn bg-green lg align-center" :disabled="true">报名已暂停</button>
            <button v-if="(activityData.status === ActivityStatus.Signup || activityData.status === ActivityStatus.SignupPaused) && activityData.selfStatus === UserStatus.WaitValidate" class="cu-btn bg-red lg align-center" @click="exitCurActivity">撤回审核申请</button>
            <button v-if="(activityData.status === ActivityStatus.Signup || activityData.status === ActivityStatus.SignupPaused) && activityData.selfStatus === UserStatus.Joined" class="cu-btn bg-red lg align-center" @click="exitCurActivity">取消报名</button>
            <button v-if="activityData.status === ActivityStatus.SignupStopped" class="cu-btn lg align-center" :class="(activityData.selfStatus === UserStatus.None || activityData.selfStatus === UserStatus.Refused)?'bg-green':'bg-red'" :disabled="true">报名已截止</button>
        </view>
        <view v-if="activityData.selfRole === UserRole.Common" style="display: flex;justify-content: space-around;">
            <button v-if="activityData.status === ActivityStatus.Signin && activityData.selfStatus === UserStatus.NotChecked" class="cu-btn bg-green lg align-center" @click="signinActivity">签到</button>
            <button v-if="activityData.status === ActivityStatus.Signin && activityData.selfStatus === UserStatus.Checked" class="cu-btn bg-green lg align-center" :disabled="true">您已签到</button>
            <button v-if="activityData.status === ActivityStatus.SigninPaused && activityData.selfStatus === UserStatus.NotChecked" class="cu-btn bg-green lg align-center" :disabled="true">签到已停止</button>
        </view>
        <view v-if="activityAdminable(activityData)" style="display: flex;justify-content: space-around;">
            <button v-if="activityData.status === ActivityStatus.SignupStopped || activityData.status === ActivityStatus.SignupPaused || activityData.status === ActivityStatus.Signup" class="cu-btn bg-green lg align-center" @click="openAuditPage">审核({{activityData.needAuditCount?activityData.needAuditCount:0}}人)</button>
            <button v-if="activityData.status === ActivityStatus.SignupStopped || activityData.status === ActivityStatus.SignupPaused || activityData.status === ActivityStatus.SigninPaused" class="cu-btn bg-green lg align-center" @click="startSignin">开放签到</button>
            <button v-if="activityData.status === ActivityStatus.Signin" class="cu-btn bg-red lg align-center" @click="endSignin">停止签到</button>
        </view>
        <view v-if="activityAdminable(activityData)" style="display: flex;justify-content: space-around;">
            <button class="cu-btn bg-yellow lg align-center" @click="openSetStatusInfoModal">修改活动状态</button>
            <button class="cu-btn bg-yellow lg align-center" @click="openSetActivityInfoPage">修改活动信息</button>
        </view>
        <view v-if="activityCancelable(activityData)" style="display: flex;justify-content: space-around;">
            <button class="cu-btn bg-red lg align-center" @click="cancelActivityAdmin">取消活动</button>
        </view>
        <SureToast ref="SureToast"></SureToast>
        <view class="cu-modal" :class="auditReasonShowing?'show':''">
            <view>
                <text>您报名后需要审核。申请留言（可选，不超过300字）：</text>
                <textarea style="width: 90%;height: 100px;" v-model="auditReason"></textarea>
                <button class="cu-btn bg-green" @click="attendCurActivity">确定</button>
                <button class="cu-btn bg-red" @click="onPressCancelAudit">取消</button>
            </view>
        </view>
    </view>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component} from 'vue-property-decorator'
    import {ActivitySchema} from "@/apps/typesDeclare/ActivitySchema";
    import {withoutSec} from "@/apps/utils/DateStringFormat";
    import {ActivityStatus, ActivityStatusShowStrings} from "@/apps/typesDeclare/ActivityEnum";
    import {UserRole, UserStatus, UserStatusShowStrings} from "@/apps/typesDeclare/UserEnum";
    import apiService from '../../../commons/api'
    import SureToast from "@/components/SureToast.vue";
    import {SET_ACTIVITY_DETAIL_ID} from "@/store/mutation";
    import {FETCH_ACTIVITY_DETAIL, SUBMIT_ACTIVITY_STATUS_CHANGE} from "@/store/action";

    @Component({
        components: {SureToast}
    })
    export default class activityDetail extends Vue{
        name!: "activityDetail";
        get activityId(){
            return this.$store.state.activityDetail.id;
        }
        get activityData(){
            console.log(this.$store.state.activityDetail);
            return this.$store.state.activityDetail.activity;
        }
        AVATAR_GROUP_MAX = 4;
        get avatarShowList(){
            if(this.activityData && this.activityData.participants){
                let n = this.activityData.participants.length > this.AVATAR_GROUP_MAX?this.AVATAR_GROUP_MAX:this.activityData.participants.length;
                let res = [];
                for(let i=0;i<n;i++) {
                    res.push(this.activityData.participants[i].avatarUrl)
                }
                return res;
            }
            else return [];
        }
        get signupButtonWords(){
            if(this.activityData.ruleForMe === 'accept')return '立即报名';
            else if(this.activityData.ruleForMe === 'needAudit')return '申请报名';
            else return '您不可参加';
        }
        async updateActivityData(){
            this.$store.dispatch(FETCH_ACTIVITY_DETAIL);
        }
        onLoad(param: any){
            this.$store.commit(SET_ACTIVITY_DETAIL_ID, param.activityId);
            this.updateActivityData();
        }
        back(){
            uni.navigateBack();
        }
        get startDate(){
            return this.activityData.start.split(" ")[0];
        }
        get startTime(){
            return this.activityData.start.split(" ")[1].substr(0, 5)
        }
        get endDate(){
            return this.activityData.end.split(" ")[0];
        }
        get endTime(){
            return this.activityData.end.split(" ")[1].substr(0, 5)
        }
        get userNeedString(){
            let r2 = "";
            if(this.activityData.minUser && !this.activityData.maxUser){
                r2 = `最少${this.activityData.minUser}人`
            }else if(!this.activityData.minUser && this.activityData.maxUser){
                r2 = `最多${this.activityData.maxUser}人`
            }else if(this.activityData.minUser && this.activityData.maxUser){
                r2 = `需要${this.activityData.minUser}~${this.activityData.maxUser}人`
            }
            return r2;
        }
        withoutSec = withoutSec;
        ActivityStatusShowStrings = ActivityStatusShowStrings;
        UserStatusShowStrings = UserStatusShowStrings;
        UserRole = UserRole;
        UserStatus = UserStatus;
        ActivityStatus = ActivityStatus;
        activityCancelable(d: ActivitySchema){
            return (d.status === ActivityStatus.BeforeSignup || d.status === ActivityStatus.Signup || d.status === ActivityStatus.SignupPaused || d.status === ActivityStatus.SignupStopped) && d.selfRole === UserRole.Creator;
        }
        activityAdminable(d: ActivitySchema) {
            return d.status !== ActivityStatus.Except && (this.activityData.selfRole === UserRole.Creator || d.selfRole === UserRole.Manager);
        }
        auditModalShowing: boolean = false;
        auditReason: string = "";
        async onPressAttend(){
            if (this.activityData.ruleForMe === 'needAudit'){
                this.auditModalShowing = true;
            }else{
                return this.attendCurActivity();
            }
        }
        async onPressCancelAudit(){
            this.auditModalShowing = false;
        }
        async attendCurActivity(){
            let res = null;
            try {
                if (this.activityData.ruleForMe === 'accept') {
                    await ((this.$refs.SureToast as any).show("您报名后无需审核，可以直接加入本活动。\r\n确认要报名参加本活动吗？"));
                    res = apiService.post(`/joinActivity?activityId=${this.activityId}`, {})
                } else if (this.activityData.ruleForMe === 'needAudit') {
                    res = apiService.post(`/joinActivity?activityId=${this.activityId}`, {reason: this.auditReason})
                }
            }finally {}
            if(res && res.result === 'success'){
                uni.showToast({
                    title: this.activityData.ruleForMe === 'accept'?"报名成功":"提交审核成功",
                });
            }else{
                uni.showToast({
                    title: (res && res.errmsg) || '参加失败',
                    icon: "none"
                })
            }
            this.updateActivityData()
        }
        async exitCurActivity(){
            let res = await apiService.post(`/cancelJoinActivity?activityId=${this.activityId}`, {});
            if(res && res.result === 'success'){
                uni.showToast({
                    title: this.activityData.selfStatus === UserStatus.WaitValidate?"取消加入申请成功":"取消报名成功",
                });
            }else{
                uni.showToast({
                    title: (res && res.errmsg) || '取消报名失败',
                    icon: "none"
                })
            }
            this.updateActivityData()
        }
        async signinActivity(){
            uni.showToast({
                title: "尚未实现",
                icon: "none"
            });
            this.updateActivityData()
        }
        async openAuditPage(){
            uni.showToast({
                title: "尚未实现",
                icon: "none"
            });
            this.updateActivityData()
        }
        async startSignin(){
            await this.$store.dispatch(SUBMIT_ACTIVITY_STATUS_CHANGE, {activityId: this.activityId, newStatus: ActivityStatus.Signin});
            uni.showToast({
                title: "成功",
            });
            this.updateActivityData()
        }
        async endSignin(){
            await this.$store.dispatch(SUBMIT_ACTIVITY_STATUS_CHANGE, {activityId: this.activityId, newStatus: ActivityStatus.SigninPaused});
            uni.showToast({
                title: "成功",
            });
            this.updateActivityData()
        }
        async openSetStatusInfoModal(){
            uni.showToast({
                title: "尚未实现",
                icon: "none"
            });
            this.updateActivityData()
        }
        async setStatus(){
            uni.showToast({
                title: "尚未实现",
                icon: "none"
            });
            this.updateActivityData()
        }
        async openSetActivityInfoPage(){
            uni.showToast({
                title: "尚未实现",
                icon: "none"
            });
            this.updateActivityData()
        }
        async cancelActivityAdmin(){
            await ((this.$refs.SureToast as any).show("您确定要取消这个活动吗？一旦确认，活动将被彻底取消，无法恢复！"));
            await apiService.post(`/deleteActivity?activityId=${this.activityId}`, {});
            //TODO 跳转
            //this.updateActivityData()
        }
    }
</script>

<style scoped>

</style>