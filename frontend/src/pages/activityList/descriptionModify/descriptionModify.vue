<template>
    <view>
        <view class="cu-form-group margin-top">
            <textarea maxlength="-1" v-model="desHtml" placeholder="支持有限的html语法(不能插入链接跳转等，只能显示)"></textarea>
        </view>
        <br>
        <view style="display: flex;justify-content: space-around;">
            <button class="cu-btn bg-green lg align-center" @click="submit">提交</button>
        </view>
    </view>
</template>

<script lang="ts">
    import {Component} from "vue-property-decorator";
    import Vue from "vue";
    import apiService from '../../../commons/api'
    import {SUBMIT_DESCRIPTION} from "@/store/action";

    @Component
    export default class DescriptionModify extends Vue{
        name: "descriptionModify";
        desHtml: string = this.$store.state.activityDetail.description;
        async submit(){
            this.$store.dispatch(SUBMIT_DESCRIPTION, this.desHtml);
        }
    }
</script>

<style scoped>

</style>