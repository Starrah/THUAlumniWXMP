import {ActivitySchema} from "@/apps/typesDeclare/ActivitySchema";
import {ActivityGlobalStatus, RuleType} from "@/apps/typesDeclare/ActivityEnum";
import {SignupRule} from "@/apps/typesDeclare/SignupRule";

export function defaultBlankActivity(): ActivitySchema {
    return {
        id: "",
        name: "",
        start: "",
        end: "",
        place: "",
        curUser: 0,
        type: "",
        statusGlobal: 0,
        statusCheck: 0,
        statusJoin: 0,
        canBeSearched: true,
        rules: {ruleType: RuleType.AUDIT},
        tags: []
    }
}

function isArrayNotEmpty(a: Array<any>){
    return a && a.length > 0;
}

export function generateRuleDescription(rule: SignupRule){
    if(!rule)return "";
    if(rule.ruleType === RuleType.ACCEPT) {
        if(isArrayNotEmpty(rule.needAudit) && isArrayNotEmpty(rule.reject))return "审核或拒绝指定人，接受其余人";
        else if(!isArrayNotEmpty(rule.needAudit) && isArrayNotEmpty(rule.reject))return "拒绝指定人，接受其余人";
        else if(isArrayNotEmpty(rule.needAudit) && !isArrayNotEmpty(rule.reject))return "审核指定人，接受其余人";
        else if(!isArrayNotEmpty(rule.needAudit) && !isArrayNotEmpty(rule.reject))return "所有人均直接接受";
    }
    if(rule.ruleType === RuleType.AUDIT) {
        if(isArrayNotEmpty(rule.accept) && isArrayNotEmpty(rule.reject))return "接受或拒绝指定人，审核其余人";
        else if(!isArrayNotEmpty(rule.accept) && isArrayNotEmpty(rule.reject))return "拒绝指定人，审核其余人";
        else if(isArrayNotEmpty(rule.accept) && !isArrayNotEmpty(rule.reject))return "接受指定人，审核其余人";
        else if(!isArrayNotEmpty(rule.accept) && !isArrayNotEmpty(rule.reject))return "所有人均需要审核";
    }
    if(rule.ruleType === RuleType.REJECT) {
        if(isArrayNotEmpty(rule.needAudit) && isArrayNotEmpty(rule.accept))return "接受或审核指定人，拒绝其余人";
        else if(!isArrayNotEmpty(rule.needAudit) && isArrayNotEmpty(rule.accept))return "接受指定人，拒绝其余人";
        else if(isArrayNotEmpty(rule.needAudit) && !isArrayNotEmpty(rule.accept))return "审核指定人，拒绝其余人";
        else if(!isArrayNotEmpty(rule.needAudit) && !isArrayNotEmpty(rule.accept))return "所有人均拒绝";
    }
}

export function isOfficial(activity: ActivitySchema){
    return activity.type && activity.type.substr(0, 4) === "官方活动" && (activity.statusGlobal === ActivityGlobalStatus.Normal || activity.statusGlobal === ActivityGlobalStatus.Finish);
}

export function fillExtraDataObj(obj){
    let keysList = ["phone", "wechat", "trade", "company", "gender", "email", "weibo"];
    let newObj = {};
    for(let key of keysList){
        newObj[key] = obj[key] || "";
    }
    return newObj;
}