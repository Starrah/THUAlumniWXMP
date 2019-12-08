<template>
    <text class="text-lg">支持有限的html语法（但不能插入链接跳转等，只能显示）</text>
    <textarea v-model="desHtml"></textarea>
    <button class="cu-btn bg-green lg align-center" @click="submit">提交</button>
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