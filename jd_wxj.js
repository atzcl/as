/*
入口 京东 我的 全民挖现金
运行一次查看邀请码 变量你的邀请码
export shareCode="FCD4A7E5CB4AF69377D77E9B4553CF6CAD1DAAB9A3E3F6CBAFDE81EEB7393333"
[task_local]
0 10 * * *
*/

const $ = new Env('柠檬全民挖现金');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';

//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;
let allMessage = '';
let shareCode = '';
if (process.env.SHARECODE_WXJ) {
    shareCode = process.env.SHARECODE_WXJ;
}
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_WXJ && process.env.JD_WXJ === 'false') process.exit(0)
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
const JD_API_HOST = 'https://api.m.jd.com/client.action';

!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
        return;
    }

    for (let i = 0; i < cookiesArr.length; i++) {
        if (cookiesArr[i]) {
            cookie = cookiesArr[i];
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';
            message = '';
            await TotalBean();
            console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });

                if ($.isNode()) {
                    await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                }
                continue
            }
            await list1()
            await info()
            await help()
            if (process.env.HELPAUTHOR_WXJ && process.env.HELPAUTHOR_WXJ === 'false') {
                await dslq()
            } else {
                await helpAuthor()
                await dslq()
            }
        }
    }
    if ($.isNode() && allMessage) {
        await notify.sendNotify(`${$.name}`, `${allMessage}`)
    }
})()
    .catch((e) => {
        $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
        $.done();
    })
function list1() {
    return new Promise(async (resolve) => {

        let options = {
            url: `https://api.m.jd.com/client.action`,

            body: `functionId=tc_taskList&body={"appId":"1EFRSww"}&client=wh5&clientVersion=1.0.0&osVersion=14.3&uuid=6898c30638c55142969304c8e2167997fa59eb51`,
            headers: {
                "Origin": "https://h5.m.jd.com",
                "Host": "api.m.jd.com",
                "User-Agent": "jdltapp;iPhone;3.3.6;14.3;75aeceef3046d8ce11d354ff89af9517a2e4aa18;network/wifi;hasUPPay/0;pushNoticeIsOpen/0;lang/zh_CN;model/iPhone9,2;addressid/;hasOCPay/0;appBuild/1060;supportBestPay/0;pv/56.42;apprpd/;ref/JDLTSubMainPageViewController;psq/38;ads/;psn/75aeceef3046d8ce11d354ff89af9517a2e4aa18|99;jdv/0|kong|t_1001003207_1762319_6901310|jingfen|30578707801140d09fcd54e5cd83bbf7|1621510932517|1621511027;adk/;app_device/IOS;pap/JA2020_3112531|3.3.6|IOS 14.3;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
                "Cookie": cookie,
            }
        }

        $.post(options, async (err, resp, data) => {
            try {

                data = JSON.parse(data);
                if (data.data.bizCode == 0) {
                    let taskList = data.data.result.taskVos[0].shoppingActivityVos
                    for (let i = 0; i < taskList.length; i++) {
                        taskToken = taskList[i].taskToken
                        await dotask(taskToken)
                        await task(1)
                        //await task(2)
                    }
                    let taskList1 = data.data.result.taskVos[1].shoppingActivityVos
                    for (let i = 0; i < taskList1.length; i++) {
                        taskToken = taskList1[i].taskToken
                        await dotask(taskToken)
                        //await task(1)
                        await task(2)
                    }


                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}


function help() {
    return new Promise(async (resolve) => {

        let options = {
            url: `https://api.m.jd.com/client.action`,

            body: `functionId=help_activity&body={"shareCode":"${shareCode}","name":"","imageUrl":""}&client=wh5&clientVersion=1.0.0&osVersion=10&uuid=7049442d7e415232`,
            headers: {
                "Origin": "https://h5.m.jd.com",
                "Host": "api.m.jd.com",
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
                "Cookie": "cuid=eidIe2798122d1s4GEix%252FuspRjy92JqJ273YghhIs3JZdi%252F4JjftGCWZOLgY3glC5gGXsTY1vGLRKckMeHq2opKqTBNLiayOHJtx2EhExIqlbarZpTFa;" + cookie,
            }
        }
        $.post(options, async (err, resp, data) => {
            try {
                data = JSON.parse(data);
                if (data.ret == 0) {
                    $.log("\n助力：" + data.helpAmount * 0.01)
                } else if (data.ret == 2) {
                    $.log(`\n${data.msg}`)
                } else if (data.ret == 7) {
                    $.log(`\n${data.msg}`)
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

function dotask(taskToken) {
    return new Promise(async (resolve) => {

        let options = {
            url: `https://api.m.jd.com/client.action `,

            body: `functionId=tc_doTask&body={"taskToken":"${taskToken}"}&client=wh5&clientVersion=1.0.0&osVersion=14.3&uuid=6898c30638c55142969304c8e2167997fa59eb51`,
            headers: {
                "Origin": "https://h5.m.jd.com",
                "Host": "api.m.jd.com",
                "User-Agent": "jdltapp;iPhone;3.3.6;14.3;75aeceef3046d8ce11d354ff89af9517a2e4aa18;network/wifi;hasUPPay/0;pushNoticeIsOpen/0;lang/zh_CN;model/iPhone9,2;addressid/;hasOCPay/0;appBuild/1060;supportBestPay/0;pv/56.42;apprpd/;ref/JDLTSubMainPageViewController;psq/38;ads/;psn/75aeceef3046d8ce11d354ff89af9517a2e4aa18|99;jdv/0|kong|t_1001003207_1762319_6901310|jingfen|30578707801140d09fcd54e5cd83bbf7|1621510932517|1621511027;adk/;app_device/IOS;pap/JA2020_3112531|3.3.6|IOS 14.3;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
                "Cookie": cookie,
            }
        }

        $.post(options, async (err, resp, data) => {
            try {

                data = JSON.parse(data);



                if (data.data.bizCode == 0) {

                    $.log(`\n${data.data.bizMsg}`)
                } else if (data.data.bizCode == 103) {
                    $.log(`\n${data.data.bizMsg}`)
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}



function task(taskId) {
    return new Promise(async (resolve) => {

        let options = {
            url: `https://api.m.jd.com`,

            body: `functionId=cash_task_getReward&body={"taskId":${taskId}}&client=wh5&clientVersion=1.0.0&osVersion=14.3&uuid=6898c30638c55142969304c8e2167997fa59eb51`,
            headers: {
                "Origin": "https://h5.m.jd.com",
                "Host": "api.m.jd.com",
                "User-Agent": "jdltapp;iPhone;3.3.6;14.3;75aeceef3046d8ce11d354ff89af9517a2e4aa18;network/wifi;hasUPPay/0;pushNoticeIsOpen/0;lang/zh_CN;model/iPhone9,2;addressid/;hasOCPay/0;appBuild/1060;supportBestPay/0;pv/56.42;apprpd/;ref/JDLTSubMainPageViewController;psq/38;ads/;psn/75aeceef3046d8ce11d354ff89af9517a2e4aa18|99;jdv/0|kong|t_1001003207_1762319_6901310|jingfen|30578707801140d09fcd54e5cd83bbf7|1621510932517|1621511027;adk/;app_device/IOS;pap/JA2020_3112531|3.3.6|IOS 14.3;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
                "Cookie": cookie,
            }
        }

        $.post(options, async (err, resp, data) => {
            try {

                data = JSON.parse(data);
                if (data.ret == 4) {
                    $.log(data.msg)
                } else if (data.ret == 5) {
                    $.log(data.msg)
                }


            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}


function dslq() {
    return new Promise(async (resolve) => {

        let options = {
            url: `https://api.m.jd.com`,

            body: `functionId=meal_checkIn_getReward&body={}&client=wh5&clientVersion=1.0.0&osVersion=14.3&uuid=6898c30638c55142969304c8e2167997fa59eb51`,
            headers: {
                "Origin": "https://h5.m.jd.com",
                "Host": "api.m.jd.com",
                "User-Agent": "jdltapp;iPhone;3.3.6;14.3;75aeceef3046d8ce11d354ff89af9517a2e4aa18;network/wifi;hasUPPay/0;pushNoticeIsOpen/0;lang/zh_CN;model/iPhone9,2;addressid/;hasOCPay/0;appBuild/1060;supportBestPay/0;pv/56.42;apprpd/;ref/JDLTSubMainPageViewController;psq/38;ads/;psn/75aeceef3046d8ce11d354ff89af9517a2e4aa18|99;jdv/0|kong|t_1001003207_1762319_6901310|jingfen|30578707801140d09fcd54e5cd83bbf7|1621510932517|1621511027;adk/;app_device/IOS;pap/JA2020_3112531|3.3.6|IOS 14.3;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
                "Cookie": cookie,
            }
        }

        $.post(options, async (err, resp, data) => {
            try {

                data = JSON.parse(data);

                //$.log(data)

                if (data.ret == 0) {
                    $.log(`\n下一次领取时间：${data.data.nextTime}` + "\n领取定时奖励：" + data.data.reward * 0.01)
                } else if (data.ret == 4) {
                    $.log(data.msg)
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

function info() {
    return new Promise(async (resolve) => {

        let options = {
            url: `https://api.m.jd.com`,

            body: `functionId=fission_index&body={"activityKey":"2021"}&client=wh5&clientVersion=1.0.0&osVersion=14.3&uuid=6898c30638c55142969304c8e2167997fa59eb51`,
            headers: {
                "Origin": "https://h5.m.jd.com",
                "Host": "api.m.jd.com",
                "User-Agent": "jdltapp;iPhone;3.3.6;14.3;75aeceef3046d8ce11d354ff89af9517a2e4aa18;network/wifi;hasUPPay/0;pushNoticeIsOpen/0;lang/zh_CN;model/iPhone9,2;addressid/;hasOCPay/0;appBuild/1060;supportBestPay/0;pv/56.42;apprpd/;ref/JDLTSubMainPageViewController;psq/38;ads/;psn/75aeceef3046d8ce11d354ff89af9517a2e4aa18|99;jdv/0|kong|t_1001003207_1762319_6901310|jingfen|30578707801140d09fcd54e5cd83bbf7|1621510932517|1621511027;adk/;app_device/IOS;pap/JA2020_3112531|3.3.6|IOS 14.3;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
                "Cookie": cookie,
            }
        }

        $.post(options, async (err, resp, data) => {
            try {

                data = JSON.parse(data);



                if (data.msg == "success") {
                    $.log(`\n你的邀请码：${data.activity.shareCode}`)
                } else if (data.code == 1) {
                    $.log(`\n查询失败`)
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}


function helpAuthor() {
    return new Promise(async (resolve) => {

        let options = {
            url: `https://api.m.jd.com/client.action`,

            body: `functionId=help_activity&body={"shareCode":"8CEAD486F12D384715FC149D7CCBD806AD1DAAB9A3E3F6CBAFDE81EEB7393333","name":"","imageUrl":""}&client=wh5&clientVersion=1.0.0&osVersion=10&uuid=7049442d7e415232`,
            headers: {
                "Origin": "https://h5.m.jd.com",
                "Host": "api.m.jd.com",
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
                "Cookie": "cuid=eidIe2798122d1s4GEix%252FuspRjy92JqJ273YghhIs3JZdi%252F4JjftGCWZOLgY3glC5gGXsTY1vGLRKckMeHq2opKqTBNLiayOHJtx2EhExIqlbarZpTFa;"+cookie,
            }
        }
        $.post(options, async (err, resp, data) => {
            try {
                data = JSON.parse(data);
                if (data.ret == 0) {
                    $.log("\n助力：" + data.helpAmount * 0.01)
                } else if (data.ret == 2) {
                    $.log(`\n${data.msg}`)
                } else if (data.ret == 7) {
                    $.log(`\n${data.msg}`)
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

function TotalBean() {
    return new Promise(async resolve => {
        const options = {
            "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
            "headers": {
                "Accept": "application/json,text/plain, */*",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-cn",
                "Connection": "keep-alive",
                "Cookie": cookie,
                "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data["retcode"] === 13) {
                            $.isLogin = false; //cookie过期
                            return;
                        }
                        if (data["retcode"] === 0) {
                            $.nickName = (data["base"] && data["base"].nickname) || $.UserName;
                        } else {
                            $.nickName = $.UserName;
                        }
                    } else {
                        console.log(`京东服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}
function safeGet(data) {
    try {
        if (typeof JSON.parse(data) == "object") {
            return true;
        }
    } catch (e) {
        console.log(e);
        console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
        return false;
    }
}
function jsonParse(str) {
    if (typeof str == "string") {
        try {
            return JSON.parse(str);
        } catch (e) {
            console.log(e);
            $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
            return [];
        }
    }
}
