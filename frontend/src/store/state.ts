export class AppState {
  userInfo: object = {
    openId :"xxxxx",
    name : "小明",
    education : [{
        type: "under",
        start: 2013,
        department: "软件学院",
    }, {
        type: "master",
        start: 2017,
        department: "精仪系",
    }],
    flag:"unverified",
  };
  session: string = "aaa";
  baseUrl: string = "http://thalu.starrah.cn";
  devData: object = {}
}