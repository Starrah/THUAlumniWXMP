<template>
    <view>
<!--        <text>{{debugCode}}</text>-->
        <view class="cu-bar search bg-white">
            <view class="search-form round">
                <text class="cuIcon-search"></text>
                <input :adjust-position="false" type="text" placeholder="搜索活动" v-model="tempSearchText"/>
            </view>
            <view class="action">
                <button class="cu-btn bg-green shadow-blur round" @click="search">搜索</button>
            </view>
        </view>
<!--        <scroll-view scroll-y="true" :lower-threshold="100" :enable-back-to-top="true" @scrolltolower="loadMore" @scrolltoupper="loadMore">-->
            <view class="cu-list menu">
                <view class="cu-item arrow" style="flex-direction: row;display: flex;border-left-width: 4px;border-left-style: solid;border-left-color: rgb(238,238,238);border-right-width: 4px;border-right-style: solid;border-right-color: rgb(238,238,238);border-top-width: 4px;border-top-style: solid;border-top-color: rgb(238,238,238)" v-for="activity in activities_toShow" :key="activity.id" @click="jumpToActivityDetail($event, activity)">
                    <view style="flex-basis: 20%">
                        <view class="cu-avatar radius" :style="'background-image:url('+fullUrl(activity.imageUrl)+');'"></view>
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
                    <view style="flex-basis: 19%" class="basis-xs" :class="(activity.curUser<activity.maxUser||activity.maxUser==-1)?'cu-tag round bg-olive light':'cu-tag round bg-red light'">
                        <text class="text-lg text-green">{{activity.curUser}}</text>
                        <text class="text-lg text-black" :style="activity.maxUser==-1?'display:none':''">/</text>
                        <text class="text-lg text-red" :style="activity.maxUser==-1?'display:none':''">{{activity.maxUser}}</text>
                    </view>
                </view>
                <view class="cu-item" v-if="isLoadingMore">
                    <text>加载中</text>
                </view>
            </view>
<!--        </scroll-view>-->
    </view>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component} from 'vue-property-decorator'
    import promisify from "@/apps/Promisify";
    import apiService from '@/commons/api'
    import {ActivitySchema} from "@/apps/typesDeclare/ActivitySchema";
    import {FETCH_ALL_ACTIVITY_LIST, FETCH_MORE_ACTIVITY, TRY_LOGIN_WITHOUT_NEW_CODE} from "@/store/action";
    import initialGlobalData from "@/apps/typesDeclare/InitialGlobalData";
    import {fullUrl} from "@/apps/utils/networkUtils";


    @Component
    export default class mainList extends Vue{
        name!: "mainList";
        fullUrl = fullUrl;
        debugCode?:string = "";
        tempSearchText = "";
        searchText = "";
        search(){
            this.searchText = this.tempSearchText;
            this.$store.dispatch(FETCH_ALL_ACTIVITY_LIST, {searchWord: this.searchText});
        }
        get DEFAULT_ACTIVITY_URL(){
            return initialGlobalData.devData.DEFAULT_ACTIVITY_URL;
        }
        get activities_toShow(){
            return this.$store.state.allActivityList.activityList;
        }
        isLoadingMore: boolean = false;
        onReachBottom(){
            this.loadMore();
        }
        async loadMore(){
            console.log("loadMore");
            this.isLoadingMore = true;
            let allActivityes: Array<ActivitySchema> = this.activities_toShow;
            let lastSeenId = allActivityes.length > 0?allActivityes[allActivityes.length-1].id:undefined;
            try {
                await this.$store.dispatch(FETCH_MORE_ACTIVITY, {
                    lastSeenId,
                    searchWord: this.searchText
                });
            }finally {
                this.isLoadingMore = false;
            }
        }
        async onPullDownRefresh(){
            try{
                await this.$store.dispatch(FETCH_ALL_ACTIVITY_LIST, {searchWord: this.searchText});
            }finally {
                uni.stopPullDownRefresh();
            }
        }
        mounted(){
            // uni.login({
            //     provider: "weixin",
            //     success: loginRes => {
            //         console.log(loginRes["code"]);
            //         this.debugCode = loginRes["code"];
            //     }
            // });
            // this.activities_toShow = [
            //     {name: "aaa", place: "bbb"},
            //     {name: "aaa", place: "bbb"},
            //     {name: "aaa", place: "bbb"},
            //     {name: "aaa", place: "bbb"},
            //     {name: "aaa", place: "bbb"},
            //     {name: "aaa", place: "bbb"}
            // ]
            // this.$store.dispatch(FETCH_ALL_ACTIVITY_LIST);
        }

        async onShow(){
            if(!this.$store.state.profile.logined)await this.$store.dispatch(TRY_LOGIN_WITHOUT_NEW_CODE);
            this.$store.dispatch(FETCH_ALL_ACTIVITY_LIST, {searchWord: this.searchText})
        }

        jumpToActivityDetail(event, a: ActivitySchema){
            uni.navigateTo({
                url: `/pages/activityList/activityDetail/activityDetail?activityId=${a.id}`
            })
        }
    }
</script>

<style scoped>

</style>