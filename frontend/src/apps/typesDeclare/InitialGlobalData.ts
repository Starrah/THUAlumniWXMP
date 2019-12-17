var DEFAULT_AVATAR_URL;
var DEFAULT_ACTIVITY_URL;

//#ifdef MP-WEIXIN
DEFAULT_AVATAR_URL = "static/male.png";
DEFAULT_ACTIVITY_URL = "static/me.png";
//#endif

//#ifndef MP-WEIXIN
DEFAULT_AVATAR_URL = "/static/male.png";
DEFAULT_ACTIVITY_URL = "/static/me.png";
//#endif



var initialGlobalData: GlobalData = {
    userInfo:{
        "openId":"xxxxx",
        "name": "小明",
        "education": [{
            "type": "under",
            "start": 2013,
            "department": "软件学院",
        }, {
            "type": "master",
            "start": 2017,
            "department": "精仪系",
        }],
        "flag":"unverified",
    },
    session: "bbb",
    baseUrl: "http://thaluapitest.starrah.cn",
    subscribeMessagesIds:{
        normal: ["u-UA76noUE9_9g2ZVX53W9DQKz3x-Tn1914KHphfRXM", "LEoLo9UsF2by_4UGypKf2v7YLXeYRRGGjskOa0iJzZY", "u-UA76noUE9_9g2ZVX53Wz3QZ-IgE4ECwLVxWLIJlZ8"],
        audit: ["u-UA76noUE9_9g2ZVX53W9DQKz3x-Tn1914KHphfRXM", "LEoLo9UsF2by_4UGypKf2v7YLXeYRRGGjskOa0iJzZY", "j9EPrZx9MAQ5SjbN1aCYHImxymn6ZEziJLgQEcbuXSk"]
    },
    devData: {
        DEFAULT_AVATAR_URL,
        DEFAULT_ACTIVITY_URL
    }
};

export default initialGlobalData;