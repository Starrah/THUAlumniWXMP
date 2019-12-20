<template>
    <view>
        <view class="cu-bar bg-white solid-bottom margin-top">
            <view class="action">
                <text class="cuIcon-title text-green "></text>
                <text class="text-xl">{{activity.name}}</text>
            </view>
        </view>
        <view v-if="result" class="cu-bar bg-white solid-bottom margin-top">
            <view class="action">
                <text class="cuIcon-title text-green "></text>
                <text class="text-xl">由于微信小程序下载的文件不方便您找到存储位置，我们建议您使用手机或电脑浏览器直接下载。请您访问以下链接：</text>
            </view>
        </view>
        <view class="cu-bar bg-white solid-bottom margin-top">
            <view v-if="result" class="action">
                <text class="cuIcon-title text-green "></text>
                <text :selectable="true" class="text-xl">{{fullUrl(result)}}</text>
            </view>
            <view v-else class="action">
                <text class="cuIcon-title text-green "></text>
                <text class="text-xl">正在生成中，请稍等：{{percentageShow}}%</text>
            </view>
        </view>
    </view>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component} from "vue-property-decorator";
    import {ActivitySchema} from "@/apps/typesDeclare/ActivitySchema";
    import apiService from "@/commons/api"
    import {UserRole} from "@/apps/typesDeclare/UserEnum";
    import {fullUrl} from "@/apps/utils/networkUtils";

    @Component
    export default class generateCSV extends Vue{
        name: "generateCSV";
        FM: FileSystemManager;
        status: Array<number> = [0, 0];
        result?: string = null;
        cancelled: boolean = false;
        fullUrl = fullUrl;
        get percentageShow(){
            if(this.status[1] <= 0)return 0;
            else return Math.round(this.status[0]/this.status[1]);
        }
        get activity(){
            return this.$store.state.activityDetail.activity;
        }
        async generate(){
            this.status = [0, this.activity.participants.length];
            let fileName = wx.env.USER_DATA_PATH + "/" + this.activity.name + ".csv";
            let bom = new Uint8Array([239, 187, 191]);//utf-8 bom: 0xefbbbf
            let RoleWords = ["", "管理员", "发起人"];
            let title = "姓名,身份,院系,类型,年级,状态,";
            let userWords = [
                "待审核",
                "未签到",
                "已签到",
                "已签到",
                "异常",
                "被拒绝",
                "未签到",
                "未签到"
            ];
            let result = RoleWords.map((v)=>[]);
            for(let p of this.activity.participants){
                if(this.cancelled)return;
                try {
                    let info: {
                        name: string,
                        campusIdentity: Array<{enrollmentYear: string, enrollmentType: string, department: string}>
                    };
                    try {
                        info = await apiService.get("/userData", {openId: p.openId});
                    }catch(e){}
                    console.log("info", info);
                    let firstIdentity: {enrollmentYear?: string, enrollmentType?: string, department?: string} =
                        info && info.campusIdentity && info.campusIdentity.length > 0 ? info.campusIdentity[0]:{};
                    let line = `${p.name},${RoleWords[p.userRole]},${firstIdentity.department},${firstIdentity.enrollmentType},${firstIdentity.enrollmentYear},${userWords[p.userStatus]},`;
                    result[p.userRole].push(line);
                    console.log("line", line);
                }catch (e) {
                    try {
                        let line =`${p.name},,,,,,`
                    }catch (e) {}
                }
            }
            let toOutput = "";
            toOutput += (title + "\r\n");
            for(let li of result[UserRole.Creator]){
                console.log(li);
                toOutput += (li + "\r\n");
            }
            for(let li of result[UserRole.Manager]){
                toOutput += (li + "\r\n");
            }
            for(let li of result[UserRole.Common]){
                toOutput += (li + "\r\n");
            }
            this.FM.writeFileSync(fileName, bom.buffer, 'binary');
            this.FM.appendFileSync(fileName, toOutput, 'utf-8');
            let absUrl = await new Promise<string>((resolve, reject) => {
                uni.uploadFile({
                    url: apiService.baseUrl + `/uploadImage?session=${apiService.session}`,
                    name: "file",
                    filePath: fileName,
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
            console.log(absUrl);
            this.result = absUrl;
        }
        onLoad(param){
            this.FM = wx.getFileSystemManager()
            this.generate()
        }
        onBackPress(){
            this.cancelled = true;
        }
    }
</script>

<style scoped>

</style>