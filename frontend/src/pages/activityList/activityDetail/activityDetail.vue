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
                <view class="title">地点</view>
                <text>{{activityData.place}}</text>
            </view>
            <view class="cu-form-group margin-top">
                <view class="title">开始时间</view>
                <view class="picker">
                    {{startDate}}
                </view>
                <view class="picker">
                    {{startTime}}
                </view>
            </view>
            <view class="cu-form-group margin-top">
                <view class="title">结束时间</view>
                <view class="picker">
                    {{endDate}}
                </view>
                <view class="picker">
                    {{endTime}}
                </view>
            </view>
            <view class="cu-form-group margin-top">
                <view class="title">人数</view>
                <text>{{userCountString}}</text>
            </view>
        </view>
    <view>
        <button class="cu-btn bg-green lg align-center" @click="attendCurActivity">立即报名</button>
    </view>
    </view>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import promisify from "@/apps/Promisify";
    import {ActivitySchema} from "@/apps/typesDeclare/ActivitySchema";

    @Component
    export default class activityDetail extends Vue{
        name!: "activityDetail";
        activityId: string = "";
        @Prop({type: Object, default: null})activityData: ActivitySchema = null;
        async updateActivityData(){
            if(!this.activityData){
                let res = await promisify.request({
                    url: getApp().globalData.baseUrl + `/getActivityInfo?activityId=${this.activityId}`,
                    method: "GET",
                    dataType: "json",
                });
                this.activityData = res.data
            }
        }
        async attendCurActivity(){
            let res = await promisify.request({
                url: getApp().globalData.baseUrl + `/joinActivity?activityId=${this.activityId}`,
                method: "POST",
                dataType: "json",
                data:{}
            });
            uni.showToast({
                title: res.data.result === "success"?"参加成功":"参加失败",
                icon: "none"
            })
        }
        onLoad(param: any){
            this.activityId = param.activityId;
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
        get userCountString(){
            let r2 = "";
            if(this.activityData.minUser && !this.activityData.maxUser){
                r2 = `最少${this.activityData.minUser}人`
            }else if(!this.activityData.minUser && this.activityData.maxUser){
                r2 = `最多${this.activityData.maxUser}人`
            }else if(this.activityData.minUser && this.activityData.maxUser){
                r2 = `需要${this.activityData.minUser}~${this.activityData.maxUser}人`
            }
            return `当前${this.activityData.curUser}人/${r2}`;
        }
    }
</script>

<style scoped>

</style>