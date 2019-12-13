import apiService from '../../commons/api'

export function fullUrl(s: string): string{
    if(s.indexOf("://") !== -1)return s;
    else {
        let firstSlash = s.indexOf("/");
        if (firstSlash === 0) {
            s = apiService.baseUrl + s;
        }
        return s;
    }
}