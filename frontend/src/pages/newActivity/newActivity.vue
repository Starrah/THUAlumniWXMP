<template>
    <view>
    <form @submit="submitNewActivity">
        <view class="cu-form-group margin-top-sm">
            <view class="title">活动名称</view>
            <input ref="name" name="name" />
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
            <input ref="tag" name="tag" placeholder="多个标签之间以逗号或空格分隔"/>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">公开活动</view>
            <text>开启则可被公开检索到</text>
            <switch @change="switchCanBeSearched = $event.detail.value" :class="switchCanBeSearched?'checked':''" :checked="switchCanBeSearched">
            </switch>
        </view>
        <view class="cu-form-group margin-top-sm">
            <view class="title">地点</view>
            <input ref="place" name="place" />
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">开始时间</view>
            <picker mode="date" :value="startDate" :start="today" :end="maxDate" @change="startDate = $event.detail.value" name="startDate">
                <view class="picker">
                    {{startDate}}
                </view>
            </picker>
            <picker mode="time" :value="startTime" start="00:00" end="23:59" @change="startTime = $event.detail.value" name="startTime">
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
            <picker mode="time" :value="endTime" :start="minStartTime" end="23:59" @change="endTime = $event.detail.value" name="endTime">
                <view class="picker">
                    {{endTime}}
                </view>
            </picker>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">报名开始</view>
            <text v-if="!switchSignupBegin">发布活动后立即可报名</text>
            <view v-if="switchSignupBegin">
                <picker mode="date" :value="signupBeginAtDate" :start="today" :end="startDate" @change="signupBeginAtDate = $event.detail.value" name="signupBeginAtDate">
                    <view class="picker">
                        {{Datenum(signupBeginAtDate)}}
                    </view>
                </picker>
                <picker mode="time" :value="signupBeginAtTime" start="00:00" end="23:59" @change="signupBeginAtTime = $event.detail.value" name="signupBeginAtTime">
                    <view class="picker">
                        {{getTime(signupBeginAtTime)}}
                    </view>
                </picker>
            </view>
            <switch @change="switchSignupBegin = $event.detail.value" class="signupBegin ansg" :class="switchSignupBegin?'checked':''" :checked="switchSignupBegin">
            </switch>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">报名截止</view>
            <text v-if="!switchSignupStop">直到活动开始时间</text>
            <view v-if="switchSignupStop">
                <picker v-if="switchSignupStop" mode="date" :value="signupStopAtDate" :start="today" :end="startDate" @change="signupStopAtDate = $event.detail.value" name="signupStopAtDate">
                    <view class="picker">
                        {{Datenum(signupStopAtDate)}}
                    </view>
                </picker>
                <picker v-if="switchSignupStop" mode="time" :value="signupStopAtTime" start="00:00" end="23:59" @change="signupStopAtTime = $event.detail.value" name="signupStopAtTime">
                    <view class="picker">
                        {{getTime(signupStopAtTime)}}
                    </view>
                </picker>
            </view>
            <switch @change="switchSignupStop = $event.detail.value" class="signupEnd ansg" :class="switchSignupStop?'checked':''" :checked="switchSignupStop">
            </switch>
        </view>
        <view class="cu-form-group margin-top arrow">
            <view class="title">报名规则</view>
            <view @click="openAdvancedRulePage">{{advancedRuleDescription}}</view>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">人数</view>
            <input ref="minUser" name="minUser" style="text-align: right" />
            <text style="font-size: 30upx" class="margin-lr-lg">~</text>
            <input ref="maxUser" name="maxUser" />
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
    import {SET_ADVANCE_RULE, SET_NEW_ACTIVITY, SYNC_RULE_NEW_ACTIVITY} from "@/store/mutation";
    import {FETCH_ACTIVITY_TYPE_LIST, SUBMIT_NEW_ACTIVITY} from "@/store/action";
    import {withSec} from "@/apps/utils/DateStringFormat";
    import SureModal from "@/components/SureModal.vue";
    import {generateRuleDescription} from "@/apps/utils/ActivitySchemaUtils";
    import {SignupRule} from "@/apps/typesDeclare/SignupRule";
    import {RuleType} from "@/apps/typesDeclare/ActivityEnum";

    @Component({
        components: {SureModal}
    })
    export default class newActivity extends Vue{
        name: "newActivity";
        DEFAULT_TIMEPICKER_VALUE = "请选择";
        initialForm(){
            let inputRefnameList = ["name", "place", "minUser", "maxUser", "tag"];
            for(let refname of inputRefnameList){
                (this.$refs[refname] as any).value = "";
            }
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
            console.log([1, this.$store.state.newActivity]);
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
            let r = "";
            for(let i=0;i<this.typeMultiIndex.length-1;i++){
                r += (this.typeMultiArray[i][this.typeMultiIndex[i]] + " - ");
            }
            let i = this.typeMultiIndex.length-1;
            if(i >= 0) r += this.typeMultiArray[i][this.typeMultiIndex[i]];
            return r;
        }
        get minStartTime(): string{
            if(this.endDate <= this.startDate){
                return this.startTime
            }
            else return "00:00"
        }
        Datenum(str):string {
            let r="";
            let a=str.split('-');
            if(a.length<3)return str;
            r=a[0]+'年'+a[1]+'月'+a[2]+'日';
            return r;
        }
        getTime(str):string {
            if(str.length==0)return "请选择";
            else return str;
        }
        async submitNewActivity(e){
            console.log(e.detail.value);
            let formData = e.detail.value;
            let data = {
                name: formData.name,
                place: formData.place,
                start: withSec(this.startDate + " " + this.startTime),
                end: withSec(this.endDate + " " + this.endTime),
                tags: formData.tag.split(/[, ]/),
                signupBeginAt: this.switchSignupBegin?withSec(this.signupBeginAtDate + " " + this.signupBeginAtTime):undefined,
                signupStopAt: this.switchSignupBegin?withSec(this.signupStopAtDate + " " + this.signupStopAtTime):undefined,
                type: this.typeMultiArray[0][this.typeMultiIndex[0]] + "-" + this.typeMultiArray[1][this.typeMultiIndex[1]],
                maxUser: formData.maxUser?Number.parseInt(formData.maxUser):undefined,
                minUser: formData.minUser?Number.parseInt(formData.minUser):undefined,
                canBeSearched: this.switchCanBeSearched
            };
            await ((this.$refs.SureModal as any).show("您确定要发起这个活动吗？"));
            this.$store.commit(SET_NEW_ACTIVITY, data);
            let activityId = await this.$store.dispatch(SUBMIT_NEW_ACTIVITY);
            uni.showToast({title: "成功", icon: "none"});
            this.initialForm();
            await delay(1000);
            uni.navigateTo({
                url: `../activityList/activityDetail/activityDetail?activityId=${activityId}`
            })
        }
        openAdvancedRulePage(){
            this.$store.commit(SET_ADVANCE_RULE, this.$store.state.newActivity.rules);
            this.advancedRuleToBeSync = true;
            uni.navigateTo({
                url: './advanceRule'
            })
        }
        advancedRuleToBeSync = false;
        get advancedRuleDescription(){
            console.log([2, this.$store.state.newActivity.rules.ruleType]);
            return generateRuleDescription(this.$store.state.newActivity.rules)
        }
        onShow(){
            if(this.advancedRuleToBeSync)this.$store.commit(SYNC_RULE_NEW_ACTIVITY, this.$store.state.advancedRule)
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
    switch.ansg >>> .uni-switch-input, switch.ansg >>> .wx-switch-input{
        width: 70px;
    }
    switch.ansg >>> .uni-switch-input-checked::after, switch.ansg >>> .wx-switch-input-checked::after {
        left: 44px;
    }
</style>
