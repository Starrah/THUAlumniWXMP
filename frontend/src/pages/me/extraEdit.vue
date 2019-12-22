<template>
    <form @submit="submitExtraData">
        <view class="cu-form-group margin-top-sm">
            <view class="title">
                <text class="cuIcon-phone margin-right-xs"></text>
                <text>电话</text>
            </view>
            <input name="phone" maxlength="11" type="number" :value="phone"  />
        </view>
        <view class="cu-form-group margin-top-sm">
            <view class="title">
                <text class="cuIcon-weixin margin-right-xs"></text>
                <text>微信号</text>
            </view>
            <input name="wechat" :value="wechat" maxlength="25" />
        </view>
        <view class="cu-form-group margin-top-sm">
            <view class="title">
                <text class="cuIcon-profile margin-right-xs"></text>
                <text>行业</text>
            </view>
            <input name="trade" :value="trade" maxlength="10" />
        </view>
        <view class="cu-form-group margin-top-sm">
            <view class="title">
                <text class="cuIcon-group margin-right-xs"></text>
                <text>公司</text>
            </view>
            <input name="company" :value="company" maxlength="30" />
        </view>
        <view class="cu-form-group margin-top-sm">
            <view class="title">
                <text class="cuIcon-my margin-right-xs"></text>
                <text>性别</text>
            </view>
            <picker @change="genderIndex = Number($event.detail.value)" :value="genderIndex" :range="GENDER_LIST">
                <view class="picker" style="height: 100upx;">
                    {{GENDER_LIST[genderIndex]}}
                </view>
            </picker>
        </view>
        <view class="cu-form-group margin-top-sm">
            <view class="title">
                <text class="cuIcon-mail margin-right-xs"></text>
                <text>邮箱</text>
            </view>
            <input name="email" :value="email" maxlength="60" />
        </view>
        <view class="cu-form-group margin-top-sm">
            <view class="title">
                <text class="cuIcon-weibo margin-right-xs"></text>
                <text>微博</text>
            </view>
            <input name="weibo" :value="weibo" maxlength="25" />
        </view>
        <view style="display: flex;justify-content: center">
            <button form-type="submit" class="cu-btn bg-green">提交</button>
        </view>
        <SureModal ref="SureModal"></SureModal>
    </form>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component} from "vue-property-decorator";
    import {SUBMIT_EXTRA_DATA} from "@/store/action";
    import SureModal from "@/components/SureModal.vue";
    import delay from "delay";

    @Component({
        components: {SureModal}
    })
    export default class extraEdit extends Vue{
        name: "extraEdit";
        phone: string = "";
        wechat: string = "";
        trade: string = "";
        company: string = "";
        genderIndex: number = 0;
        email: string = "";
        weibo: string = "";
        GENDER_LIST = ["", "男", "女", "其他"];
        showCurrentValue(){
            let data: any = {};
            try {
                data = JSON.parse(this.$store.state.profile.extraData);
            }finally {}
            this.phone = data.phone?data.phone:"";
            this.wechat = data.wechat?data.wechat:"";
            this.trade = data.trade?data.trade:"";
            this.company = data.company?data.company:"";
            this.email = data.email?data.email:"";
            this.weibo = data.weibo?data.weibo:"";
            let genderIndex = this.GENDER_LIST.indexOf(data.gender?data.gender:"");
            this.genderIndex = genderIndex !== -1?genderIndex:0;
        }
        async submitExtraData(e){
            let formData = e.detail.value;
            let data = {
                gender: this.GENDER_LIST[this.genderIndex],
                phone: formData.phone,
                wechat: formData.wechat,
                trade: formData.trade,
                company: formData.company,
                email: formData.email,
                weibo: formData.weibo
            };
            for(let key in data){
                if(!(data[key] && data[key] !== ""))data[key]=undefined;
            }
            await ((this.$refs.SureModal as any).show("您确定要提交对您个人补充信息的修改吗？上述个人补充信息将对您参加的所有活动的管理员可见。"))
            this.$store.dispatch(SUBMIT_EXTRA_DATA, data);
            uni.showToast({title: "操作成功"});
            await delay(1000);
            uni.navigateBack();
        }
        onLoad(param){
            this.showCurrentValue();
        }
    }
</script>

<style scoped>
    .cu-form-group .title{
        min-width: calc(5em + 30upx);
    }
</style>