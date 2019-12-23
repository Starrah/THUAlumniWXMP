<template>
    <view>
        <SearchBar v-model="searchText"></SearchBar>
        <ActivityListShow :list="activities_toShow"></ActivityListShow>
        <view class="cu-load bg-white" :class="isLoadingMore" v-if="isLoadingMore"></view>
    </view>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Watch} from 'vue-property-decorator'
    import {ActivitySchema} from "@/apps/typesDeclare/ActivitySchema";
    import {FETCH_MY_ACTIVITY_LIST} from "@/store/action";
    import initialGlobalData from "@/apps/typesDeclare/InitialGlobalData";
    import {fullUrl} from "@/apps/utils/networkUtils";
    import ActivityListShow from "@/components/ActivityListShow.vue";
    import SearchBar from "@/components/SearchBar.vue";
    @Component({
        components: {SearchBar, ActivityListShow}
    })
    export default class myActivityList extends Vue{
        name!: "myActivityList";
        fullUrl = fullUrl;
        searchText = "";
        @Watch("searchText")onSearchTextChange(newVal){
            this.finalCount = this.DEFAULT_ONCE_SHOW_COUNT;
        }
        get DEFAULT_ACTIVITY_URL(){
            return initialGlobalData.devData.DEFAULT_ACTIVITY_URL;
        }
        pageType: string = "";
        debugCode?:string = "";
        get activities_valid(){
            if(this.pageType === "history")return this.$store.state.myActivityList.history;
            else if (this.pageType === "myParticipate")return this.$store.state.myActivityList.myParticipate;
            else if (this.pageType === "mySponsor")return this.$store.state.myActivityList.mySponsor;
            else return [];
        }
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
        DEFAULT_ONCE_SHOW_COUNT = 15;
        finalCount = this.DEFAULT_ONCE_SHOW_COUNT;
        isLoadingMore: string = null;
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

        onLoad(param){
            this.pageType = param.type;
            if(this.pageType === "history")uni.setNavigationBarTitle({title: "历史记录"});
            else if(this.pageType === "myParticipate")uni.setNavigationBarTitle({title: "我参与的活动"});
            else if(this.pageType === "mySponsor")uni.setNavigationBarTitle({title: "我发起的活动"});
            this.finalCount = this.DEFAULT_ONCE_SHOW_COUNT;
        }
    }
</script>

<style scoped>

</style>