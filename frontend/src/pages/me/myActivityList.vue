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
    import {ActivitySchema} from "@/apps/typesDeclare/ActivitySchema";
    import {FETCH_MY_ACTIVITY_LIST} from "@/store/action";
    import initialGlobalData from "@/apps/typesDeclare/InitialGlobalData";
    import {fullUrl} from "@/apps/utils/networkUtils";
    import ActivityListShow from "@/components/ActivityListShow.vue";
    @Component({
        components: {ActivityListShow}
    })
    export default class myActivityList extends Vue{
        name!: "myActivityList";
        fullUrl = fullUrl;
        tempSearchText = "";
        searchText = "";
        search(){
            this.searchText = this.tempSearchText;
            this.finalCount = this.DEFAULT_ONCE_SHOW_COUNT;
        }
        get DEFAULT_ACTIVITY_URL(){
            return initialGlobalData.devData.DEFAULT_ACTIVITY_URL;
        }
        pageType: string = "";
        debugCode?:string = "";
        get activities_toShow(){
            let actualIndex = this.finalCount < this.activities_valid.length?this.finalCount:this.activities_valid.length;
            let actualArray = this.activities_valid;
            if(this.searchText && this.searchText !== ""){
                actualArray = this.activities_valid.filter((v: ActivitySchema)=>{
                    return v.name.indexOf(this.searchText) !== -1 && v.tags.indexOf(this.searchText) !== -1;
                })
            }
            return actualArray.slice(0, actualIndex);
        }
        get activities_valid(){
            if(this.pageType === "history")return this.$store.state.myActivityList.history;
            else if (this.pageType === "myParticipate")return this.$store.state.myActivityList.myParticipate;
            else if (this.pageType === "mySponsor")return this.$store.state.myActivityList.mySponsor;
        }
        DEFAULT_ONCE_SHOW_COUNT = 15;
        finalCount = this.DEFAULT_ONCE_SHOW_COUNT;
        isLoadingMore: boolean = false;
        onReachBottom(){
            this.loadMore();
        }
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
    }
</script>

<style scoped>

</style>