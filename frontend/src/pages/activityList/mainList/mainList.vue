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
            <view class="action">
                <button class="cu-btn bg-blue shadow-blur round" @click="jumpToAdvancedSearch">高级</button>
            </view>
        </view>
<!--        <scroll-view scroll-y="true" :lower-threshold="100" :enable-back-to-top="true" @scrolltolower="loadMore" @scrolltoupper="loadMore">-->
        <ActivityListShow :list="activities_toShow"></ActivityListShow>
        <view class="cu-item" v-if="isLoadingMore">
            <text>加载中</text>
        </view>
<!--        </scroll-view>-->
    </view>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component} from 'vue-property-decorator'
    import promisify from "@/apps/Promisify";
    import apiService from '@/commons/api'
    import {FETCH_ALL_ACTIVITY_LIST, FETCH_MORE_ACTIVITY, TRY_LOGIN_WITHOUT_NEW_CODE} from "@/store/action";
    import initialGlobalData from "@/apps/typesDeclare/InitialGlobalData";
    import {fullUrl} from "@/apps/utils/networkUtils";
    import ActivityListShow from "@/components/ActivityListShow.vue";
    import {ActivitySchema} from "@/apps/typesDeclare/ActivitySchema";


    @Component({
        components: {ActivityListShow}
    })
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
        jumpToAdvancedSearch(){
            uni.navigateTo({
                url: "/pages/activityList/advancedSearch/advancedSearch"
            })
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
        async onShow(){
            if(!this.$store.state.profile.logined)await this.$store.dispatch(TRY_LOGIN_WITHOUT_NEW_CODE);
            this.$store.dispatch(FETCH_ALL_ACTIVITY_LIST, {searchWord: this.searchText})
        }

    }
</script>

<style scoped>

</style>