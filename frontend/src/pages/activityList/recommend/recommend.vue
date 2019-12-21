<template>
    <view>
        <SearchBar v-model="searchText"></SearchBar>
        <ActivityListShow :list="activities_toShow"></ActivityListShow>
        <view class="cu-item" v-if="isLoadingMore">
            <text>加载中</text>
        </view>
    </view>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component} from 'vue-property-decorator'
    import {ActivitySchema} from "@/apps/typesDeclare/ActivitySchema";
    import {FETCH_RECOMMEND} from "@/store/action";
    import initialGlobalData from "@/apps/typesDeclare/InitialGlobalData";
    import {fullUrl} from "@/apps/utils/networkUtils";
    import {SET_RECOMMEND_PAGE_ID} from "@/store/mutation";
    import ActivityListShow from "@/components/ActivityListShow.vue";
    import SearchBar from "@/components/SearchBar.vue";
    @Component({
        components: {SearchBar, ActivityListShow}
    })
    export default class recommendList extends Vue{
        name!: "recommendList";
        fullUrl = fullUrl;
        searchText = "";
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
                await this.$store.dispatch(FETCH_RECOMMEND, {
                    lastSeenId
                });
            }finally {
                this.isLoadingMore = false;
            }
        }
        onShow(){
            console.log("onsHOW");
        }
        get DEFAULT_ACTIVITY_URL(){
            return initialGlobalData.devData.DEFAULT_ACTIVITY_URL;
        }
        pageType: string = "";
        debugCode?:string = "";
        get activities_toShow(){
            let actualArray = this.activities_valid;
            if(this.searchText && this.searchText !== ""){
                actualArray = this.activities_valid.filter((v: ActivitySchema)=>{
                    return v.name.indexOf(this.searchText) !== -1 && v.tags.indexOf(this.searchText) !== -1;
                })
            }
            return actualArray
        }
        get activities_valid(){
            return this.$store.state.recommendList.activityList;
        }
        async onPullDownRefresh(){
            try{
                await this.$store.dispatch(FETCH_RECOMMEND);
            }finally {
                uni.stopPullDownRefresh();
            }
        }
        activityId: string = "";
        onLoad(param){
            console.log("onLoad");
            this.activityId = param.activityId;
            this.$store.commit(SET_RECOMMEND_PAGE_ID, param);
            this.$store.dispatch(FETCH_RECOMMEND);
            console.log(this.$store.state.recommendList);
        }
    }
</script>

<style scoped>

</style>