import {ActivityGlobalStatus} from "../../apps/typesDeclare/ActivityEnum";
<template>
    <view>
<!--        <text>{{debugCode}}</text>-->
        <view class="cu-bar search bg-white">
            <view class="search-form round">
                <text class="cuIcon-search"></text>
                <input @focus="InputFocus" @blur="InputBlur" :adjust-position="false" type="text" placeholder="搜索活动" confirm-type="search"></input>
            </view>
            <view class="action">
                <button class="cu-btn bg-green shadow-blur round" @click="search">搜索</button>
            </view>
        </view>
        <scroll-view scroll-y="true" lower-threshold="1" :enable-back-to-top="true" @scrolltolower="loadMore">
            <view class="cu-list menu">
                <view class="cu-item arrow" style="flex-direction: row;display: flex;border-left-width: 4px;border-left-style: solid;border-left-color: rgb(238,238,238);border-right-width: 4px;border-right-style: solid;border-right-color: rgb(238,238,238);border-top-width: 4px;border-top-style: solid;border-top-color: rgb(238,238,238)" v-for="activity in activities_toShow" :key="activity.id" @click="jumpToActivityDetail($event, activity)">
                    <view style="flex-basis: 20%">
                        <view class="cu-avatar radius" style="background-image:url(../../../static/me.png);"></view>
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
                    <view style="flex-basis: 19%" class="basis-xs" :class="activity.curUser<activity.maxUser?'cu-tag round bg-olive light':'cu-tag round bg-red light'">
                        <text class="text-lg text-green">{{activity.curUser}}</text>
                        <text class="text-lg text-black">/</text>
                        <text class="text-lg text-red">{{activity.maxUser}}</text>
                    </view>
                </view>
                <view class="cu-item" v-if="isLoadingMore">
                    <text>加载中</text>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component} from 'vue-property-decorator'
    import {ActivitySchema} from "@/apps/typesDeclare/ActivitySchema";
    import {FETCH_MY_ACTIVITY_LIST} from "@/store/action";

    @Component
    export default class mainList extends Vue{
        name!: "myActivityList";
        pageType: string = "";
        debugCode?:string = "";
        get activities_toShow(){
            let actualIndex = this.finalCount < this.activities_valid.length?this.finalCount:this.activities_valid.length;
            return this.activities_valid.slice(0, actualIndex);
        }
        get activities_valid(){
            if(this.pageType === "history")return this.$store.state.myActivityList.history;
            else if (this.pageType === "myParticipate")return this.$store.state.myActivityList.myParticipate;
            else if (this.pageType === "mySponsor")return this.$store.state.myActivityList.mySponsor;
        }
        DEFAULT_ONCE_SHOW_COUNT = 15;
        finalCount = this.DEFAULT_ONCE_SHOW_COUNT;
        search(){
            uni.showToast({title: "尚未支持", icon:"none"})
        }
        isLoadingMore: boolean = false;
        async loadMore(){
            if(this.finalCount < this.activities_valid.length)this.finalCount += this.DEFAULT_ONCE_SHOW_COUNT
        }
        async onPullDownRefresh(){
            try{
                await this.$store.dispatch(FETCH_MY_ACTIVITY_LIST);
            }finally {
                uni.stopPullDownRefresh();
            }
        }
        mounted(){
        }

        onLoad(param){
            this.pageType = param.type;
            if(this.pageType === "history")uni.setNavigationBarTitle({title: "历史记录"});
            else if(this.pageType === "myParticipate")uni.setNavigationBarTitle({title: "我参与的活动"});
            else if(this.pageType === "mySponsor")uni.setNavigationBarTitle({title: "我发起的活动"});
            this.$store.dispatch(FETCH_MY_ACTIVITY_LIST);
            this.finalCount = this.DEFAULT_ONCE_SHOW_COUNT;
        }

        jumpToActivityDetail(event, a: ActivitySchema){
            uni.navigateTo({
                url: `../activityDetail/activityDetail?activityId=${a.id}`
            })
        }

    }
</script>

<style scoped>

</style>