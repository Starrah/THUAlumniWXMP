import {UserRole, UserStatus} from "@/apps/typesDeclare/UserEnum";
import {ActivityGlobalStatus, ActivityCheckStatus, ActivityJoinStatus} from "@/apps/typesDeclare/ActivityEnum";

interface ActivitySchema{
    id: string;
    name: string;
    place: string;
    start: string; //yyyy-mm-dd hh:MM:ss
    end: string; //yyyy-mm-dd hh:MM:ss
    avatarUrl?: string;
    minUser?: number
    maxUser?: number;
    curUser?: number;
    creator?: string;
    signupBeginAt?: string;
    signupStopAt?: string; //yyyy-mm-dd hh:MM:ss
    participants?: Array<{openId: string; userStatus: UserStatus; userRole: UserRole; name:string; avatarUrl: string}>
    type: string;
    statusGlobal: ActivityGlobalStatus;
    statusJoin: ActivityJoinStatus;
    statusCheck: ActivityCheckStatus;
    selfStatus?: UserStatus;
    selfRole?: UserRole;
    canBeSearched: boolean;
    rules: SignupRule;
    ruleForMe?: string;
    needAuditCount?: number;
    tags: Array<string>; // 要求字符串中不能带逗号
    description?: string
}