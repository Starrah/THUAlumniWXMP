import {RuleType} from "@/apps/typesDeclare/ActivityEnum";

interface SignupRule {
    ruleType: RuleType;
    accept?: Array<OneSpecificSingupRule>;
    needAudit?: Array<OneSpecificSingupRule>;
    reject?: Array<OneSpecificSingupRule>;
}

interface OneSpecificSingupRule{
    enrollmentType?: string;
    minEnrollmentYear?: number;
    maxEnrollmentYear?: number;
    department?: string
}
