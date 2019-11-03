<script lang="ts">
    import Vue from 'vue';
    export default Vue.extend({
        globalData: {
            "openid":"xxxxx",
            "name": "小明",
            "education": [{
                "type": "under",
                "start": "2013",
                "department": "软件学院",
            }, {
                "type": "master",
                "start": "2017",
                "department": "精仪系",
            }],
            "flag":"unverified",
            baseUrl: "http://thaluapitest.starrah.cn",
            openId: ""
        },
        onLaunch() {
            console.log('App Launch')
        },
        onShow() {
            console.log('App Show')
        },
        onHide() {
            console.log('App Hide')
        }
    });
</script>

<style>
@import "colorui/main.css";
@import "colorui/icon.css";
</style>
