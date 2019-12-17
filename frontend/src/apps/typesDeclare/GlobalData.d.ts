interface GlobalData {
    userInfo: UserInfo
    session: string
    baseUrl: string
    subscribeMessagesIds: {normal: Array<string>, audit: Array<string>}
    devData: any
}
