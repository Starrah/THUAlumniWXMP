import {ActivitySchema} from "@/apps/typesDeclare/ActivitySchema";
import {RuleType} from "@/apps/typesDeclare/ActivityEnum";

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

