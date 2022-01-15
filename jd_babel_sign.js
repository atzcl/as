/**
cron 0 0,3 * * * jd_babel_sign.js
入口：主页-秒杀-狂撒三亿京豆
TG频道：https://t.me/sheeplost
*/
const $ = new Env('通天塔签到共建');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '';
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    });
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
    let cookiesData = $.getdata('CookiesJD') || "[]";
    cookiesData = jsonParse(cookiesData);
    cookiesArr = cookiesData.map(item => item.cookie);
    cookiesArr.reverse();
    cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
    cookiesArr.reverse();
    cookiesArr = cookiesArr.filter(item => item !== "" && item !== null && item !== undefined);
}
!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
        return;
    }
    for (let i = 0; i < cookiesArr.length; i++) {
        UA = `jdapp;iPhone;10.0.8;14.6;${uuidRandom()};network/wifi;JDEbook/openapp.jdreader;model/iPhone9,2;addressid/2214222493;appBuild/168841;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16E158;supportJDSHWK/1`;
        if (cookiesArr[i]) {
            cookie = cookiesArr[i];
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';
            await TotalBean();
            console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });

                if ($.isNode()) {
                    await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                }
                continue
            }
            await main();
        }
    }
})().catch((e) => { $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '') }).finally(() => { $.done(); })

async function main() {
    let activeIdInfo = await activeId();
    if (activeIdInfo) {
        e = JSON.parse(activeIdInfo.activityData.floorList[2].boardParams.interaction);
        // let queryInteractiveInfo = await task('queryInteractiveInfo', { "encryptProjectId": e.encryptProjectId, "encryptAssigmentIds": [e.encryptAssignmentId], "ext": { "rewardEncryptAssignmentId": e.encryptAssignmentId, "timesEncryptAssignmentId": e.encryptAssignmentId, "needNum": 50 }, "sourceCode": "aceaceqingzhan" });
        if (e) {
            let taskInfo = await task('doInteractiveAssignment', { "encryptProjectId": e.encryptProjectId, "encryptAssignmentId": e.encryptAssignmentId, "completionFlag": true, "itemId": "1", "sourceCode": "aceaceqingzhan" });
            if (taskInfo.code === "0" && taskInfo.subCode === "0") {
                console.log(JSON.stringify(taskInfo.rewardsInfo.successRewards));
            } else { console.log(JSON.stringify(taskInfo)) }
        } else {
            console.log('没有获取到活动ID')
        }
    } else { console.log('没有获取到活动信息！') };
}
function task(functionId, body) {
    let opt = {
        url: `https://api.m.jd.com/client.action?functionId=${functionId}&appid=babelh5&sign=11&t=${new Date().getTime()}`,
        body: `body=${encodeURIComponent(JSON.stringify(body))}`,
        headers: {
            "Host": "api.m.jd.com",
            "Content-Type": "application/x-www-form-urlencoded",
            "Origin": "https://prodev.m.jd.com",
            "Accept-Encoding": "gzip, deflate, br",
            "Cookie": cookie,
            "Connection": "keep-alive",
            "Accept": "*/*",
            "User-Agent": UA,
            "Referer": "https://prodev.m.jd.com/mall/active/dHKkhs2AYLCeCH3tEaHRtC1TnvH/index.html",
            "Content-Length": "270",
            "Accept-Language": "zh-cn",
        },
    }
    return new Promise(resolve => {
        $.post(opt, (err, resp, data) => {
            try {
                if (err) {
                    console.log(err)
                } else {
                    data = JSON.parse(data);
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve(data);
            }
        })
    })
}
function uuidRandom() {
    return Math.random().toString(16).slice(2, 10) +
        Math.random().toString(16).slice(2, 10) +
        Math.random().toString(16).slice(2, 10) +
        Math.random().toString(16).slice(2, 10) +
        Math.random().toString(16).slice(2, 10);
}
function activeId() {
    return new Promise((resolve) => {
        const option = {
            url: 'https://prodev.m.jd.com/mall/active/dHKkhs2AYLCeCH3tEaHRtC1TnvH/index.html',
            headers: {
                "Host": "prodev.m.jd.com",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Cookie": cookie,
                "User-Agent": UA,
                "Accept-Language": "zh-cn",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
            },
        }
        $.get(option, (err, resp, data) => {
            try {
                data = JSON.parse(data.match(/window.__react_data__ = (.*);/)[1]);
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        });
    })
}
function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function TotalBean() { return new Promise(async e => { const n = { url: "https://wq.jd.com/user_new/info/GetJDUserInfoUnion?sceneval=2", headers: { Host: "wq.jd.com", Accept: "*/*", Connection: "keep-alive", Cookie: cookie, "User-Agent": UA, "Accept-Language": "zh-cn", Referer: "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&", "Accept-Encoding": "gzip, deflate, br" } }; $.get(n, (n, o, a) => { try { if (n) $.logErr(n); else if (a) { if (1001 === (a = JSON.parse(a))["retcode"]) return void ($.isLogin = !1); 0 === a["retcode"] && a.data && a.data.hasOwnProperty("userInfo") && ($.nickName = a.data.userInfo.baseInfo.nickname), 0 === a["retcode"] && a.data && a.data["assetInfo"] && ($.beanCount = a.data && a.data["assetInfo"]["beanNum"]) } else console.log("京东服务器返回空数据") } catch (e) { $.logErr(e) } finally { e() } }) }) }
