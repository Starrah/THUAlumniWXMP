<template>
    <view>
    <text class="text-sl">{{$store.state.activityDetail.activity.name}}</text>
    <rich-text :nodes="desHtml"></rich-text>
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