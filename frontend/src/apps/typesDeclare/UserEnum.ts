export enum UserStatus {
    WaitValidate = 0, //等待报名审核
    Joined = 1, //已经报名但是没开始
    NotChecked = 2,	//已经报名，活动开始，但是没签到
    Checked = 3, //已经签到
    Finished = 4, //活动正常结束
    Missed = 5,	//各种异常情况，比如审核未通过，活动被举报，自己报名了没签到等
}

export enum UserRole {
    Common = 0, //一般人
    Manager = 1, //管理员(非创建者)
    Creator = 2, //创建者
}