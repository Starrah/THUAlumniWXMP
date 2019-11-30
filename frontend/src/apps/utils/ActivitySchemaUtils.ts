import {ActivitySchema} from "@/apps/typesDeclare/ActivitySchema";

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

function assertSameOneSpecificSignupRule() {
    
}

export function assertSameRule(r1: SignupRule, r2: SignupRule) {
    if(r1.ruleType !== r2.ruleType)return false;
    if(r1.accept.length !== r2.accept.length)return false;
    for(let i=0;i<r1.accept.length;i++){
        if()
    }
}