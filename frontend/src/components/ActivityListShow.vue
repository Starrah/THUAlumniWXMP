<template>
    <view class="cu-list menu">
        <view class="cu-item arrow" style="flex-direction: row;display: flex;border-left-width: 4px;border-left-style: solid;border-left-color: rgb(238,238,238);border-right-width: 4px;border-right-style: solid;border-right-color: rgb(238,238,238);border-top-width: 4px;border-top-style: solid;border-top-color: rgb(238,238,238)" v-for="activity in list" :key="activity.id" @click="jumpToActivityDetail($event, activity)">
            <view style="flex-basis: 20%">
                <view class="cu-avatar radius" style="width: 100upx;height: 100upx;" :style="'background-image:url('+fullUrl(activity.imageUrl)+');'">
                    <view class="round bg-white text-orange cuIcon-roundcheck margin-left verifyedSign" v-if="isOfficial(activity)" @click="showOfficialModal"></view>
                </view>
            </view>
            <view style="flex-basis: 60%">
                <view>
                    <text class="cuIcon-activity"></text>
                    <text class="text-black text-xl">{{activity.name}}</text>
                </view>
                <view style="display: flex;justify-content: space-between;">
                    <view class="basis-df">
                        <view class="text-grey text-xs" style="width: max-content">开始时间:{{activity.start.substr(0,16)}}</view>
                        <view class="text-grey text-xs" style="width: max-content">结束时间:{{activity.end.substr(0,16)}}</view>
                        <view class="text-grey text-xs">地点:{{activity.place}}</view>
                    </view>
                </view>
            </view>
            <view style="flex-basis: 19%" class="basis-xs" :class="(activity.curUser<activity.maxUser||activity.maxUser===-1)?'cu-tag round bg-olive light':'cu-tag round bg-red light'">
                <text class="text-lg text-green">{{activity.curUser}}</text>
                <text class="text-lg text-black" :style="activity.maxUser===-1?'display:none':''">/</text>
                <text class="text-lg text-red" :style="activity.maxUser===-1?'display:none':''">{{activity.maxUser}}</text>
            </view>
        </view>
    </view>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Component, Prop} from "vue-property-decorator";
    import {fullUrl} from "@/apps/utils/networkUtils";
    import {ActivitySchema} from "@/apps/typesDeclare/ActivitySchema";
    import {isOfficial} from "@/apps/utils/ActivitySchemaUtils";

    @Component
    export default class ActivityListShow extends Vue{
        name: "ActivityListShow";
        fullUrl = fullUrl;
        isOfficial = isOfficial;
        @Prop({type: Array, default: []})list: Array<ActivitySchema>;
        jumpToActivityDetail(event, a: ActivitySchema){
            this.$emit("jumpToDetail", a);
            uni.navigateTo({
                url: `/pages/activityList/activityDetail/activityDetail?activityId=${a.id}`
            })
        }
    }
</script>

<style scoped>
    .verifyedSign {
        font-size: 40upx;
        /*border-radius: 200upx;*/
        position: absolute;
        bottom: -15upx;
        right: -15upx;
        /*font-size: 20upx;*/
        /*padding: 0upx 10upx;*/
        /*height: 28upx;*/
        /*color: #ffffff;*/
    }
</style>