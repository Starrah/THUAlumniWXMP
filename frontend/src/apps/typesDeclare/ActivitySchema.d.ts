import {UserRole, UserStatus} from "@/apps/typesDeclare/UserEnum";
import {ActivityStatus} from "@/apps/typesDeclare/ActivityEnum";

interface ActivitySchema{
    id: string,
    name: string,
    place: string,
    start: string, //yyyy-mm-dd hh:MM:ss
    end: string, //yyyy-mm-dd hh:MM:ss
    minUser?: number
    maxUser?: number,
    curUser: number,
    creator: string,
    signupBeginAt?: string,
    signupStopAt?: string, //yyyy-mm-dd hh:MM:ss
    participants?: Array<{openId: string, userStatus: UserStatus, userRole: UserRole, name:string, avatarUrl: string}>
    type: string,
    status: ActivityStatus,
    canBeSearched: boolean,
    rules?: SignupRule
}