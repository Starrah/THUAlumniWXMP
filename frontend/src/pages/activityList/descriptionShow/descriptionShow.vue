<template>
    <view>
        <view class="cu-bar bg-white solid-bottom margin-top">
            <view class="action">
                <text class="cuIcon-title text-green "></text>
                <text class="text-xl text-bold">{{$store.state.activityDetail.activity.name}}</text>
            </view>
        </view>
        <view class="cu-card dynamic">
            <view class="cu-item shadow">
                <view class="cu-list menu-avatar bg-gray">
                    <rich-text :nodes="desHtml"></rich-text>
                 </view>
            </view>
        </view>
    </view>
</template>

<script lang="ts">
    import {Component} from "vue-property-decorator";
    import Vue from "vue";
    import apiService from '../../../commons/api'

    @Component
    export default class DescriptionShow extends Vue{
        name: "descriptionShow";
        get desHtml(){
            return this.$store.state.activityDetail.activity.description;
        }
    }
</script>

<style scoped>

</style>