<template>
    <view>
        <SearchBar v-model="searchText">
            <view class="action">
                <button class="cu-btn bg-blue shadow-blur round" @click="jumpToAdvancedSearch">高级</button>
            </view>
        </SearchBar>
        <ActivityListShow :list="activities_toShow"></ActivityListShow>
        <view class="cu-load bg-white" :class="isLoadingMore" v-if="isLoadingMore"></view>
    </view>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Watch} from 'vue-property-decorator'
    import {FETCH_ALL_ACTIVITY_LIST, FETCH_MORE_ACTIVITY, TRY_LOGIN_WITHOUT_NEW_CODE} from "@/store/action";
    import initialGlobalData from "@/apps/typesDeclare/InitialGlobalData";
    import {fullUrl, handleNetExcept} from "@/apps/utils/networkUtils";
    import ActivityListShow from "@/components/ActivityListShow.vue";
    import {ActivitySchema} from "@/apps/typesDeclare/ActivitySchema";
    import SearchBar from "@/components/SearchBar.vue";
    import delay from 'delay';


    @Component({
        components: {SearchBar, ActivityListShow}
    })
    export default class mainList extends Vue{
        name!: "mainList";
        fullUrl = fullUrl;
        debugCode?:string = "";
        searchText = "";
        @Watch("searchText")onSearchTextChange(newVal){
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
        isLoadingMore: string = null;
        onReachBottom(){
            this.loadMore();
        }
        async loadMore(){
            this.isLoadingMore = "loading";
            let allActivityes: Array<ActivitySchema> = this.activities_toShow;
            let lastSeenId = allActivityes.length > 0?allActivityes[allActivityes.length-1].id:undefined;
            try {
                let haveMore = await this.$store.dispatch(FETCH_MORE_ACTIVITY, {
                    lastSeenId,
                    searchWord: this.searchText
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