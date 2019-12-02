import {SignupRule} from "@/apps/typesDeclare/SignupRule";

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

export enum RuleType{
    ACCEPT = 0,
    AUDIT = 1,
    REJECT = 2
}

export function ruleDescriptionWord(r: SignupRule) {
    if(r.ruleType === RuleType.ACCEPT){
        if((!r.needAudit || r.needAudit.length === 0) && (!r.reject || r.reject.length === 0))return "所有人均可加入";
        else if ((r.needAudit && r.needAudit.length !== 0) && (!r.reject || r.reject.length === 0))return "部分人需要审核，其余人可加入";
        else if ((!r.needAudit || r.needAudit.length === 0) && (r.reject && r.reject.length !== 0))return "部分人不可加入，其余人可加入";
        else if ((r.needAudit && r.needAudit.length !== 0) && (r.reject && r.reject.length !== 0))return "部分人需要审核或不可加入，其余人可加入";
    }
    else if(r.ruleType === RuleType.AUDIT){
        if((!r.accept || r.accept.length === 0) && (!r.reject || r.reject.length === 0))return "所有人需要审核";
        else if ((r.accept && r.accept.length !== 0) && (!r.reject || r.reject.length === 0))return "部分人可直接加入，其余人需要审核";
        else if ((!r.accept || r.accept.length === 0) && (r.reject && r.reject.length !== 0))return "部分人不可加入，其余人需要审核";
        else if ((r.accept && r.accept.length !== 0) && (r.reject && r.reject.length !== 0))return "部分人可直接加入或不可加入，其余人需要审核";
    }
    else if(r.ruleType === RuleType.REJECT){
        if((!r.needAudit || r.needAudit.length === 0) && (!r.accept || r.accept.length === 0))return "所有人不可加入";
        else if ((r.needAudit && r.needAudit.length !== 0) && (!r.accept || r.accept.length === 0))return "部分人需要审核，其余人不可加入";
        else if ((!r.needAudit || r.needAudit.length === 0) && (r.accept && r.accept.length !== 0))return "部分人可直接加入，其余人不可加入";
        else if ((r.needAudit && r.needAudit.length !== 0) && (r.accept && r.accept.length !== 0))return "部分人可直接加入或需要审核，其余人不可加入";
    }


}