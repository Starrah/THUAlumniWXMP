import {ActivityCheckStatus} from "../../../apps/typesDeclare/ActivityEnum";
import {ActivityJoinStatus} from "../../../apps/typesDeclare/ActivityEnum";
<template>
    <view>
    <form @submit="submitAdvancedSearch">
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
            <input ref="place" name="place" :value="place"/>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">开始时间</view>
                <text>从</text>
            <picker mode="date" :value="startDate" :start="today" :end="maxDate" @change="startDate = $event.detail.value" name="startDate">
                <view class="picker">
                    {{startDate}}
                </view>
            </picker>
            <picker mode="time" :value="startTime" :start="minStartTime" end="23:59" @change="startTime = $event.detail.value" name="startTime">
                <view class="picker">
                    {{startTime}}
                </view>
            </picker>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">开始时间</view>
                <text>到</text>
                <picker mode="date" :value="startDate2" :start="today" :end="maxDate" @change="startDate2 = $event.detail.value" name="startDate2">
                    <view class="picker">
                        {{startDate2}}
                    </view>
                </picker>
                <picker mode="time" :value="startTime2" :start="minStartTime" end="23:59" @change="startTime2 = $event.detail.value" name="startTime2">
                    <view class="picker">
                        {{startTime2}}
                    </view>
                </picker>
            </view>
        <view class="cu-form-group margin-top">
            <view class="title">结束时间</view>
                <text>从</text>
            <picker mode="date" :value="endDate" :start="startDate" :end="maxDate" @change="endDate = $event.detail.value" name="endDate">
                <view class="picker">
                    {{endDate}}
                </view>
            </picker>
            <picker mode="time" :value="endTime" :start="minEndTime" end="23:59" @change="endTime = $event.detail.value" name="endTime">
                <view class="picker">
                    {{endTime}}
                </view>
            </picker>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">结束时间</view>
                <text>到</text>
                <picker mode="date" :value="endDate2" :start="startDate" :end="maxDate" @change="endDate2 = $event.detail.value" name="endDate2">
                    <view class="picker">
                        {{endDate2}}
                    </view>
                </picker>
                <picker mode="time" :value="endTime2" :start="minEndTime" end="23:59" @change="endTime2 = $event.detail.value" name="endTime2">
                    <view class="picker">
                        {{endTime2}}
                    </view>
                </picker>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">报名开始</view>
            <text>从</text>
            <picker mode="date" :value="signupBeginAtDate" :start="today" :end="startDate" @change="signupBeginAtDate = $event.detail.value" name="signupBeginAtDate">
                <view class="picker">
                    {{signupBeginAtDate}}
                </view>
            </picker>
            <picker mode="time" :value="signupBeginAtTime" start="00:00" end="23:59" @change="signupBeginAtTime = $event.detail.value" name="signupBeginAtTime" style="left: -20px">
                <view class="picker">
                    {{signupBeginAtTime}}
                </view>
            </picker>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">报名开始</view>
                <text>到</text>
                <picker mode="date" :value="signupBeginAtDate2" :start="today" :end="startDate" @change="signupBeginAtDate2 = $event.detail.value" name="signupBeginAtDate2">
                    <view class="picker">
                        {{signupBeginAtDate2}}
                    </view>
                </picker>
                <picker mode="time" :value="signupBeginAtTime2" start="00:00" end="23:59" @change="signupBeginAtTime2 = $event.detail.value" name="signupBeginAtTime2" style="left: -20px">
                    <view class="picker">
                        {{signupBeginAtTime2}}
                    </view>
                </picker>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">报名截止</view>
            <text>从</text>
            <picker mode="date" :value="signupStopAtDate" :start="today" :end="startDate" @change="signupStopAtDate = $event.detail.value" name="signupStopAtDate">
                <view class="picker">
                    {{signupStopAtDate}}
                </view>
            </picker>
            <picker mode="time" :value="signupStopAtTime" start="00:00" end="23:59" @change="signupStopAtTime = $event.detail.value" name="signupStopAtTime" style="left: -20px">
                <view class="picker">
                    {{signupStopAtTime}}
                </view>
            </picker>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">报名截止</view>
                <text>到</text>
                <picker mode="date" :value="signupStopAtDate2" :start="today" :end="startDate" @change="signupStopAtDate2 = $event.detail.value" name="signupStopAtDate2">
                    <view class="picker">
                        {{signupStopAtDate2}}
                    </view>
                </picker>
                <picker mode="time" :value="signupStopAtTime2" start="00:00" end="23:59" @change="signupStopAtTime2 = $event.detail.value" name="signupStopAtTime2" style="left: -20px">
                    <view class="picker">
                        {{signupStopAtTime2}}
                    </view>
                </picker>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">活动状态</view>
            <picker @change="statusGlobal = Number($event.detail.value)" :value="statusGlobal" :range="STATUS_GLOBAL_WORDS">
                <view class="picker">
                    {{STATUS_GLOBAL_WORDS[statusGlobal]}}
                </view>
            </picker>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">报名状态</view>
            <picker @change="statusJoin = Number($event.detail.value)" :value="statusJoin" :range="STATUS_JOIN_WORDS">
                <view class="picker">
                    {{STATUS_JOIN_WORDS[statusJoin]}}
                </view>
            </picker>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">签到状态</view>
            <picker @change="statusCheck = Number($event.detail.value)" :value="statusCheck" :range="STATUS_CHECK_WORDS">
                <view class="picker">
                    {{STATUS_CHECK_WORDS[statusCheck]}}
                </view>
            </picker>
        </view>
        <view class="cu-form-group margin-top">
            <view class="title">报名规则</view>
            <picker @change="ruleForMe = Number($event.detail.value)" :value="ruleForMe" :range="STATUS_RULEFORME_WORDS">
                <view class="picker">
                    {{STATUS_RULEFORME_WORDS[ruleForMe]}}
                </view>
            </picker>
        </view>
        <br>
        <view style="display: flex;justify-content: center">
            <button form-type="submit" class="cu-btn bg-green">提交</button>
        </view>
    </form>
        <SureModal ref="SureModal"></SureModal>
    </view>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component} from 'vue-property-decorator'
    import dateFormat from 'dateformat'
    import delay from 'delay';
    import {
        FETCH_ACTIVITY_TYPE_LIST,
        SET_CHANGE_ACTIVITY,
        SUBMIT_ACTIVITY_CHANGE} from "@/store/action";
    import {withSec} from "@/apps/utils/DateStringFormat";
    import SureModal from "@/components/SureModal.vue";
    import {
        ActivityCheckStatus,
        ActivityJoinStatus,
        ActivityGlobalStatus,
        RuleType
    } from "@/apps/typesDeclare/ActivityEnum";
    import apiService from "../../../commons/api"
    import {fullUrl} from "@/apps/utils/networkUtils";
    import {SET_ADVAN_SEARCH_DATA} from "@/store/mutation";

    @Component({
        components: {SureModal}
    })
    export default class advancedSearch extends Vue{
        name: "advancedSearch";
        DEFAULT_TIMEPICKER_VALUE = "不限";
        activityId: string;
        get today(): string{
            return dateFormat(new Date(), "yyyy-mm-dd")
        }
        activityName: string = "";
        place: string = "";
        minUser: number | string = "";
        maxUser: number | string = "";
        tag: string = "";
        maxDate = "2020-12-31";
        startDate: string = this.DEFAULT_TIMEPICKER_VALUE;
        startTime: string = this.DEFAULT_TIMEPICKER_VALUE;
        endDate: string = this.DEFAULT_TIMEPICKER_VALUE;
        endTime: string = this.DEFAULT_TIMEPICKER_VALUE;
        startDate2: string = this.DEFAULT_TIMEPICKER_VALUE;
        startTime2: string = this.DEFAULT_TIMEPICKER_VALUE;
        endDate2: string = this.DEFAULT_TIMEPICKER_VALUE;
        endTime2: string = this.DEFAULT_TIMEPICKER_VALUE;
        switchSignupBegin: boolean = false;
        switchSignupStop: boolean = false;
        signupBeginAtDate: string = this.DEFAULT_TIMEPICKER_VALUE;
        signupBeginAtTime: string = this.DEFAULT_TIMEPICKER_VALUE;
        signupStopAtDate: string = this.DEFAULT_TIMEPICKER_VALUE;
        signupStopAtTime: string = this.DEFAULT_TIMEPICKER_VALUE;
        signupBeginAtDate2: string = this.DEFAULT_TIMEPICKER_VALUE;
        signupBeginAtTime2: string = this.DEFAULT_TIMEPICKER_VALUE;
        signupStopAtDate2: string = this.DEFAULT_TIMEPICKER_VALUE;
        signupStopAtTime2: string = this.DEFAULT_TIMEPICKER_VALUE;
        typeMultiIndex: Array<number> = [];
        switchCanBeSearched: boolean = true;
        statusJoin: ActivityJoinStatus = 4;
        statusCheck: ActivityCheckStatus = 4;
        statusGlobal: ActivityGlobalStatus = 3;
        ruleForMe: RuleType = 3;
        imageUrl: string = "";
        STATUS_RULEFORME_WORDS = ["可直接加入", "需要审核", "不可加入", "不限"];
        STATUS_GLOBAL_WORDS = ["活动被取消", "活动状态正常", "活动已结束", "不限"];
        STATUS_JOIN_WORDS = ["报名尚未开始", "报名中", "报名已暂停", "报名已截止", "不限"];
        STATUS_CHECK_WORDS = ["签到尚未开始", "签到中", "签到已暂停", "签到已截止", "不限"];
        createDateTime: string = "";
        async chooseImage(){
            uni.showLoading({title: "加载中", mask: true});
            try {
                let path: string = await new Promise((resolve, reject) => {
                    uni.chooseImage({
                        count: 1,
                        sizeType: ["compressed"],
                        sourceType: ["album"],
                        success(res) {
                            resolve(res.tempFiles[0].path);
                        },
                        fail(){
                            reject();
                        }
                    })
                });
                let absUrl = await new Promise<string>((resolve, reject) => {
                    uni.uploadFile({
                        url: apiService.baseUrl + `/uploadImage?session=${apiService.session}`,
                        name: "file",
                        filePath: path,
                        fileType: "image",
                        success(res) {
                            let obj: any = (typeof res.data === "string") ? JSON.parse(res.data) : res.data;
                            if (obj.url) resolve(fullUrl(obj.url));
                            else reject(obj);
                        },
                        fail(e) {
                            reject(e);
                        }
                    })
                });
                console.log(path);
                console.log(absUrl);
                this.imageUrl = absUrl;
            }finally {
                uni.hideLoading()
            }
        }
        get typeMultiData(){
            let temp = this.$store.state.activityTypeList;
            if(!temp.initialized)this.$store.dispatch(FETCH_ACTIVITY_TYPE_LIST);
            let res = [];
            for(let v of temp.types){
                res.push({
                    name: v.name,
                    children: v.children?[{name: "不限"}].concat(v.children):undefined
                })
            }
            res.unshift({name: "不限", children:[{name: "不限"}]});
            if(this.typeMultiIndex.length < temp.level){
                console.log("chdt1", this.typeMultiIndex);
                this.typeMultiIndex = this.typeMultiIndex.concat([0, 0, 0, 0, 0]).slice(0, temp.level);
                console.log("chdt2", this.typeMultiIndex);
            }
            return {types: res};
        }
        get typeMultiArray(){
            let data = this.typeMultiData;
            let res = [];
            let curNode = data.types;
            res.push(curNode.map((v)=>v.name));
            for(let i=0;i<this.typeMultiIndex.length-1;i++){
                curNode = curNode[this.typeMultiIndex[i]].children;
                if(!curNode || curNode.length <= 0)break;
                res.push(curNode.map((v)=>v.name));
            }
            return res;
        }
        typeMultiChange(e){
            console.log(["chan", e.detail.value]);
            this.typeMultiIndex = e.detail.value;
            console.log(["after", this.typeMultiIndex]);
        }
        typeMultiColumnChange(e){
            console.log(["colu", e.detail]);
            let column = e.detail.column;
            if(this.typeMultiIndex[column] === e.detail.value)return;
            let newIndex = [];
            for(let i=0;i<this.typeMultiIndex.length;i++){
                if(i < column)newIndex.push(this.typeMultiIndex[i]);
                else if(i === column)newIndex.push(e.detail.value);
                else newIndex.push(0);
            }
            this.typeMultiIndex = newIndex;
        }
        get typeMultiShowText(){
            console.log(["textbb", this.typeMultiIndex]);
            return this.typeMultiArray.map((nameList, i)=>{
                console.log(["text", nameList, i, this.typeMultiIndex[i]]);
                return nameList[this.typeMultiIndex[i]];
            }).join("-");
        }
        get minStartTime(): string{
            if(this.startDate <= this.today){
                return dateFormat(new Date(), "HH:MM")
            }
            else return "00:00"
        }
        get minEndTime(): string{
            if(this.endDate <= this.startDate){
                return this.startTime
            }
            else return "00:00"
        }
        dateTimeConvert(date, time){
            if(date !== this.DEFAULT_TIMEPICKER_VALUE && time !== this.DEFAULT_TIMEPICKER_VALUE){
                return withSec(date + " " + time);
            }
            else return undefined;
        }
        get typeMultiSubmitText(){
            let res = [];
            let typeMultiArray = this.typeMultiArray;
            for(let i=0;i<typeMultiArray.length - 1;i++){
                let word = typeMultiArray[i][this.typeMultiIndex[i]];
                if(word && word !== "" && word !== "不限"){
                    res.push(word);
                }
            }
            if(res.length <= 0)return undefined;
            else return res.join("-");
        }
        async submitAdvancedSearch(e){
            let formData = e.detail.value;
            console.log(["fd", formData]);
            let data = {
                place: (formData.place && formData.place !== "")?formData.place:undefined,
                startMin: this.dateTimeConvert(this.startDate, this.startTime),
                endMin: this.dateTimeConvert(this.endDate, this.endTime),
                startMax: this.dateTimeConvert(this.startDate2, this.startTime2),
                endMax: this.dateTimeConvert(this.endDate2, this.endTime2),
                signupBeginAtMin: this.dateTimeConvert(this.signupBeginAtDate, this.signupBeginAtTime),
                signupStopAtMin: this.dateTimeConvert(this.signupStopAtDate, this.signupStopAtTime),
                signupBeginAtMax: this.dateTimeConvert(this.signupBeginAtDate2, this.signupBeginAtTime2),
                signupStopAtMax: this.dateTimeConvert(this.signupStopAtDate2, this.signupStopAtTime2),
                type: this.typeMultiSubmitText,
                statusJoin: this.statusJoin !== 4?this.statusJoin:undefined,
                statusCheck: this.statusCheck !== 4?this.statusCheck:undefined,
                statusGlobal: this.statusGlobal !== 3?this.statusGlobal:undefined,
                ruleForMe: this.ruleForMe !== 3?this.ruleForMe:undefined
            };
            this.$store.commit(SET_ADVAN_SEARCH_DATA, data);
            uni.navigateTo({
                url: "/pages/activityList/recommend/recommend?advanced=true"
            })
        }
    }
</script>

<style scoped>
    .cu-form-group .title{
        min-width: calc(4em + 30upx);
    }
    .arrow {
        padding-right: 90upx
    }

    .arrow:before {
        position: absolute;
        right: 30upx;
        display: block;
        width: 30upx;
        height: 30upx;
        color: #8799a3;
        content: "\e6a3";
        text-align: center;
        font-size: 34upx;
        font-family: cuIcon;
        line-height: 30upx
    }
</style>
