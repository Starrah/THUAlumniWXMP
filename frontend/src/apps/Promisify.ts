class CorrectedRequestSuccessCallbackResult{
    data?: string | any | ArrayBuffer;
    statusCode?: number;
    header?: any;
    constructor(data, statusCode, header){
        this.data = data;
        this.statusCode = statusCode;
        this.header = header
    }
}

class Promisify{
    async request(options?:RequestOptions){
        if(options.url.indexOf("?") == -1){
            options.url = options.url + "?session=" + (getApp().globalData as GlobalData).session
        }else{
            options.url = options.url + "&session=" + (getApp().globalData as GlobalData).session
        }
        let raw = await new Promise<RequestSuccessCallbackResult>((resolve, reject)=>{
            options["success"] = resolve;
            options["fail"] = reject;
            uni.request(options)
        });
        if(raw.statusCode >= 400){
            if(raw.data && typeof(raw.data) === 'object' && raw.data.errid && raw.data.errid >= 500 && raw.data.errid <= 599) {
                uni.showToast({
                    title: raw.data.errmsg || "发生错误，请稍后重试",
                    icon: "none"
                });
            }
            throw raw;
        }
        return new CorrectedRequestSuccessCallbackResult(raw.data, raw.statusCode, raw.header)
    }
}

const promisify: Promisify = new Promisify();
export default promisify