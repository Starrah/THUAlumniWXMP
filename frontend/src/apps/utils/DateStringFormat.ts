export function withoutSec(str) {
    if(!str)return str;
    let arr = str.split(' ');
    let res = "";
    for(let part of arr){
        if(part.indexOf(":") !== -1 && part.length > 5){
            res += part.substr(0,5);
        }
        else{
            res += part;
        }
        res += " "
    }
    return res.trimRight()
}

export function withSec(str) {
    if(!str)return str;
    let arr = str.split(' ');
    let res = "";
    for(let part of arr){
        if(part.indexOf(":") !== -1 && part.length <= 5){
            res += (part + ":00");
        }
        else{
            res += part;
        }
        res += " "
    }
    return res.trimRight();
}

export function isDateTimePast(dateTime: string | Date, comparedTo?: string | Date | undefined) {
    if(!comparedTo)comparedTo = new Date();
    else if(typeof comparedTo === "string")comparedTo = new Date(Date.parse(comparedTo.replace(/-/, "/")))
    if(typeof dateTime === "string")dateTime = new Date(Date.parse(dateTime.replace(/-/, "/")))
    return dateTime < comparedTo;
}