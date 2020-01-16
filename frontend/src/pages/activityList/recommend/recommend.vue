<template>
    <view>
        <SearchBar v-model="searchText"></SearchBar>
        <ActivityListShow :list="activities_toShow"></ActivityListShow>
        <view class="cu-load bg-white" :class="isLoadingMore" v-if="isLoadingMore"></view>
    </view>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component} from 'vue-property-decorator'
    import {ActivitySchema} from "@/apps/typesDeclare/ActivitySchema";
    import {FETCH_RECOMMEND} from "@/store/action";
    import initialGlobalData from "@/apps/typesDeclare/InitialGlobalData";
    import {fullUrl, handleNetExcept} from "@/apps/utils/networkUtils";
    import {SET_RECOMMEND_PAGE_ID} from "@/store/mutation";
    import ActivityListShow from "@/components/ActivityListShow.vue";
    import SearchBar from "@/components/SearchBar.vue";
    import delay from 'delay';

    @Component({
        components: {SearchBar, ActivityListShow}
    })
    export default class recommendList extends Vue{
        name!: "recommendList";
        fullUrl = fullUrl;
        searchText = "";
        isLoadingMore: string = null;
        onReachBottom(){
            this.loadMore();
        }
        async loadMore(){
            this.isLoadingMore = "loading";
            let allActivityes: Array<ActivitySchema> = this.activities_toShow;
            let lastSeenId = allActivityes.length > 0?allActivityes[allActivityes.length-1].id:undefined;
            try {
                let haveMore = await this.$store.dispatch(FETCH_RECOMMEND, {
                    lastSeenId
                });
                if(haveMore){
                    this.isLoadingMore = null;
                }else{
                    this.isLoadingMore = "over";
                    await delay(1000);
                    this.isLoadingMore = null;
                }
            }catch (e) {
                this.isLoadingMore = "erro";
                await delay(1000);
                this.isLoadingMore = null;
            }
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
            this.activityId = param.activityId;
            this.$store.commit(SET_RECOMMEND_PAGE_ID, param);
            this.$store.dispatch(FETCH_RECOMMEND);
        }
    }
</script>

<style scoped>

</style>