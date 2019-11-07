<template>
    <view>
    <view class="cu-bar bg-white">
<!--        <view class="action">-->
<!--            <text class="cuIcon-back text-gray"></text> 返回-->
<!--        </view>-->
        <view class="content text-bold">
            发起活动
        </view>
    </view>
    <form @submit="submitNewActivity">
        <view class="cu-form-group margin-top-sm">
            <view class="title">活动名称</view>
            <input name="name" />
        </view>
        <view class="cu-form-group margin-top-sm">
            <view class="title">活动类型</view>
            <picker mode="multiSelector" @change="typeMultiChange" @columnchange="typeMultiColumnChange" :value="typeMultiIndex" :range="typeMultiArray" name="type">
                <view class="picker">
                    {{typeMultiShowText}}
                </view>
            </picker>
        </view>
        <view class="cu-form-group margin-top-sm">
            <view class="title">地点</view>
            <input name="place" />
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">开始时间</view>
            <picker mode="date" :value="startDate" :start="today" :end="maxDate" @change="onStartDateChange" name="startDate">
                <view class="picker">
                    {{startDate}}
                </view>
            </picker>
            <picker mode="time" :value="startTime" start="00:00" end="23:59" @change="onStartTimeChange" name="startTime">
                <view class="picker">
                    {{startTime}}
                </view>
            </picker>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">结束时间</view>
            <picker mode="date" :value="endDate" :start="startDate" :end="maxDate" @change="onEndDateChange" name="endDate">
                <view class="picker">
                    {{endDate}}
                </view>
            </picker>
            <picker mode="time" :value="endTime" :start="minStartTime" end="23:59" @change="onEndTimeChange" name="endTime">
                <view class="picker">
                    {{endTime}}
                </view>
            </picker>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">人数</view>
            <input name="minUser" style="text-align: right" />
            <text style="font-size: 30upx" class="margin-lr-lg">~</text>
            <input name="maxUser" />
        </view>
        <view style="display: flex;justify-content: center">
            <button form-type="submit" class="cu-btn bg-green">提交</button>
        </view>
    </form>
    </view>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component} from 'vue-property-decorator'
    import dateFormat from 'dateformat'
    import promisify from '../../apps/Promisify'
    import delay from 'delay';
    @Component
    export default class newActivity extends Vue{
        name: "newActivity";
        get today(): string{
            return dateFormat(new Date(), "yyyy-mm-dd")
        }
        maxDate = "2020-12-31";
        startDate: string = "请选择";
        startTime: string = "请选择";
        endDate: string = "请选择";
        endTime: string = "请选择";
        typeMultiData: Array<{name: string, children: Array<{name: string, children?: any}>}> = [];
        typeMultiIndex: Array<number> = [];
        typeMultiArray: Array<Array<string>> = [];
        updateTypeMultiData(){
            this.typeMultiData = [
                {
                    name: "个人活动",
                    children: [
                        {
                            name: "聚餐"
                        },
                        {
                            name: "唱歌"
                        },
                        {
                            name: "跑步"
                        }
                    ]
                },
                {
                    name:"班级活动",
                    children: [
                        {
                            name: "聚餐"
                        },
                        {
                            name: "唱歌"
                        },
                        {
                            name: "跑步"
                        }
                    ]
                }
            ];
            this.typeMultiArray[0] = this.typeMultiData.map((v)=>v.name);
            this.typeMultiArray[1] = this.typeMultiData[0].children.map((v)=>v.name);
            this.typeMultiIndex = [0, 0];
        }
        typeMultiChange(e){
            this.typeMultiIndex = e.detail.value
        }
        typeMultiColumnChange(e){
            let data = {
                index: this.typeMultiIndex,
                array: this.typeMultiArray
            };
            let column = e.detail.column;
            data.index[column] = e.detail.value;
            if(column === 0){
                data.array[1] = this.typeMultiData[data.index[column]].children.map((v)=>v.name)
                data.index[1] = 0
            }
            this.typeMultiIndex = data.index;
            this.typeMultiArray = data.array;
        }
        get typeMultiShowText(){
            let r = "";
            for(let i=0;i<this.typeMultiIndex.length-1;i++){
                r += (this.typeMultiArray[i][this.typeMultiIndex[i]] + " - ");
            }
            let i = this.typeMultiIndex.length-1;
            r += this.typeMultiArray[i][this.typeMultiIndex[i]];
            return r;
        }
        get minStartTime(): string{
            if(this.endDate <= this.startDate){
                return this.startTime
            }
            else return "00:00"
        }
        onStartDateChange(e){
            console.log("qwq");
            this.startDate = e.detail.value
        }
        onStartTimeChange(e){
            this.startTime = e.detail.value
        }
        onEndDateChange(e){
            this.endDate = e.detail.value
        }
        onEndTimeChange(e){
            this.endTime = e.detail.value
        }
        async submitNewActivity(e){
            console.log(e.detail.value);
            let formData = e.detail.value;
            let res = await promisify.request({
                url: getApp().globalData.baseUrl + `/createActivity`,
                method: "POST",
                dataType: "json",
                data: {
                    name: formData.name,
                    place: formData.place,
                    start: this.startDate + " " + this.startTime + ":00",
                    end: this.endDate + " " + this.endTime + ":00",
                    type: this.typeMultiArray[0][this.typeMultiIndex[0]] + "-" + this.typeMultiArray[1][this.typeMultiIndex[1]],
                    maxUser: formData.maxUser?Number.parseInt(formData.maxUser):undefined,
                    minUser: formData.minUser?Number.parseInt(formData.minUser):undefined,
                    status: 2,
                    canBeSearched: true
                }
            });
            console.log(res.data);
            uni.showToast({title: "成功", icon: "none"});
            await delay(1000);
            uni.navigateTo({
                url: `../activityList/activityDetail/activityDetail?activityId=${res.data.id}`
            })
        }
        mounted(){
            this.updateTypeMultiData();
        }
    }
</script>

<style scoped>
</style>