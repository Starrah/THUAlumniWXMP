<template>
    <view class="cu-bar search bg-white">
        <view class="search-form round">
            <text class="cuIcon-search"></text>
            <input :adjust-position="false" type="text" placeholder="搜索活动" confirm-type="search" :value="tempText" @input="onInput" @confirm="onChange" />
            <text v-if="tempText && tempText !== ''" class="cuIcon-roundclose" style="font-size: 36upx;" @click="removeText"></text>
        </view>
        <view class="action">
            <button class="cu-btn bg-green shadow-blur round" @click="onChange">搜索</button>
        </view>
        <slot></slot>
    </view>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Component, Model, Prop} from "vue-property-decorator";

    @Component
    export default class SearchBar extends Vue{
        name: "SearchBar";
        @Prop({type: String, default: ""})value: string;
        tempText: string = "";
        onInput(e){
            this.tempText = e.detail.value;
        }
        removeText(){
            this.tempText = "";
            this.onChange();
        }
        onChange(){
            this.$emit("input", this.tempText);
        }
    }
</script>

<style scoped>

</style>