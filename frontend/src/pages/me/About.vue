<template>
<!--    文案来源：Docs/aboutUs.md，可以用 http://www.bejson.com/convert/html2markdown/ 在线转为html-->
<!--    由于uniapp的编译限制不会自动编译html的h2、ol、li、strong等格式，因此需要使用条件编译。对于微信，需要把要显示html以模版字符串形式存进下面data的html字段去。-->
    <view>
        <!--  #ifndef MP-WEIXIN -->
        <h2>清友约用户使用须知</h2>

        <h3>总则</h3>

        <ol><li>本程序由清华大学学生开发，清华大学校友总会负责运营维护和管理。</li><li>剩下的内容让校友会根据自己的需求写吧</li></ol>

        <h3>使用帮助</h3>

        <p><strong>待补充</strong></p>
        <!--  #endif -->

        <!--  #ifdef MP-WEIXIN -->
        <rich-text :nodes="html"></rich-text>
        <!--  #endif -->
    </view>

</template>

<script>
    export default {
        name: "About",
        data: ()=>{return {html: `
        <h2>清友约用户使用须知</h2>

        <h3>总则</h3>

        <ol><li>本程序由清华大学学生开发，清华大学校友总会负责运营维护和管理。</li><li>剩下的内容让校友会根据自己的需求写吧</li></ol>

        <h3>使用帮助</h3>

        <p><strong>待补充</strong></p>
        `}}
    }
</script>

<style scoped>

</style>