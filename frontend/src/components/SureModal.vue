<template>
    <view class="cu-modal" :class="isShowing?'show':''">
        <view class="cu-dialog">
            <scroll-view style=" padding-top: 20px ; padding-bottom: 10px">
                <text>{{content}}</text>
            </scroll-view>
            <view class="flex justify-around" style="padding-top: 10px">
                <button class="cu-btn bg-green" @click="onPressOK">确定</button>
                <button class="cu-btn bg-red" @click="onPressCancel">取消</button>
            </view>
            <br>
        </view>
    </view>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Component, Prop} from "vue-property-decorator";

    @Component
    export default class SureModal extends Vue{
        name: "SureModal";
        content: string = "";
        isShowing: boolean = false;
        resolv: Function = null;
        rejec: Function = null;
        onPressOK(){
            this.isShowing = false;
            this.resolv();
        }
        onPressCancel(){
            this.isShowing = false;
            this.rejec();
        }

        async show(content: string, title?: string){
            title = title || "提示";
            content = content || "您确定要进行此操作吗？";
            return new Promise((resolve, reject) => {
                uni.showModal({
                    title: title,
                    content: content,
                    success(res) {
                        if (res.confirm) resolve();
                        else reject();
                    }
                })
            });
            // this.content = content;
            // this.isShowing = true;
            // return new Promise((resolve, reject) => {
            //     this.resolv = resolve;
            //     this.rejec = reject;
            // })
        }
    }
</script>

<style scoped>

</style>