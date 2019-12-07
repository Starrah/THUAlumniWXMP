export enum UserStatus {
    None = -1,
    WaitValidate = 0, //等待报名审核
    Joined = 1, //已经报名但是没开始
    Checked = 2, //已经签到
    Finished = 3, //活动正常结束
    Missed = 4,	//各种异常情况，比如审核未通过，活动被举报，自己报名了没签到等
    Refused = 5, // 拒绝
    FinishWithoutCheck = 6, //活动正常结束但是没有签到
    NotChecked = 7,	//已经报名，活动开始，但是没签到//TODO 解决问题
}

export enum UserRole {
    None = -1,
    Common = 0, //一般人
    Manager = 1, //管理员(非创建者)
    Creator = 2, //创建者
}

export var UserStatusShowStrings = [
    "等待管理员审核报名申请",
    "报名成功",
    "未签到",
    "已签到",
    "参加成功",
    "异常情况",
    "审核被拒绝",
    "活动现场没有签到",
];