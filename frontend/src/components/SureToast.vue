<template>
    <view class="cu-modal" :class="isShowing?'show':''">
        <view class="cu-dialog" style="height: 50%;">
            <scroll-view class="padding-xl" style="height: 80%">
                <text>{{content}}</text>
            </scroll-view>
            <view class="flex justify-around">
                <button class="cu-btn bg-green" @click="onPressOK">确定</button>
                <button class="cu-btn bg-red" @click="onPressCancel">取消</button>
            </view>
        </view>
    </view>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Component, Prop} from "vue-property-decorator";

    interface SureToastInterface{
        show(content: string);
    }

    @Component
    export default class SureToast extends Vue implements SureToastInterface{
        name: "SureToast";
        content: string = "";
        isShowing: boolean = false;
        resolv: Function = null;
        rejec: Function = null;
        onPressOK(){
            this.isShowing = false;
            this.resolv();
            console.log("OK")
        }
        onPressCancel(){
            this.isShowing = false;
            this.rejec();
            console.log("cancel");
        }

        async show(content: string){
            content = content || "您确定要进行此操作吗？";
            this.content = content;
            this.isShowing = true;
            return new Promise((resolve, reject) => {
                this.resolv = resolve;
                this.rejec = reject;
            })
        }

    }
</script>

<style scoped>

</style>