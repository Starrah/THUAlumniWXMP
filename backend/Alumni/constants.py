class Constants:
    UNDEFINED_NUMBER = -1
    ACTIVITY_STATUS_EXCEPT = 0
    ACTIVITY_STATUS_BEFORESIGNUP = 1
    ACTIVITY_STATUS_SIGNUP = 2
    ACTIVITY_STATUS_SIGNUPPAUSED = 3
    ACTIVITY_STATUS_SIGNUPSTOPPED = 4
    ACTIVITY_STATUS_SIGNIN = 5
    ACTIVITY_STATUS_SIGNINPAUSED = 6
    ACTIVITY_STATUS_FINISH = 7

    USER_STATUS_WAITVALIDATE = 0
    USER_STATUS_JOINED = 1
    USER_STATUS_NOTCHECKED = 2
    USER_STATUS_CHECKED = 3
    USER_STATUS_FINISHED = 4
    USER_STATUS_MISSED = 5

    USER_ROLE_COMMON = 0
    USER_ROLE_MANAGER = 1
    USER_ROLE_CREATOR = 2

    ERROR_CODE_NOT_STORED = 101
    ERROR_CODE_UNKNOWN = 500
    ERROR_CODE_LOGIN_ERROR = 501
    ERROR_CODE_INVALID_PARAMETER = 502
    ERROR_CODE_NOT_FOUND = 503
    ERROR_CODE_INVALID_CHANGE = 504
    ERROR_CODE_LACK_ACCESS = 505
