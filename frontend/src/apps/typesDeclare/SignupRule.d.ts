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



declare enum RuleType{
    ACCEPT = 0,
    AUDIT = 1,
    REJECT = 2
}