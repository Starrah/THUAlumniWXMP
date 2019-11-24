class ApiService {
    session: string;
    baseUrl: string;

    init(session: string, baseUrl: string) {
        this.session = session;
        this.baseUrl = baseUrl;
    }

    async request(method: "GET" | "POST" | "PUT" | "DELETE", resource: string, param: object = {}) {
        let res = await new Promise((resolve, reject) => {
            let url = this.baseUrl.includes("?")?this.baseUrl + resource + "&session=" + this.session:this.baseUrl + resource + "?session=" + this.session;
            uni.request({
                url,
                method: method,
                dataType: "json",
                data: param,
                success: resolve,
                fail: reject
            });
        });
        let code = res["statusCode"];
        let data = res["data"];
        if (code >= 400) throw data;
        return data;
    }

    get(resource: string, param: object = {}) {
        return this.request("GET", resource, param);
    }

    post(resource: string, param: object = {}) {
        return this.request("POST", resource, param);
    }

    put(resource: string, param: object = {}) {
        return this.request("PUT", resource, param);
    }

    delete(resource: string, param: object = {}) {
        return this.request("DELETE", resource, param);
    }

}

export default new ApiService();