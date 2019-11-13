<script lang="ts">
    import Vue from 'vue';
    import initialGlobalData from './apps/typesDeclare/InitialGlobalData'
    import store from "./store";
    import apiService from "./commons/api";

    apiService.init("aaa", "http://yapi.starrah.cn/mock/11");

    export default Vue.extend({
        globalData: initialGlobalData,
        store,
        mpType: 'app'
    });
</script>

<style>
@import "colorui/main.css";
@import "colorui/icon.css";
</style>
