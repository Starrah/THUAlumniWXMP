export enum ActivityGlobalStatus {
    Except = 0, //异常情况（如活动被主动取消\管理员禁止等）
    Normal = 1, //正常情况
    Finish = 2 //活动已结束
}

export enum ActivityJoinStatus{
    Before = 0,
    Continue = 1,
    Paused = 2,
    Stopped = 3
}

export enum ActivityCheckStatus{
    Before = 0,
    Continue = 1,
    Paused = 2,
    Stopped = 3
}

// export var ActivityStatusShowStrings = [
//     "活动被取消",
//     "报名尚未开始",
//     "报名中",
//     "报名暂停",
//     "报名已截止",
//     "可以签到",
//     "签到停止",
//     "已结束"
// ];

