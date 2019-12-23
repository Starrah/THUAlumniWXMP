import apiService from '../../commons/api'

export function fullUrl(s: string): string{
    if(!s)return s;
    if(s.indexOf("://") !== -1)return s;
    else {
        let firstSlash = s.indexOf("/");
        if (firstSlash === 0) {
            s = apiService.baseUrl + s;
        }
        return s;
    }
}

export function handleNetExcept(e: any, rethrow?: boolean){
    if(e) {
        if (e.errMsg && e.errMsg.indexOf("request:fail") !== -1) {
            uni.showToast({
                title: "网络连接失败，请检查您的网络",
                icon: "none"
            })
        } else if (e.errid && e.errid >= 500 && e.errid <= 599) {
            uni.showToast({
                title: e.errmsg,
                icon: "none"
            })
        }
    }
    if(rethrow)throw e;
}