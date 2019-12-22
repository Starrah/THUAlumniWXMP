<template>
    <view>
        <view class="cu-form-group margin-top">
            <textarea :style="areaHeightCss" maxlength="-1" v-model="desHtml" placeholder="支持有限的html语法，含图片显示、基础的css；但不支持<a>链接跳转、<input>输入等含有交互成分的组件，只支持显示组件。您可自行用其他编辑器编辑html后粘贴到此处。"></textarea>
        </view>
        <br>
        <view style="display: flex;justify-content: space-around;" class="margin-top margin-bottom-xl">
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
        desHtml: string = this.$store.state.activityDetail.activity.description;
        async submit(){
            await this.$store.dispatch(SUBMIT_DESCRIPTION, this.desHtml);
            uni.showToast({title: "成功"});
            uni.navigateBack();
        }
        get areaHeightCss(){
            return `height: ${uni.getSystemInfoSync().windowHeight - 200}px;`;
        }
    }
</script>

<style scoped>

</style>