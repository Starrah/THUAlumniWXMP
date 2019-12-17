import {ActivityCheckStatus} from "../../../apps/typesDeclare/ActivityEnum";
import {ActivityJoinStatus} from "../../../apps/typesDeclare/ActivityEnum";
<template>
    <view>
    <form @submit="modifyNewActivity">
        <view class="cu-form-group margin-top-sm">
            <view class="title">活动名称</view>
            <input ref="name" name="name" :value="activityName"/>
        </view>
        <view class="cu-form-group margin-top-sm">
            <view class="title">活动类型</view>
            <picker mode="multiSelector" @change="typeMultiChange" @columnchange="typeMultiColumnChange" :value="typeMultiIndex" :range="typeMultiArray" name="type">
                <view class="picker">
                    {{typeMultiShowText}}
                </view>
            </picker>
        </view>
        <view class="cu-form-group margin-top-sm">
            <view class="title">标签</view>
            <input ref="tag" name="tag" placeholder="多个标签之间以逗号或空格分隔" :value="tag"/>
        </view>
        <view class="cu-form-group margin-top-sm arrow" @click="chooseImage">
            <view class="title">活动头像</view>
            <view v-if="imageUrl && imageUrl !== ''" class="cu-avatar radius" :style="'background-image: url(' + imageUrl + ');'"></view>
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
            <input ref="place" name="place" :value="place"/>
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
                    {{signupBeginAtDate}}
                </view>
            </picker>
            <picker v-if="switchSignupBegin" mode="time" :value="signupBeginAtTime" start="00:00" end="23:59" @change="signupBeginAtTime = $event.detail.value" name="signupBeginAtTime" style="left: -20px">
                <view class="picker">
                    {{signupBeginAtTime}}
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
                    {{signupStopAtDate}}
                </view>
            </picker>
            <picker v-if="switchSignupStop" mode="time" :value="signupStopAtTime" start="00:00" end="23:59" @change="signupStopAtTime = $event.detail.value" name="signupStopAtTime" style="left: -20px">
                <view class="picker">
                    {{signupStopAtTime}}
                </view>
            </picker>
            <switch @change="switchSignupStop = $event.detail.value" class="signupEnd ansg" :class="switchSignupStop?'checked':''" :checked="switchSignupStop">
            </switch>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">报名状态</view>
            <picker @change="statusJoin = $event.detail.value" :value="statusJoin" :range="STATUS_JOIN_WORDS">
                <view class="picker">
                    {{STATUS_JOIN_WORDS[statusJoin]}}
                </view>
            </picker>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">签到状态</view>
            <picker @change="statusCheck = $event.detail.value" :value="statusCheck" :range="STATUS_CHECK_WORDS">
                <view class="picker">
                    {{STATUS_CHECK_WORDS[statusCheck]}}
                </view>
            </picker>
        </view>
        <view class="cu-form-group margin-top arrow">
            <view class="title">报名规则</view>
            <view @click="openAdvancedRulePage">{{advancedRuleDescription}}</view>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">人数</view>
            <input ref="minUser" name="minUser" style="text-align: right" :value="minUser"/>
            <text style="font-size: 30upx" class="margin-lr-lg">~</text>
            <input ref="maxUser" name="maxUser" :value="maxUser"/>
        </view>
        <br>
        <view style="display: flex;justify-content: center">
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
    import {
        SET_ADVANCE_RULE,
        SET_NEW_ACTIVITY,
        SYNC_RULE_MODIFY_ACTIVITY,
        SYNC_RULE_NEW_ACTIVITY
    } from "@/store/mutation";
    import {
        FETCH_ACTIVITY_TYPE_LIST,
        SET_CHANGE_ACTIVITY,
        SUBMIT_ACTIVITY_CHANGE,
        SUBMIT_NEW_ACTIVITY
    } from "@/store/action";
    import {withoutSec, withSec} from "@/apps/utils/DateStringFormat";
    import SureModal from "@/components/SureModal.vue";
    import {ActivitySchema} from "@/apps/typesDeclare/ActivitySchema";
    import {ActivityCheckStatus, ActivityJoinStatus} from "@/apps/typesDeclare/ActivityEnum";
    import {generateRuleDescription} from "@/apps/utils/ActivitySchemaUtils";
    import {SignupRule} from "@/apps/typesDeclare/SignupRule";
    import apiService from "../../../commons/api"
    import {fullUrl} from "@/apps/utils/networkUtils";

    @Component({
        components: {SureModal}
    })
    export default class modifyActivity extends Vue{
        name: "modifyActivity";
        DEFAULT_TIMEPICKER_VALUE = "请选择";
        activityId: string;
        get today(): string{
            return dateFormat(new Date(), "yyyy-mm-dd")
        }
        activityName: string = "";
        place: string = "";
        minUser: number | string = "";
        maxUser: number | string = "";
        tag: string = "";
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
        statusJoin: ActivityJoinStatus = ActivityJoinStatus.Before;
        statusCheck: ActivityCheckStatus = ActivityCheckStatus.Before;
        imageUrl: string = "";
        STATUS_JOIN_WORDS = ["报名尚未开始", "报名中", "报名已暂停", "报名已截止"];
        STATUS_CHECK_WORDS = ["签到尚未开始", "签到中", "签到已暂停", "签到已截止"];
        createDateTime: string = "";
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
                console.log(path);
                console.log(absUrl);
                this.imageUrl = absUrl;
            }finally {
                uni.hideLoading()
            }
        }
        get typeMultiData(){
            let temp = this.$store.state.activityTypeList;
            if(!temp.initialized)this.$store.dispatch(FETCH_ACTIVITY_TYPE_LIST);
            if(this.typeMultiIndex.length !== temp.level)this.typeMultiIndex = [0, 0, 0, 0, 0, 0].slice(0, temp.level);
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
        async modifyNewActivity(e){
            let formData = e.detail.value;
            console.log(["fd", formData])
            let data = {
                name: formData.name,
                place: formData.place,
                start: withSec(this.startDate + " " + this.startTime),
                end: withSec(this.endDate + " " + this.endTime),
                tags: formData.tag.split(/[, ]/),
                signupBeginAt: this.switchSignupBegin?withSec(this.signupBeginAtDate + " " + this.signupBeginAtTime):this.createDateTime,
                signupStopAt: this.switchSignupStop?withSec(this.signupStopAtDate + " " + this.signupStopAtTime):withSec(this.startDate + " " + this.startTime),
                type: this.typeMultiArray[0][this.typeMultiIndex[0]] + "-" + this.typeMultiArray[1][this.typeMultiIndex[1]],
                maxUser: formData.maxUser?Number.parseInt(formData.maxUser):-1,
                minUser: formData.minUser?Number.parseInt(formData.minUser):0,
                canBeSearched: this.switchCanBeSearched,
                statusJoin: this.statusJoin,
                statusCheck: this.statusCheck,
                rules: this.rules,
                imageUrl: this.imageUrl
            };
            console.log(data.signupStopAt);
            await ((this.$refs.SureModal as any).show("您确定要修改这个活动吗？"));
            this.$store.commit(SET_CHANGE_ACTIVITY, data);
            let res = await this.$store.dispatch(SUBMIT_ACTIVITY_CHANGE);
            if(res){
                let isPush;
                try {
                    await ((this.$refs.SureModal as any).show("您可以选择向当前所有活动参加者推送一条消息，以通知他们活动的更改。但根据微信相关规则，该类消息整个活动期间活动只能推送一次。您要使用这个机会吗？"));
                    isPush = true;
                }catch(e){
                    isPush = false;
                }
                if(isPush)await res.push();
                else await res.notPush();
            }
            uni.showToast({title: "成功", icon: "none"});
            await delay(1000);
            uni.navigateBack();
        }
        showCurrentValue(){
            let obj = this.$store.state.activityDetail.changeBuffer as ActivitySchema;
            console.log(obj);
            this.activityId = obj.id;
            this.activityName = obj.name;
            this.place = obj.place;
            this.tag = obj.tags.join(",");
            this.minUser = obj.minUser !== 0?obj.minUser:"";
            this.maxUser = obj.maxUser !== -1?obj.maxUser:"";
            this.switchCanBeSearched = obj.canBeSearched;
            let startArr = withoutSec(obj.start).split(" ");
            this.startDate = startArr[0];
            this.startTime = startArr[1];
            let endArr = withoutSec(obj.end).split(" ");
            this.endDate = endArr[0];
            this.endTime = endArr[1];
            let signupBeiginAtArr = withoutSec(obj.signupBeginAt).split(" ");
            this.signupBeginAtDate = signupBeiginAtArr[0];
            this.signupBeginAtTime = signupBeiginAtArr[1];
            this.switchSignupBegin = (obj.signupBeginAt !== obj.createTime);
            let signupEndAtArr = withoutSec(obj.signupStopAt).split(" ");
            this.signupStopAtDate = signupEndAtArr[0];
            this.signupStopAtTime = signupEndAtArr[1];
            this.switchSignupStop = (obj.signupStopAt !== obj.start);
            let typeArr = obj.type.split("-");
            let tempMultiIndex = [];
            let curNode: Array<any> = this.typeMultiData.types;
            for(let i=0;i<typeArr.length;i++){
                if(!curNode)break;
                let j = 0;
                for(j=0;j<curNode.length;j++){
                    if(curNode[j].name === typeArr[i])break;
                }
                if(j >= curNode.length)j=0;
                tempMultiIndex.push(j);
                curNode = curNode[j].children;
            }
            this.typeMultiIndex = tempMultiIndex;
            this.statusJoin = obj.statusJoin;
            this.statusCheck = obj.statusCheck;
            this.createDateTime = obj.createTime;
            this.imageUrl = obj.imageUrl;
        }
        mounted(){
            this.showCurrentValue();
        }
        openAdvancedRulePage(){
            this.$store.commit(SET_ADVANCE_RULE, this.$store.state.activityDetail.changeBuffer.rules);
            this.advancedRuleToBeSync = true;
            uni.navigateTo({
                url: '/pages/newActivity/advanceRule?allowModify=1'
            })
        }
        advancedRuleToBeSync = false;
        get advancedRuleDescription(){
            console.log([2, this.$store.state.newActivity.rules.ruleType]);
            return generateRuleDescription(this.$store.state.newActivity.rules)
        }
        rules: SignupRule;
        onShow(){
            if(this.advancedRuleToBeSync)this.rules = this.$store.state.advancedRule;
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