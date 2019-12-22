import {ActivityGlobalStatus} from "../../../apps/typesDeclare/ActivityEnum";
<template>
    <view>
        <view>
            <view class="cu-form-group margin-top-sm">
                <view class="title">活动名称</view>
                <text>{{activityData.name}}</text>
            </view>
            <view class="cu-form-group margin-top-sm">
                <view class="title">活动类型</view>
                <view>
                <text>{{activityData.type}}</text>
                <text class="text-orange cuIcon-roundcheck margin-left" style="font-size: 36upx;" v-if="isOfficial(activityData)" @click="showOfficialModal"></text>
                </view>
            </view>
            <view class="cu-form-group margin-top-sm">
                <view class="title">标签</view>
                <view>
                    <view v-for="tagObj in tagsList" v-if="tagObj.tag && tagObj.tag !== ''" :key="tagObj.tag" class="cu-tag" :class="'bg-' + tagObj.color">{{tagObj.tag}}</view>
                </view>
            </view>
            <view class="cu-form-group margin-top-sm">
                <view class="title">当前状态</view>
                <text>{{statusStr}}</text>
            </view>
            <view class="cu-form-group margin-top">
                <view class="title">公开活动</view>
                <checkbox class="round" :class="activityData.canBeSearched?'checked':''" :checked="activityData.canBeSearched" :disabled="true"></checkbox>
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
            <view class="cu-form-group margin-top arrow" @click="openParticipantsPage">
                <view class="title">人数</view>
                <view>
                    <view class="cu-avatar-group">
                        <view v-for="user in avatarShowList" :key="user.openId" class="cu-avatar round sm" :style="'background-image:url('+ (user.avatarUrl?fullUrl(user.avatarUrl):DEFAULT_AVATAR_URL) +');'"></view>
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
            <view class="cu-form-group margin-top arrow" @click="showDescription">
                <view class="title">活动详情</view>
                <text>点击查看</text>
            </view>
        </view>
        <view class="margin-top"></view>
        <view v-if="activityData.statusGlobal === ActivityGlobalStatus.Normal && (activityData.selfRole === UserRole.Common || activityData.selfRole === UserRole.None)" style="display: flex;justify-content: space-around;">
            <button v-if="activityData.statusJoin === ActivityJoinStatus.Before" class="cu-btn bg-green lg align-center" :disabled="true">报名尚未开始</button>
            <button v-if="activityData.statusJoin === ActivityJoinStatus.Continue && (activityData.selfStatus === UserStatus.None || activityData.selfStatus === UserStatus.Refused)" class="cu-btn bg-green lg align-center" @click="onPressAttend" :disabled="activityData.ruleForMe === 'reject'">{{signupButtonWords}}</button>
            <button v-if="activityData.statusJoin === ActivityJoinStatus.Paused && (activityData.selfStatus === UserStatus.None || activityData.selfStatus === UserStatus.Refused)" class="cu-btn bg-green lg align-center" :disabled="true">报名已暂停</button>
            <button v-if="(activityData.statusJoin === ActivityJoinStatus.Continue || activityData.statusJoin === ActivityJoinStatus.Paused) && activityData.selfStatus === UserStatus.WaitValidate" class="cu-btn bg-red lg align-center" @click="exitCurActivity">取消加入申请</button>
            <button v-if="(activityData.statusJoin === ActivityJoinStatus.Continue || activityData.statusJoin === ActivityJoinStatus.Paused) && (activityData.selfStatus === UserStatus.Joined || activityData.selfStatus === UserStatus.NotChecked)" class="cu-btn bg-red lg align-center" @click="exitCurActivity">取消报名</button>
            <button v-if="activityData.statusJoin === ActivityJoinStatus.Stopped && activityData.statusCheck === ActivityCheckStatus.Before" class="cu-btn lg align-center" :class="(activityData.selfStatus === UserStatus.None || activityData.selfStatus === UserStatus.Refused)?'bg-green':'bg-red'" :disabled="true">报名已截止</button>
        </view>
        <br v-if="activityData.statusGlobal === ActivityGlobalStatus.Normal && (activityData.selfRole === UserRole.Common || activityData.selfRole === UserRole.None)">
        <view v-if="activityData.selfRole === UserRole.Common || activityData.selfRole === UserRole.Manager" style="display: flex;justify-content: space-around;">
            <button v-if="activityData.statusCheck === ActivityCheckStatus.Continue && (activityData.selfStatus === UserStatus.Joined || activityData.selfStatus === UserStatus.NotChecked)" class="cu-btn bg-green lg align-center" @click="signinActivity">签到</button>
            <button v-if="activityData.selfStatus === UserStatus.Checked" class="cu-btn bg-green lg align-center" :disabled="true">您已签到</button>
            <button v-if="activityData.statusCheck === ActivityCheckStatus.Paused && (activityData.selfStatus === UserStatus.Joined || activityData.selfStatus === UserStatus.NotChecked)" class="cu-btn bg-green lg align-center" :disabled="true">签到已暂停</button>
            <button v-if="activityData.statusCheck === ActivityCheckStatus.Stopped && (activityData.selfStatus === UserStatus.Joined || activityData.selfStatus === UserStatus.NotChecked)" class="cu-btn bg-green lg align-center" :disabled="true">签到已停止</button>
        </view>
        <br v-if="activityData.selfRole === UserRole.Common || activityData.selfRole === UserRole.Manager">
        <view v-if="activityAdminable(activityData)" class="flex cu-list grid col-3">
            <view class="cu-item" v-if="activityData.statusGlobal === ActivityGlobalStatus.Normal && ((activityData.statusCheck === ActivityCheckStatus.Before && activityData.statusJoin !== ActivityJoinStatus.Before) || activityData.statusJoin === ActivityJoinStatus.Continue || activityData.needAuditCount)" @click="openAuditPage">
                <text class="text-gray cuIcon-peoplefill" style="text-align: center"></text>
                <br>
                <text style="color: #555555;">审核({{activityData.needAuditCount?activityData.needAuditCount:0}}人)</text>
            </view>
            <view class="cu-item" v-if="activityData.statusGlobal === ActivityGlobalStatus.Normal && activityData.statusJoin !== ActivityJoinStatus.Continue" @click="startSignup">
                <text class="text-gray cuIcon-playfill" style="text-align: center"></text>
                <br>
                <text style="color: #555555;">开放报名</text>
            </view>
            <view class="cu-item" v-if="activityData.statusGlobal === ActivityGlobalStatus.Normal && activityData.statusJoin === ActivityJoinStatus.Continue"  @click="endSignup">
                <text class="text-gray cuIcon-stop" style="text-align: center"></text>
                <br>
                <text style="color: #555555;">暂停报名</text>
            </view>
            <view class="cu-item" v-if="activityData.statusGlobal === ActivityGlobalStatus.Normal" @click="signinAdminModalShowing = true">
                <text class="text-gray cuIcon-qr_code" style="text-align: center"></text>
                <br>
                <text style="color: #555555;">签到管理</text>
            </view>
            <view class="cu-item" @click="openModifyPage">
                <text class="text-gray cuIcon-info" style="text-align: center"></text>
                <br>
                <text style="color: #555555;">修改活动信息</text>
            </view>
            <view class="cu-item" @click="jumpToSetDescription">
                <text class="text-gray cuIcon-post" style="text-align: center"></text>
                <br>
                <text style="color: #555555;">设置活动详情</text>
            </view>
            <view class="cu-item" v-if="activityCancelable(activityData)" @click="">
                <text class="text-gray cuIcon-deletefill" style="text-align: center"></text>
                <br>
                <text style="color: #555555;">取消活动</text>
            </view>
<!--            <view class="cu-item" v-if="columnOfButtons==2">-->
<!--            </view>-->
<!--            <view class="cu-item" v-if="columnOfButtons==1">-->
<!--            </view>-->
        </view>
<!--        <br v-if="activityAdminable(activityData)">-->
<!--        <view v-if="activityCancelable(activityData)" style="display: flex;justify-content: space-around;">-->
<!--            <button class="cu-btn bg-red lg align-center" @click="cancelActivityAdmin">取消活动</button>-->
<!--        </view>-->
<!--        <br v-if="activityCancelable(activityData)">-->
        <SureModal ref="SureModal"></SureModal>
        <view class="cu-modal" style="z-index: 990" :class="auditModalShowing?'show':''">
            <view class="cu-dialog">
                <view class="cu-bar bg-white justify-center">
                    <text class="text-xl text-bold">您的报名需要审核</text>
                </view>
                <view class="cu-form-group align-start">
                    <view class="title">申请留言</view>
                    <textarea v-if="auditModalShowing" style="width: 90%;height: 100px;" v-model="auditReason" placeholder="选填，不超过300字"></textarea>
                </view>
                <view class="flex justify-around">
                <button class="cu-btn bg-green" @click="attendCurActivity">确定</button>
                <button class="cu-btn bg-red" @click="onPressCancelAudit">取消</button>
                </view>
            </view>
        </view>
        <view class="cu-modal" style="z-index: 990" :class="reportModalShowing?'show':''">
            <view class="cu-dialog">
                <view class="cu-bar bg-white justify-center">
                    <text class="text-xl text-bold">您将要举报这个活动</text>
                </view>
                <view class="cu-form-group margin-top">
                    <view class="title">举报类型</view>
                    <picker z-index="1200" @change="reportPickerValue = Number($event.detail.value)" :value="reportPickerValue" :range="reportPickerRange">
                        <view class="picker">
                            {{reportPickerValue>-1?reportPickerRange[reportPickerValue]:'请选择'}}
                        </view>
                    </picker>
                </view>
                <view class="cu-form-group align-start">
                    <view class="title">详细说明</view>
                    <textarea v-if="reportModalShowing" style="width: 90%;height: 100px;" v-model="reportReason" placeholder="可选，不超过300字"></textarea>
                </view>
                <view class="flex justify-around">
                <button class="cu-btn bg-green" @click="onPressSubmitReport">确定</button>
                <button class="cu-btn bg-red" @click="onPressCancelReport">取消</button>
                </view>
            </view>
        </view>
        <view class="cu-modal" style="z-index: 990" :class="signinAdminModalShowing?'show':''">
            <view class="cu-dialog">
                <view class="cu-bar bg-white justify-end">
                    <text class="content text-xl text-bold">签到管理</text>
                    <view class="action" @click="signinAdminModalShowing = false">
                        <text class="cuIcon-close"></text>
                    </view>
                </view>
                <view v-if="activityAdminable(activityData)" class="flex cu-list grid col-3">
                    <view class="cu-item" @click="openSigninAdminHelp">
                        <text class="text-gray cuIcon-question" style="text-align: center"></text>
                        <br>
                        <text style="color: #555555;">帮助</text>
                    </view>
                    <view class="cu-item" v-if="activityData.statusGlobal === ActivityGlobalStatus.Normal && activityData.statusCheck !== ActivityCheckStatus.Continue && activityData.statusJoin !== ActivityJoinStatus.Before" @click="startSignin">
                        <text class="text-gray cuIcon-playfill" style="text-align: center"></text>
                        <br>
                        <text style="color: #555555;">开放签到</text>
                    </view>
                    <view class="cu-item" v-if="activityData.statusGlobal === ActivityGlobalStatus.Normal && activityData.statusCheck === ActivityCheckStatus.Continue" @click="endSignin">
                        <text class="text-gray cuIcon-stop" style="text-align: center"></text>
                        <br>
                        <text style="color: #555555;">暂停签到</text>
                    </view>
                    <view class="cu-item" v-if="activityData.statusGlobal === ActivityGlobalStatus.Normal" @click="jumpToQRCodePage">
                        <text class="text-gray cuIcon-qr_code" style="text-align: center"></text>
                        <br>
                        <text style="color: #555555;">查看二维码</text>
                    </view>
                    <view class="cu-item" v-if="activityData.statusGlobal === ActivityGlobalStatus.Normal && activityData.selfRole === UserRole.Creator" @click="openPositionChoose">
                        <text class="text-gray cuIcon-locationfill" style="text-align: center"></text>
                        <br>
                        <text style="color: #555555;">{{activityData.position && activityData.position !== ''?'修改位置':'设置位置'}}</text>
                    </view>
                    <view class="cu-item" v-if="activityData.statusGlobal === ActivityGlobalStatus.Normal && activityData.selfRole === UserRole.Creator && activityData.position && activityData.position !== ''" @click="deletePosition">
                        <text class="text-gray cuIcon-deletefill" style="text-align: center"></text>
                        <br>
                        <text style="color: #555555;">删除位置</text>
                    </view>
                </view>
            </view>
        </view>
        <br>
        <view style="text-align: center" class="margin-top">
            <text style="padding-left: 30px;color: #0081ff" @click="onPressReport">举报</text>
            <text style="padding: 20px; left: 20px">|</text>
            <text style="color: #0081ff" @click="jumpToRecommend">推荐更多活动</text>
            <text style="padding: 20px; left: 20px">|</text>
            <text style="color: #0081ff" @click="jumpToAbout">关于我们</text>
        </view>
    </view>

</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Watch} from 'vue-property-decorator'
    import {ActivitySchema} from "@/apps/typesDeclare/ActivitySchema";
    import {isDateTimePast, withoutSec} from "@/apps/utils/DateStringFormat";
    import {UserRole, UserStatus, UserStatusShowStrings} from "@/apps/typesDeclare/UserEnum";
    import apiService from '../../../commons/api'
    import SureModal from "@/components/SureModal.vue";
    import {SET_ACTIVITY_DETAIL_ID, SYNC_CHANGE_ACTIVITY_DATA} from "@/store/mutation";
    import {
        FETCH_ACTIVITY_DETAIL,
        FETCH_DESCRIPTION,
        SUBMIT_ACTIVITY_POSITION_CHANGE,
        SUBMIT_ACTIVITY_STATUS_CHANGE
    } from "@/store/action";
    import {ActivityCheckStatus, ActivityGlobalStatus, ActivityJoinStatus} from "@/apps/typesDeclare/ActivityEnum";
    import initialGlobalData from "@/apps/typesDeclare/InitialGlobalData";
    import {fullUrl, handleNetExcept} from "@/apps/utils/networkUtils";
    import {isOfficial} from "@/apps/utils/ActivitySchemaUtils";
    interface EarthDistanceLibPosi{
        lat: number,
        lon: number
    }
    var haversine: ((a: EarthDistanceLibPosi, b: EarthDistanceLibPosi)=>number) = require("earth-distance-js").haversine;

    @Component({
        components: {SureModal}
    })
    export default class activityDetail extends Vue{
        name!: "activityDetail";
        console = console;
        fullUrl = fullUrl;
        isOfficial = isOfficial;
        get DEFAULT_ACTIVITY_URL(){
            return initialGlobalData.devData.DEFAULT_ACTIVITY_URL;
        }
        get DEFAULT_AVATAR_URL(){
            return initialGlobalData.devData.DEFAULT_AVATAR_URL;
        }
        showOfficialModal(){
            uni.showModal({
                showCancel: false,
                title: "认证活动标志",
                content: "该活动已经清华大学校友总会审核认证。"
            })
        }
        activityId: string;
        get activityData(): ActivitySchema{
            return this.$store.state.activityDetail.activity;
        }
        signinAdminModalShowing: boolean = false;
        async openPositionChoose(){
            let choosePosi: ChooseLocationSuccess;
            try {
                choosePosi = await new Promise<ChooseLocationSuccess>((resolve, reject) => {
                    uni.chooseLocation({
                        success(res){
                            resolve(res)
                        },
                        fail(){
                            reject()
                        }
                    })
                });
            }catch (e) {
                uni.showToast({title: "获取位置失败，可能是您没有给予授权，或者关闭了窗口界面。", icon: "none"});
                throw e;
            }
            this.$store.dispatch(SUBMIT_ACTIVITY_POSITION_CHANGE, {activityId: this.activityId, posiStr: `${choosePosi.latitude} ${choosePosi.longitude}`});
            uni.showToast({title: "设置位置成功"});
            this.updateActivityData();
        }
        deletePosition(){
            this.$store.dispatch(SUBMIT_ACTIVITY_POSITION_CHANGE, {activityId: this.activityId, posiStr: ""});
            uni.showToast({title: "删除位置成功"});
            this.updateActivityData();
        }
        openSigninAdminHelp(){
            this.signinActivity();
            // uni.showModal({
            //     title: "签到功能帮助",
            //     showCancel: false,
            //     content: "支持二维码签到和位置签到两种模式。" +
            //         "位置签到需要您设置基准位置，则其他参加者点击签到按钮时可自动定位无需您额外操作；" +
            //         "二维码签到则需要扫描签到二维码图片，您可稍后查看二维码界面中长按将其保存下来，提前打印粘贴在会场等。" +
            //         "如果您设置了位置，则会优先位置签到，若位置签到失败则会允许二维码签到；" +
            //         "如果您没有设置位置或删除了设置的位置，则会直接进行二维码签到。"
            // })
        }
        AVATAR_GROUP_MAX = 4;
        get avatarShowList(){
            if(this.activityData && this.activityData.participants){
                let n = this.activityData.participants.length > this.AVATAR_GROUP_MAX?this.AVATAR_GROUP_MAX:this.activityData.participants.length;
                let res = [];
                for(let i=0;i<n;i++) {
                    res.push(this.activityData.participants[i])
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
        ANS=0;
        get columnOfButtons() {
            return 3;
        }
        async updateActivityData(){
            this.$store.dispatch(FETCH_ACTIVITY_DETAIL);
        }
        onLoad(param: any){
            this.activityId = param.activityId;
        }
        onShow(){
            this.$store.commit(SET_ACTIVITY_DETAIL_ID, this.activityId);
            this.updateActivityData();
        }
        get startDate(){
            return this.activityData.start.split(" ")[0];
        }
        get startTime(){
            return this.activityData.start.split(" ")[1]?this.activityData.start.split(" ")[1].substr(0, 5):undefined
        }
        get endDate(){
            return this.activityData.end.split(" ")[0];
        }
        get endTime(){
            return this.activityData.end.split(" ")[1]?this.activityData.end.split(" ")[1].substr(0, 5):undefined
        }
        get userNeedString(){
            let r2 = "";
            if(this.activityData.minUser && this.activityData.maxUser === -1){
                r2 = `最少${this.activityData.minUser}人`
            }else if(!this.activityData.minUser && this.activityData.maxUser !== -1){
                r2 = `最多${this.activityData.maxUser}人`
            }else if(this.activityData.minUser && this.activityData.maxUser !== -1){
                r2 = `需要${this.activityData.minUser}~${this.activityData.maxUser}人`
            }
            return r2;
        }
        withoutSec = withoutSec;
        get statusStr(){
            let data = this.activityData;
            if(data.statusGlobal === ActivityGlobalStatus.Except)return "活动被取消";
            else if(data.statusGlobal === ActivityGlobalStatus.Finish)return "活动已结束";
            else if(data.statusGlobal === ActivityGlobalStatus.Audit)return "活动待审核";
            else{
                let statusAllStrs = [
                    ["报名尚未开始", "", "", ""],
                    ["报名中", "签到中（仍可报名）", "报名中", "报名中"],
                    ["报名已暂停", "签到中", "签到暂停", "签到结束"],
                    ["报名已截止", "签到中", "签到暂停", "签到结束"],
                    //01、02、03都是不可能出现的状态（报名开始前不会开放签到）
                ];
                return statusAllStrs[data.statusJoin][data.statusCheck];
            }
        }
        UserStatusShowStrings = UserStatusShowStrings;
        UserRole = UserRole;
        UserStatus = UserStatus;
        ActivityGlobalStatus = ActivityGlobalStatus;
        ActivityJoinStatus = ActivityJoinStatus;
        ActivityCheckStatus = ActivityCheckStatus;
        activityCancelable(d: ActivitySchema){
            return (d.statusGlobal === ActivityGlobalStatus.Normal || d.statusGlobal === ActivityGlobalStatus.Audit) && d.statusCheck === ActivityCheckStatus.Before && d.selfRole === UserRole.Creator
        }
        activityAdminable(d: ActivitySchema) {
            return (d.statusGlobal === ActivityGlobalStatus.Normal || d.statusGlobal === ActivityGlobalStatus.Audit) && (d.selfRole === UserRole.Creator || d.selfRole === UserRole.Manager);
        }
        auditModalShowing: boolean = false;
        auditReason: string = "";
        reportPickerValue: number = -1;
        reportPickerRange: Array<string> = ["含有违法内容", "含有低俗内容", "冒用身份名义", "重复建立活动", "含有广告营销", "其他"];
        reportModalShowing: boolean = false;
        reportReason: string = "";
        async onPressSubmitReport(){
            if(this.reportPickerValue === -1){
                uni.showToast({
                    title: "必须选择一个举报类型！",
                    icon: "none"
                })
            }else {
                await ((this.$refs.SureModal as any).show("您确定要举报这个活动吗？"));
                try {
                    await apiService.post(`/reportActivity?activityId=${this.activityId}`, {reason: this.reportPickerRange[this.reportPickerValue] + ": " + this.reportReason})
                    uni.showToast({
                        title: "举报成功"
                    });
                    this.reportModalShowing = false;
                }catch (e) {
                    handleNetExcept(e)
                }
            }
        }
        onPressCancelReport(){
            this.reportModalShowing = false;
        }
        TAG_COLORS = ["red", "orange", "yellow", "olive", "green", "cyan", "blue", "purple", "mauve", "pink", "brown"];
        get tagsList(){
            return this.activityData.tags.map((v)=>{
                let color = this.TAG_COLORS[Math.floor(Math.random() * this.TAG_COLORS.length)];
                return {
                    color,
                    tag: v
                }
            })
        }
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
        jumpToRecommend(){
            uni.navigateTo({
                url: `/pages/activityList/recommend/recommend?activityId=${this.activityId}`
            })
        }
        jumpToAbout(){
            uni.navigateTo({
                url: "/pages/me/About"
            })
        }
        async attendCurActivity(){
            this.auditModalShowing = false;
            if (this.activityData.ruleForMe === 'accept') {
                await ((this.$refs.SureModal as any).show("您报名后无需审核，可以直接加入本活动。\r\n确认要报名参加本活动吗？"));
            }
            uni.showLoading({title: "加载中", mask: true});
            let res = null;
            try {
                if (this.activityData.ruleForMe === 'accept') {
                    res = await apiService.post(`/joinActivity?activityId=${this.activityId}`, {});
                } else if (this.activityData.ruleForMe === 'needAudit') {
                    res = await apiService.post(`/joinActivity?activityId=${this.activityId}`, {reason: (this.auditReason && this.auditReason !== "")?this.auditReason:" "});
                }
                if(res && res.result === 'success'){
                    await new Promise((resolve,reject)=> {
                        wx.requestSubscribeMessage({
                            tmplIds: this.activityData.ruleForMe === 'accept' ? initialGlobalData.subscribeMessagesIds.normal : initialGlobalData.subscribeMessagesIds.audit,
                            success(res: any): void {
                                resolve(res);
                            },
                            fail(res: any): void {
                                reject(res)
                            }
                        })
                    });
                }
            }catch (e) {
                handleNetExcept(e, true)
            }finally {
                uni.hideLoading();
            }
            uni.showToast({
                title: this.activityData.ruleForMe === 'accept'?"报名成功":"提交审核成功",
            });
            this.updateActivityData()
        }
        async exitCurActivity(){
            await ((this.$refs.SureModal as any).show("您确认要取消报名吗？"));
            uni.showLoading({title: "加载中", mask: true});
            let res;
            try {
                res = await apiService.post(`/cancelJoinActivity?activityId=${this.activityId}`, {});
            }catch (e) {
                handleNetExcept(e, true);
            }finally {
                uni.hideLoading();
            }
            if (res && res.result === 'success') {
                uni.showToast({
                    title: this.activityData.selfStatus === UserStatus.WaitValidate ? "取消加入申请成功" : "取消报名成功",
                });
            }
            this.updateActivityData()
        }
        async signinActivity() {
            let MAX_POSITION_REPEAT = 3;
            let posiAvailable = this.activityData.position && this.activityData.position !== "";
            let qrConfirm = false;
            if(posiAvailable) {
                let isPosiSuccess = false;
                let exampleException;
                uni.showLoading({title: "加载中", mask: true});
                let basicObj = {
                    lat: Number(this.activityData.position.split(" ")[0]),
                    lon: Number(this.activityData.position.split(" ")[1])
                };
                for(let i=0;i<MAX_POSITION_REPEAT;i++) {
                    try {
                        await this.signinByPosition(basicObj);
                        isPosiSuccess = true;
                        break;
                    }catch (e) {
                        exampleException = e;
                    }
                }
                uni.hideLoading();
                if(isPosiSuccess){
                    uni.showToast({title: "签到成功"});
                    this.updateActivityData();
                }
                else{
                    try {
                        await new Promise((resolve, reject) => {
                            uni.showModal({
                                title: "提示",
                                content: exampleException.errmsg + "。是否要进行二维码签到？",
                                success(res) {
                                    if (res.confirm) resolve();
                                    else reject();
                                },
                                fail() {
                                    reject();
                                }
                            })
                        });
                        qrConfirm = true;
                    }catch (e) {
                        throw exampleException;
                    }
                }
            }
            if(!posiAvailable || qrConfirm){
                uni.showLoading({title: "加载中", mask: true});
                try{
                    await this.signinByQR();
                }catch (e) {
                    handleNetExcept(e, true);
                }finally {
                    uni.hideLoading();
                }
                uni.showToast({title: "签到成功"});
            }
        }
        async signinByPosition(basicPosi: EarthDistanceLibPosi){
            let myPosi: GetLocationSuccess;
            try{
                myPosi = await new Promise<GetLocationSuccess>((resolve, reject) => {
                    uni.getLocation({
                        type: "gcj02",
                        success(res) {
                            resolve(res);
                        },
                        fail() {
                            reject();
                        }
                    })
                });
            }catch (e) {
                throw {errid: 590, errmsg: "获取位置失败，可能是您没有给予授权，或者当前定位信号环境太差。"};
            }
            let myPosiEarth: EarthDistanceLibPosi = {lat: myPosi.latitude, lon: myPosi.longitude};
            let distanceInKm = haversine(myPosiEarth, basicPosi);
            let disanceInM = Math.round(distanceInKm * 1000);
            await apiService.post(`/checkInActivity?distance=${disanceInM}&activityId=${this.activityId}`);
        }
        async signinByQR(){
            let code = await new Promise((resolve, reject)=>{
                uni.scanCode({
                    success(r){
                        resolve(r.result);
                    },
                    fail(){
                        reject();
                    }
                });
            });
            await apiService.post(`/checkInActivity?code=${code}&activityId=${this.activityId}`);
        }
        async openAuditPage(){
            uni.navigateTo({
                url: '/pages/activityList/participants/participants?enableAudit=1'
            })
        }
        async startSignin(){
            await ((this.$refs.SureModal as any).show("请注意，一旦开放签到（无论是由于您手动操作还是由于到达活动开始时间且人数足够的情况下系统自动为您开放签到），活动便不可再被取消。\r\n您确认要开放签到吗？"));
            uni.showLoading({title: "加载中", mask: true});
            try {
                await this.$store.dispatch(SUBMIT_ACTIVITY_STATUS_CHANGE, {
                    activityId: this.activityId,
                    newStatus: {statusCheck: ActivityCheckStatus.Continue}
                });
            }finally {
                uni.hideLoading();
            }
            uni.showToast({
                title: "成功"
            });
            this.updateActivityData()
        }
        async endSignin(){
            await ((this.$refs.SureModal as any).show("您确认要暂停签到吗？（之后仍可恢复开放签到）"));
            let newStatusCheck = isDateTimePast(this.activityData.end)?ActivityCheckStatus.Stopped:ActivityCheckStatus.Paused;
            uni.showLoading({title: "加载中", mask: true});
            try {
                await this.$store.dispatch(SUBMIT_ACTIVITY_STATUS_CHANGE, {
                    activityId: this.activityId,
                    newStatus: {statusCheck: newStatusCheck}
                });
            }finally {
                uni.hideLoading();
            }
            uni.showToast({
                title: "成功",
            });
            this.updateActivityData()
        }
        async startSignup(){
            await ((this.$refs.SureModal as any).show("您确认要开放报名吗？"));
            uni.showLoading({title: "加载中", mask: true});
            try {
                await this.$store.dispatch(SUBMIT_ACTIVITY_STATUS_CHANGE, {
                    activityId: this.activityId,
                    newStatus: {statusJoin: ActivityJoinStatus.Continue}
                });
            }finally {
                uni.hideLoading();
            }
            uni.showToast({
                title: "成功",
            });
            this.updateActivityData()
        }
        async endSignup(){
            await ((this.$refs.SureModal as any).show("您确认要暂停报名吗？（之后仍可恢复开放报名）"));
            let newStatusJoin = isDateTimePast(this.activityData.signupStopAt)?ActivityJoinStatus.Stopped:ActivityJoinStatus.Paused;
            uni.showLoading({title: "加载中", mask: true});
            try {
                await this.$store.dispatch(SUBMIT_ACTIVITY_STATUS_CHANGE, {
                    activityId: this.activityId,
                    newStatus: {statusJoin: newStatusJoin}
                });
            }finally {
                uni.hideLoading();
            }
            uni.showToast({
                title: "成功",
            });
            this.updateActivityData()
        }
        async openModifyPage(){
            this.$store.commit(SYNC_CHANGE_ACTIVITY_DATA);
            uni.navigateTo({
                url: `/pages/activityList/modifyActivity/modifyActivity?activityId=${this.activityId}`
            });
        }
        async cancelActivityAdmin(){
            await ((this.$refs.SureModal as any).show("您确定要取消这个活动吗？\r\n一旦确认，活动将被彻底取消，无法恢复！\r\n"));
            uni.showLoading({title: "加载中", mask: true});
            try {
                await apiService.post(`/deleteActivity?activityId=${this.activityId}`, {});
            }catch (e) {
                handleNetExcept(e, true);
            }finally {
                uni.hideLoading();
            }
            uni.showToast({
                title: "活动已被取消",
            });
            this.updateActivityData()
        }
        async onPressReport(){
            this.reportModalShowing = true;
        }
        onShareAppMessage(){
            return{
                title: this.activityData.name,
                path: `/pages/activityList/activityDetail/activityDetail?activityId=${this.activityId}`,
                imageUrl: fullUrl(this.activityData.imageUrl)
            }
        }
        jumpToQRCodePage(){
            let url = apiService.baseUrl + "/generateCheckinCode"  + `?session=${apiService.session}&activityId=${this.$store.state.activityDetail.id}`;
            uni.previewImage({
               urls: [url],
               current: url
            });
        }
        @Watch("activityData")onDataChange(nval){
            if(this.activityData.statusGlobal === ActivityGlobalStatus.Audit)uni.hideShareMenu();
        }
        async showDescription(){
            await this.$store.dispatch(FETCH_DESCRIPTION);
            if(this.activityData.description && this.activityData.description !== ""){
                uni.navigateTo({
                    url: "/pages/activityList/descriptionShow/descriptionShow"
                })
            }else{
                uni.showToast({
                    title: "主办者没有设置活动详情！",
                    icon: "none"
                })
            }
        }
        async jumpToSetDescription(){
            await this.$store.dispatch(FETCH_DESCRIPTION);
            uni.navigateTo({
                url: "/pages/activityList/descriptionModify/descriptionModify"
            })
        }
        openParticipantsPage(){
            uni.navigateTo({
                url: '/pages/activityList/participants/participants?enableAudit=0'
            })
        }
    }
</script>

<style scoped>
    .cu-form-group .title{
        min-width: calc(4em + 30upx);
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
