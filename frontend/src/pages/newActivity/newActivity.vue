<template>
    <view>
    <form @submit="submitNewActivity">
        <view class="cu-form-group margin-top-sm">
            <view class="title">活动名称</view>
            <input name="name" :value="inputValue"  />
        </view>
        <view class="cu-form-group margin-top-sm">
            <view class="title">活动类型</view>
            <picker mode="multiSelector" @change="typeMultiChange" @columnchange="typeMultiColumnChange" :value="typeMultiIndex" :range="typeMultiArray" name="type">
                <view class="picker">
                    {{typeMultiShowText}}
                </view>
            </picker>
            <text class="cuIcon-question margin-left" @click.stop="showTypeHelp"></text>
        </view>
        <view class="cu-form-group margin-top-sm">
            <view class="title">标签</view>
            <input name="tag" placeholder="多个标签之间以逗号或空格分隔" :value="inputValue" />
        </view>
        <view class="cu-form-group margin-top-sm arrow" @click="chooseImage">
            <view class="title">活动头像</view>
            <view v-if="imageUrl && imageUrl !== ''" class="cu-avatar radius" :style="'background-image: url(' + fullUrl(imageUrl) + ')'"></view>
            <text v-else>点击上传</text>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">公开活动</view>
            <text>开启则可被公开检索到</text>
            <switch @change="switchCanBeSearched = $event.detail.value" :class="switchCanBeSearched?'checked':''" :checked="switchCanBeSearched">
            </switch>
        </view>
        <view class="cu-form-group margin-top-sm">
            <view class="title">地点</view>
            <input name="place" :value="inputValue" />
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">开始时间</view>
            <picker mode="date" :value="startDate" :start="today" :end="maxDate" @change="startDate = $event.detail.value" name="startDate">
                <view class="picker">
                    {{startDate}}
                </view>
            </picker>
            <picker mode="time" :value="startTime" :start="minStartTime" end="23:59" @change="startTime = $event.detail.value" name="startTime">
                <view class="picker">
                    {{startTime}}
                </view>
            </picker>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">结束时间</view>
            <picker mode="date" :value="endDate" :start="startDate" :end="maxDate" @change="endDate = $event.detail.value" name="endDate">
                <view class="picker">
                    {{endDate}}
                </view>
            </picker>
            <picker mode="time" :value="endTime" :start="minEndTime" end="23:59" @change="endTime = $event.detail.value" name="endTime">
                <view class="picker">
                    {{endTime}}
                </view>
            </picker>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">报名开始</view>
            <text v-if="!switchSignupBegin">发布活动后立即可报名</text>
            <picker v-if="switchSignupBegin" mode="date" :value="signupBeginAtDate" :start="today" :end="startDate" @change="signupBeginAtDate = $event.detail.value" name="signupBeginAtDate">
                <view class="picker">
                    {{Datenum(signupBeginAtDate)}}
                </view>
            </picker>
            <picker v-if="switchSignupBegin" mode="time" :value="signupBeginAtTime" start="00:00" end="23:59" @change="signupBeginAtTime = $event.detail.value" name="signupBeginAtTime" style="left: -20px">
                <view class="picker">
                    {{getTime(signupBeginAtTime)}}
                </view>
            </picker>
            <switch @change="switchSignupBegin = $event.detail.value" class="signupBegin ansg" :class="switchSignupBegin?'checked':''" :checked="switchSignupBegin">
            </switch>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">报名截止</view>
            <text v-if="!switchSignupStop">直到活动开始时间</text>
            <picker v-if="switchSignupStop" mode="date" :value="signupStopAtDate" :start="today" :end="startDate" @change="signupStopAtDate = $event.detail.value" name="signupStopAtDate">
                <view class="picker">
                    {{Datenum(signupStopAtDate)}}
                </view>
            </picker>
            <picker v-if="switchSignupStop" mode="time" :value="signupStopAtTime" start="00:00" end="23:59" @change="signupStopAtTime = $event.detail.value" name="signupStopAtTime" style="left: -20px">
                <view class="picker">
                    {{getTime(signupStopAtTime)}}
                </view>
            </picker>
            <switch @change="switchSignupStop = $event.detail.value" class="signupEnd ansg" :class="switchSignupStop?'checked':''" :checked="switchSignupStop">
            </switch>
        </view>
        <view class="cu-form-group margin-top arrow" @click="openAdvancedRulePage">
            <view class="title">报名规则</view>
            <view>{{advancedRuleDescription}}</view>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">人数</view>
            <input name="minUser" style="text-align: right" :value="inputValue" />
            <text style="font-size: 30upx" class="margin-lr-lg">~</text>
            <input name="maxUser" :value="inputValue" />
        </view>
        <br>
        <view style="display: flex;justify-content: center" class="margin-top margin-bottom-xl">
            <button form-type="submit" class="cu-btn bg-green">提交</button>
        </view>
    </form>
        <SureModal ref="SureModal"></SureModal>
    </view>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component} from 'vue-property-decorator'
    import dateFormat from 'dateformat'
    import delay from 'delay';
    import {SET_ADVANCE_RULE, SET_ADVANCE_RULE_SAVED, SET_NEW_ACTIVITY, SYNC_RULE_NEW_ACTIVITY} from "@/store/mutation";
    import {FETCH_ACTIVITY_TYPE_LIST, SUBMIT_NEW_ACTIVITY} from "@/store/action";
    import {withSec} from "@/apps/utils/DateStringFormat";
    import SureModal from "@/components/SureModal.vue";
    import {generateRuleDescription} from "@/apps/utils/ActivitySchemaUtils";
    import {SignupRule} from "@/apps/typesDeclare/SignupRule";
    import {RuleType} from "@/apps/typesDeclare/ActivityEnum";
    import apiService from "../../commons/api"
    import {fullUrl} from "@/apps/utils/networkUtils";
    import initialGlobalData from "@/apps/typesDeclare/InitialGlobalData";

    @Component({
        components: {SureModal}
    })
    export default class newActivity extends Vue{
        name: "newActivity";
        DEFAULT_TIMEPICKER_VALUE = "请选择";
        fullUrl = fullUrl;
        inputValue: string = "";
        console = console;
        imageUrl: string = "";
        showTypeHelp(){
            uni.showModal({
                showCancel: false,
                title: "活动类型说明",
                content: "活动类型分为个人活动、班级活动、官方活动三类。" +
                    "个人活动、班级活动不需要前置审核，发起后即可被检索和报名。" +
                    "官方活动需要清华大学校友总会的前置审核，审核通过后活动方可被检索和报名。" +
                    "如需催促校友总会的审核进度，请邮件联系example@tsinghua.org.cn。"
            })
        }
        initialForm(){
            this.inputValue = " ";
            setTimeout(()=>{this.inputValue = "";},100);
            this.imageUrl = "";
            this.startDate = this.DEFAULT_TIMEPICKER_VALUE;
            this.startTime = this.DEFAULT_TIMEPICKER_VALUE;
            this.endDate = this.DEFAULT_TIMEPICKER_VALUE;
            this.endDate = this.DEFAULT_TIMEPICKER_VALUE;
            this.signupBeginAtDate = this.DEFAULT_TIMEPICKER_VALUE;
            this.signupBeginAtTime = this.DEFAULT_TIMEPICKER_VALUE;
            this.signupStopAtDate = this.DEFAULT_TIMEPICKER_VALUE;
            this.signupStopAtTime = this.DEFAULT_TIMEPICKER_VALUE;
            this.switchSignupBegin = false;
            this.switchSignupStop = false;
            this.switchCanBeSearched = true;
            for(let i = 0; i < this.typeMultiIndex.length;i++){
                this.typeMultiIndex[i] = 0;
            }
            let defaultRule: SignupRule = {ruleType: RuleType.ACCEPT};
            this.$store.commit(SYNC_RULE_NEW_ACTIVITY, defaultRule);
        }
        async chooseImage(){
            uni.showLoading({title: "加载中", mask: true});
            try {
                let path: string = await new Promise((resolve, reject) => {
                    uni.chooseImage({
                        count: 1,
                        sizeType: ["compressed"],
                        sourceType: ["album"],
                        success(res) {
                            resolve(res.tempFiles[0].path);
                        },
                        fail(){
                            reject();
                        }
                    })
                });
                let absUrl = await new Promise<string>((resolve, reject) => {
                    uni.uploadFile({
                        url: apiService.baseUrl + `/uploadImage?session=${apiService.session}`,
                        name: "file",
                        filePath: path,
                        fileType: "image",
                        success(res) {
                            let obj: any = (typeof res.data === "string") ? JSON.parse(res.data) : res.data;
                            if (obj.url) resolve(fullUrl(obj.url));
                            else reject(obj);
                        },
                        fail(e) {
                            reject(e);
                        }
                    })
                });
                this.imageUrl = absUrl;
            }finally {
                uni.hideLoading()
            }
        }
        mounted(){
            this.initialForm();
        }
        get today(): string{
            return dateFormat(new Date(), "yyyy-mm-dd")
        }
        maxDate = "2020-12-31";
        startDate: string = this.DEFAULT_TIMEPICKER_VALUE;
        startTime: string = this.DEFAULT_TIMEPICKER_VALUE;
        endDate: string = this.DEFAULT_TIMEPICKER_VALUE;
        endTime: string = this.DEFAULT_TIMEPICKER_VALUE;
        switchSignupBegin: boolean = false;
        switchSignupStop: boolean = false;
        signupBeginAtDate: string = this.DEFAULT_TIMEPICKER_VALUE;
        signupBeginAtTime: string = this.DEFAULT_TIMEPICKER_VALUE;
        signupStopAtDate: string = this.DEFAULT_TIMEPICKER_VALUE;
        signupStopAtTime: string = this.DEFAULT_TIMEPICKER_VALUE;
        typeMultiIndex: Array<number> = [];
        switchCanBeSearched: boolean = true;
        get typeMultiData(){
            let temp = this.$store.state.activityTypeList;
            if(!temp.initialized)this.$store.dispatch(FETCH_ACTIVITY_TYPE_LIST);
            if(this.typeMultiIndex.length < temp.level){
                this.typeMultiIndex = this.typeMultiIndex.concat([0, 0, 0, 0, 0]).slice(0, temp.level);
            }
            return temp;
        }
        get typeMultiArray(){
            let data = this.typeMultiData;
            let res = [];
            let curNode = data.types;
            res.push(curNode.map((v)=>v.name));
            for(let i=0;i<this.typeMultiIndex.length-1;i++){
                curNode = curNode[this.typeMultiIndex[i]].children;
                if(!curNode || curNode.length <= 0)break;
                res.push(curNode.map((v)=>v.name));
            }
            return res;
        }
        typeMultiChange(e){
            this.typeMultiIndex = e.detail.value;
        }
        typeMultiColumnChange(e){
            let column = e.detail.column;
            if(this.typeMultiIndex[column] === e.detail.value)return;
            let newIndex = [];
            for(let i=0;i<this.typeMultiIndex.length;i++){
                if(i < column)newIndex.push(this.typeMultiIndex[i]);
                else if(i === column)newIndex.push(e.detail.value);
                else newIndex.push(0);
            }
            this.typeMultiIndex = newIndex;
        }
        get typeMultiShowText(){
            return this.typeMultiArray.map((nameList, i)=>{
                return nameList[this.typeMultiIndex[i]];
            }).join("-");
        }
        get minStartTime(): string{
            if(this.startDate <= this.today){
                return dateFormat(new Date(), "HH:MM")
            }
            else return "00:00"
        }
        get minEndTime(): string{
            if(this.endDate <= this.startDate){
                return this.startTime
            }
            else return "00:00"
        }
        Datenum(str):string {
            let r="";
            let a=str.split('-');
            if(a.length<3)return str;
            r=a[0]+'-'+a[1]+'-'+a[2];
            return r;
        }
        getTime(str):string {
            if(str.length==0)return "请选择";
            else return str;
        }
        async submitNewActivity(e){
            let formData = e.detail.value;
            let data = {
                name: formData.name,
                place: formData.place,
                start: withSec(this.startDate + " " + this.startTime),
                end: withSec(this.endDate + " " + this.endTime),
                tags: formData.tag !== ""?formData.tag.split(/[, ]/):[],
                signupBeginAt: this.switchSignupBegin?withSec(this.signupBeginAtDate + " " + this.signupBeginAtTime):undefined,
                signupStopAt: this.switchSignupBegin?withSec(this.signupStopAtDate + " " + this.signupStopAtTime):undefined,
                type: this.typeMultiShowText,
                maxUser: formData.maxUser?Number.parseInt(formData.maxUser):undefined,
                minUser: formData.minUser?Number.parseInt(formData.minUser):undefined,
                canBeSearched: this.switchCanBeSearched,
                imageUrl: (this.imageUrl && this.imageUrl !== "")?this.imageUrl:undefined
            };
            let sureText = data.type.substr(0,4) === "官方活动"?"您将要发起的是官方活动，该活动需要清华大学校友总会前置审核后才能被检索到和报名加入。您确定要发起这个活动吗？":"您确定要发起这个活动吗？";
            await ((this.$refs.SureModal as any).show(sureText));
            uni.showLoading({title: "加载中", mask: true});
            let resObj;
            try {
                this.$store.commit(SET_NEW_ACTIVITY, data);
                resObj = await this.$store.dispatch(SUBMIT_NEW_ACTIVITY);
                await new Promise((resolve, reject) => {
                    wx.requestSubscribeMessage({
                        tmplIds: resObj.result === "success" ? initialGlobalData.subscribeMessagesIds.normal : initialGlobalData.subscribeMessagesIds.audit,
                        success(res: any): void {
                            resolve(res);
                        },
                        fail(res: any): void {
                            reject(res)
                        }
                    })
                });
            }finally {
                uni.hideLoading();
            }
            uni.showToast({title: resObj.result === "success" ? "成功" : "已提交"});
            this.initialForm();
            await delay(1000);
            uni.navigateTo({
                url: `/pages/activityList/activityDetail/activityDetail?activityId=${resObj.activityId}`
            })
        }
        openAdvancedRulePage(){
            this.$store.commit(SET_ADVANCE_RULE, this.$store.state.newActivity.rules);
            this.$store.commit(SET_ADVANCE_RULE_SAVED, false);
            this.advancedRuleToBeSync = true;
            uni.navigateTo({
                url: '/pages/newActivity/advanceRule?allowModify=1'
            })
        }
        advancedRuleToBeSync = false;
        get advancedRuleDescription(){
            return generateRuleDescription(this.$store.state.newActivity.rules)
        }
        onShow(){
            if(this.advancedRuleToBeSync && this.$store.state.advancedRule.saved)this.$store.commit(SYNC_RULE_NEW_ACTIVITY, this.$store.state.advancedRule.rule);
        }
    }
</script>

<style scoped>
    switch.signupBegin::before{
        font-family: inherit;
        content: "立即";
        left: 10px;
        width: 70px;
        transform-origin: right;
    }
    switch.signupBegin::after{
        font-family: inherit;
        content: "指定";
        width: 70px;
        left: -10px;
        transform-origin: left;
    }
    switch.signupEnd::before{
        font-family: inherit;
        content: "默认";
        left:10px;
        width: 100%;
        transform-origin: right;
    }
    switch.signupEnd::after{
        font-family: inherit;
        content: "指定";
        left: -10px;
        width: 100%;
        transform-origin: left;
    }
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

<style>
    /*  #ifdef H5  */
    switch.ansg >>> .uni-switch-input, switch.ansg >>> .wx-switch-input{
        width: 70px;
    }
    switch.ansg >>> .uni-switch-input-checked::after, switch.ansg >>> .wx-switch-input-checked::after {
        left: 44px;
    }
    /*  #endif  */
    /*  #ifndef H5  */
    switch.ansg .uni-switch-input, switch.ansg .wx-switch-input{
        width: 70px;
    }
    switch.ansg .uni-switch-input-checked::after, switch.ansg .wx-switch-input-checked::after {
        left: 44px;
    }
    /*  #endif  */
</style>
