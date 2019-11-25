<template>
    <view>
    <view class="cu-bar bg-white">
<!--        <view class="action">-->
<!--            <text class="cuIcon-back text-gray"></text> 返回-->
<!--        </view>-->
        <view class="content text-bold">
            发起活动
        </view>
    </view>
    <form @submit="submitNewActivity">
        <view class="cu-form-group margin-top-sm">
            <view class="title">活动名称</view>
            <input name="name" />
        </view>
        <view class="cu-form-group margin-top-sm">
            <view class="title">活动类型</view>
            <picker mode="multiSelector" @change="typeMultiChange" @columnchange="typeMultiColumnChange" :value="typeMultiIndex" :range="typeMultiArray" name="type">
                <view class="picker">
                    {{typeMultiShowText}}
                </view>
            </picker>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">公开活动</view>
            <text>开启则可被公开检索到</text>
            <switch @change="switchCanBeSearched = $event.detail.value" :class="switchCanBeSearched?'checked':''" :checked="switchCanBeSearched">
            </switch>
        </view>
        <view class="cu-form-group margin-top-sm">
            <view class="title">地点</view>
            <input name="place" />
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
            <picker v-if="switchSignupBegin" mode="date" :value="signupBeginAtDate" :start="today" :end="startDate" @change="signupBeginAtDate = $event.detail.value" name="signupBeginAtDate">
                <view class="picker">
                    {{signupBeginAtDate}}
                </view>
            </picker>
            <picker v-if="switchSignupBegin" mode="time" :value="signupBeginAtTime" start="00:00" end="23:59" @change="signupBeginAtTime = $event.detail.value" name="signupBeginAtTime">
                <view class="picker">
                    {{signupBeginAtTime}}
                </view>
            </picker>
            <switch @change="switchSignupBegin = $event.detail.value" class="signupBegin" :class="switchSignupBegin?'checked':''" :checked="switchSignupBegin">
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
            <picker v-if="switchSignupStop" mode="time" :value="signupStopAtTime" start="00:00" end="23:59" @change="signupStopAtTime = $event.detail.value" name="signupStopAtTime">
                <view class="picker">
                    {{signupStopAtTime}}
                </view>
            </picker>
            <switch @change="switchSignupStop = $event.detail.value" class="signupEnd" :class="switchSignupStop?'checked':''" :checked="switchSignupStop">
            </switch>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">人数</view>
            <input name="minUser" style="text-align: right" />
            <text style="font-size: 30upx" class="margin-lr-lg">~</text>
            <input name="maxUser" />
        </view>
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
    import promisify from '../../apps/Promisify'
    import delay from 'delay';
    import {SET_NEW_ACTIVITY} from "@/store/mutation";
    import {FETCH_ACTIVITY_TYPE_LIST, SUBMIT_NEW_ACTIVITY} from "@/store/action";
    import activityTypeList from "@/store/module/activityTypeList";
    import {withSec} from "@/apps/utils/DateStringFormat";
    import SureModal from "@/components/SureModal.vue";
    @Component({
        components: {SureModal}
    })
    export default class newActivity extends Vue{
        name: "newActivity";
        get today(): string{
            return dateFormat(new Date(), "yyyy-mm-dd")
        }
        maxDate = "2020-12-31";
        startDate: string = "请选择";
        startTime: string = "请选择";
        endDate: string = "请选择";
        endTime: string = "请选择";
        switchSignupBegin: boolean = false;
        switchSignupStop: boolean = false;
        signupBeginAtDate: string = "请选择";
        signupBeginAtTime: string = "请选择";
        signupStopAtDate: string = "请选择";
        signupStopAtTime: string = "请选择";
        get typeMultiData(){
            let temp = this.$store.state.activityTypeList;
            if(!temp.initialized)this.$store.dispatch(FETCH_ACTIVITY_TYPE_LIST);
            if(this.typeMultiIndex.length !== temp.level)this.typeMultiIndex = [0, 0, 0, 0, 0, 0].slice(0, temp.level);
            return temp;
        }
        typeMultiIndex: Array<number> = [];
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
        switchCanBeSearched: boolean = true;
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
        async submitNewActivity(e){
            console.log(e.detail.value);
            let formData = e.detail.value;
            let data = {
                name: formData.name,
                place: formData.place,
                start: withSec(this.startDate + " " + this.startTime),
                end: withSec(this.endDate + " " + this.endTime),
                signupBeginAt: this.switchSignupBegin?this.signupBeginAtDate + " " + this.signupBeginAtTime + ":00":undefined,
                signupStopAt: this.switchSignupStop?this.signupStopAtDate + " " + this.signupStopAtTime + ":00":undefined,
                type: this.typeMultiArray[0][this.typeMultiIndex[0]] + "-" + this.typeMultiArray[1][this.typeMultiIndex[1]],
                maxUser: formData.maxUser?Number.parseInt(formData.maxUser):undefined,
                minUser: formData.minUser?Number.parseInt(formData.minUser):undefined,
                canBeSearched: this.switchCanBeSearched
            };
            await ((this.$refs.SureModal as any).show("您确定要发起这个活动吗？"));
            this.$store.commit(SET_NEW_ACTIVITY, data);
            let activityId = await this.$store.dispatch(SUBMIT_NEW_ACTIVITY);
            uni.showToast({title: "成功", icon: "none"});
            await delay(1000);
            uni.navigateTo({
                url: `../activityList/activityDetail/activityDetail?activityId=${activityId}`
            })
        }
        mounted(){
            // this.updateTypeMultiData();
            // setInterval(()=>console.log(this.switchCanBeSearched), 1000)
            console.log(this.$SureModal);
        }
    }
</script>

<style scoped>
    switch.signupBegin::before{
        font-family: inherit;
        content: "立即";
        transform: scaleX(0.5);
        width: 100%;
        transform-origin: right;
    }
    switch.signupBegin::after{
        font-family: inherit;
        content: "指定";
        transform: scaleX(0.5);
        width: 100%;
        transform-origin: left;
    }
    switch.signupEnd::before{
        font-family: inherit;
        content: "默认";
        transform: scaleX(0.5);
        width: 100%;
        transform-origin: right;
    }
    switch.signupBegin::after{
        font-family: inherit;
        content: "指定";
        transform: scaleX(0.5);
        width: 100%;
        transform-origin: left;
    }
    .cu-form-group .title{
        min-width: calc(4em + 30upx);
    }
</style>