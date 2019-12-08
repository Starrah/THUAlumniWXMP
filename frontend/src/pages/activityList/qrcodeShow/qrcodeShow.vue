<template>
    <view>
    <text class="text-sl">{{$store.state.activityDetail.activity.name}}</text>
    <img :src="imageSrc" alt="加载中，请稍候" />
    </view>
</template>

<script lang="ts">
    import {Component} from "vue-property-decorator";
    import Vue from "vue";
    import apiService from '../../../commons/api'

    @Component
    export default class QrcodeShow extends Vue{
        name: "qrcodeShow";
        imageSrc: string = "";
        async downloadQRCode(){
            uni.downloadFile({
                url: apiService.baseUrl + "/generateCheckinCode"  + `?session=${apiService.session}&activityId=${this.$store.state.activityDetail.activity.id}`,
                success: (result)=>{
                     this.imageSrc = result.tempFilePath;
                }
            })
        }
        mounted(){
            this.downloadQRCode()
        }
    }
</script>

<style scoped>

</style>