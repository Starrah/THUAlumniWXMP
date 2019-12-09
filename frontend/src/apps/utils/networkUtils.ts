import apiService from '../../commons/api'

export function fullUrl(s: string): string{
    if(s.indexOf("://") !== -1)return s;
    else {
        let firstDot = s.indexOf(".");
        let firstSlash = s.indexOf("/");
        if (firstDot === -1 || firstDot > firstSlash) {
            s = apiService.baseUrl + s;
        }
        return s;
    }
}