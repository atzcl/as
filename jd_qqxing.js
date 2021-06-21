/*
星系牧场
活动入口：QQ星儿童牛奶京东自营旗舰店->星系牧场
每次都要手动打开才能跑 不知道啥问题
 19.0复制整段话 http:/J7ldD7ToqMhRJI星系牧场养牛牛，可获得DHA专属奶！%VAjYb8me2b!→去猄倲←

https://lzdz-isv.isvjcloud.com/dingzhi/qqxing/pasture/activity?activityId=90121061401&lng=107.146935&lat=33.255252&sid=cad74d1c843bd47422ae20cadf6fe5aw&un_area=8_573_6627_52446
更新地址：https://raw.githubusercontent.com/Wenmoux/scripts/wen/jd/jd_ddnc_farmpark.js
============Quantumultx===============
[task_local]
#星系牧场
30 7 * * * https://raw.githubusercontent.com/Wenmoux/scripts/wen/jd/jd_qqxing.js, tag=星系牧场, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true
*/
const $ = new Env('QQ星系牧场');
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';

const randomCount = $.isNode() ? 20 : 5;
const notify = $.isNode() ? require('./sendNotify') : '';
let merge = {}
let codeList = []
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [],
    cookie = '';
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

const JD_API_HOST = `https://api.m.jd.com/client.action`;
message = ""
!(async () => {
        if (!cookiesArr[0]) {
            $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
                "open-url": "https://bean.m.jd.com/"
            });
            return;
        }

        for (let i = 0; i <cookiesArr.length  ; i++) {
            cookie = cookiesArr[i];
            if (cookie) {
                $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
                $.index = i + 1;
                $.cando = true
                $.cow = ""
                $.isLogin = true;
                $.nickName = '';
                $.drawresult = ""
                console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
                if (!$.isLogin) {
                    $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
                        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
                    });

                    if ($.isNode()) {
                        await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                    }
                    continue
                }
                await genToken()
                await getToken2()
                await getActCk()
                await getMyPin()
                await getUserInfo()
                await getinfo()
                if ($.cando) {
                    taskList = [...$.taskList, ...$.taskList2]
                    for (j = 0; j < taskList.length; j++) {
                        task = taskList[j]
                        console.log(task.taskname)
                        await dotask(task.taskid, task.params)
                    }
                    await getinfo()
                    for (k = 0; k < $.drawchance; k++) {
                        await draw()
                    }
                    message += `【京东账号${$.index}】${$.nickName || $.UserName}\n${$.cow} +${$.drawresult}\n`
                } else {
                    console.log("跑不起来了~请自己进去一次牧场")
                }
            }
        }
        if (message.length != 0) {
            await notify.sendNotify("星系牧场", `${message}\n牧场入口：QQ星儿童牛奶京东自营旗舰店->星系牧场\n\n吹水群：https://t.me/wenmou_car`);
        }
    })()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())
//获取活动信息



//genToken
function genToken() {
    let config = {
        url: 'https://api.m.jd.com/client.action?functionId=genToken&clientVersion=10.0.4&build=88641&client=android&d_brand=Xiaomi&d_model=RedmiK30&osVersion=11&screen=2175*1080&partner=xiaomi001&oaid=b30cf82cacfa8972&openudid=290955c2782e1c44&eid=eidAef5f8122a0sf2tNlFbi9TV+3rtJ+jl5UptrTZo/Aq5MKUEaXcdTZC6RfEBt5Jt3Gtml2hS+ZvrWoDvkVv4HybKpJJVMdRUkzX7rGPOis1TRFRUdU&sdkVersion=30&lang=zh_CN&uuid=290955c2782e1c44&aid=290955c2782e1c44&area=8_573_6627_52446&networkType=wifi&wifiBssid=unknown&uts=0f31TVRjBStpL4ZXG%2Bei9UMZFx11kiAc4uTbRsxZfZtpjK0qBikE0Huau%2BdHMWw7Nxk%2FDA3TwsEF9ZWEw2bHW1pJATTaEazb5s4ufJjOtQ0UlsSdWNOuRR1whnfY5iOVPH0WQifaQw%2BNNHEzMW3vqt8932eMJc8EWhTwcEyYBkI56D6FQeTEhnaG0UEv0qLuGvPMDfUoUM6rra09Khoa3A%3D%3D&uemps=0-0&st=1624142743692&sign=0f1b321eb6b7be6fd1f918c36718b6ee&sv=100',
        body: 'body=%7B%22action%22%3A%22to%22%2C%22to%22%3A%22https%253A%252F%252Flzdz-isv.isvjcloud.com%252Fdingzhi%252Fqqxing%252Fpasture%252Factivity%253FactivityId%253D90121061401%22%7D&',
        headers: {
            'Host': 'api.m.jd.com',
            'accept': '*/*',
            'user-agent': 'JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)',
            'accept-language': 'zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6',
            'content-type': 'application/x-www-form-urlencoded',
            'Cookie': cookie
        }
    }
    return new Promise(resolve => {
        $.post(config, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${$.name} API请求失败，请检查网路重试`);
                    console.log(`${JSON.stringify(err)}`)
                } else {
                    data = JSON.parse(data);
                    $.isvToken = data['tokenKey']
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

//获取pin需要用到
function getToken2() {
    let config = {
        url: 'https://api.m.jd.com/client.action?functionId=isvObfuscator&clientVersion=10.0.4&build=88641&client=android&d_brand=Xiaomi&d_model=RedmiK30&osVersion=11&screen=2175*1080&partner=xiaomi001&oaid=b30cf82cacfa8972&openudid=290955c2782e1c44&eid=eidAef5f8122a0sf2tNlFbi9TV+3rtJ+jl5UptrTZo/Aq5MKUEaXcdTZC6RfEBt5Jt3Gtml2hS+ZvrWoDvkVv4HybKpJJVMdRUkzX7rGPOis1TRFRUdU&sdkVersion=30&lang=zh_CN&uuid=290955c2782e1c44&aid=290955c2782e1c44&area=8_573_6627_52446&networkType=wifi&wifiBssid=unknown&uts=0f31TVRjBSu9ApHUouD8ZP%2BCIJSPfALzaaOxqgfonS67U6HheQNiBOrPSrSFlb95oI9qzuPuELmi%2F%2FXuuWZaM43r%2BL4Fk5d2eLpAtYb0ncWIZn0RtPoGD13HYTyZvdEv4lbuDE3%2Ffs5unT6u6fNdyKyT4khBw%2BCv4LL9n30ljoHX428ThOV2iwP1bxn0hTFM1Yyl%2BracFlZv6oNKsBWeaA%3D%3D&uemps=0-0&st=1624067570330&sign=189b90a2a6ac9cbd6c1017085f1baec2&sv=111',
        body: 'body=%7B%22id%22%3A%22%22%2C%22url%22%3A%22https%3A%2F%2Flzdz-isv.isvjcloud.com%22%7D&',
        headers: {
            'Host': 'api.m.jd.com',
            'accept': '*/*',
            'user-agent': 'JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)',
            'accept-language': 'zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6',
            'content-type': 'application/x-www-form-urlencoded',
            'Cookie': cookie
        }
    }
    return new Promise(resolve => {
        $.post(config, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                    $.token2 = data['token']
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}




//抄的书店的 不过不加好像也能进去
function getActCk() {
    return new Promise(resolve => {
        $.get(taskUrl("/dingzhi/qqxing/pasture/activity", `activityId=90121061401`), (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if ($.isNode())
                        for (let ck of resp['headers']['set-cookie']) {
                            cookie = `${cookie}; ${ck.split(";")[0]};`
                        }
                    else {
                        for (let ck of resp['headers']['Set-Cookie'].split(',')) {
                            cookie = `${cookie}; ${ck.split(";")[0]};`
                        }
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}



//获取我的pin
function getMyPin() {
    let config = taskUrl("/customer/getMyPing", `userId=1000361242&token=${$.token2}&fromType=APP`)
    // console.log(config)
    return new Promise(resolve => {
        $.get(config, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                    if (data.data && data.data.secretPin) {
                        $.pin = data.data.secretPin
                        $.nickname = data.data.nickname
                        console.log(`欢迎回来~  ${$.nickname}`);
                    }
                }
            } catch (e) {
                   $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}


// 获得用户信息
function getUserInfo() {
    return new Promise(resolve => {
        let body = `pin=${encodeURIComponent($.token)}`
        $.post(taskPostUrl('wxActionCommon/getUserInfo', body), async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                    if (data.data) {
                        $.userId = data.data.id
                        $.pinImg = data.data.yunMidImageUrl
                        $.nick = data.data.nickname
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}


//获取任务列表
function getinfo() {
    let config = taskUrl("/dingzhi/qqxing/pasture/myInfo", `activityId=90121061401&pin=${$.pin}&pinImg=${$.pinImg}&nick=${$.nick}&cjyxPin=&cjhyPin=&shareUuid=`)
    return new Promise(resolve => {
        $.get(config, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                    if (data.result) {
                        $.taskList = data.data.task.filter(x => x.maxNeed == 1 && x.curNum == 0)
                        $.taskList2 = data.data.task.filter(x => x.maxNeed != 1 && x.type == 0)
                        $.draw = data.data.bags.filter(x => x.bagId == 'drawchance')[0]
                        $.food = data.data.bags.filter(x => x.bagId == 'food')[0]
                        $.sign = data.data.bags.filter(x => x.bagId == 'signDay')[0]
                        $.score = data.data.score
                        $.cow = `当前🐮🐮成长值：${$.score}  饲料：${$.food.totalNum-$.food.useNum}  抽奖次数：${$.draw.totalNum-$.draw.useNum}  签到天数：${$.sign.totalNum}`
                        console.log($.cow)
                        $.drawchance = $.draw.totalNum - $.draw.useNum
                    } else {
                        $.cando = false
                   //     console.log(data)
                        console.log(data.errorMessage)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })

}





function dotask(taskId, params) {
    let config = taskUrl("/dingzhi/qqxing/pasture/doTask", `taskId=${taskId}&param=${params}&activityId=90121061401&pin=${$.pin}&actorUuid=&userUuid=`)
    //  console.log(config)
    return new Promise(resolve => {
        $.get(config, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                    if (data.result) {
                        if (data.data.food) {
                            console.log("操作成功,获得饲料： " + data.data.food + "  抽奖机会：" + data.data.drawChance + "  成长值：" + data.data.growUp)
                        }
                    } else {
                        console.log(data.errorMessage)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })

}

function draw() {
    let config = taskUrl("/dingzhi/qqxing/pasture/luckydraw", `activityId=90121061401&pin=${$.pin}&actorUuid=&userUuid=`)
    //  console.log(config)
    return new Promise(resolve => {
        $.get(config, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                    if (data.result) {
                        if (Object.keys(data.data).length == 0) {
                            console.log("抽奖成功,恭喜你抽了个寂寞： ")
                        } else {
                            console.log(`恭喜你抽中 ${data.data.prize.rewardName}`)
                            $.drawresult += `恭喜你抽中 ${data.data.prize.rewardName} `
                        }
                    } else {
                        console.log(data.errorMessage)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}






function taskUrl(url, body) {
    const time = Date.now();
    //  console.log(cookie)
    return {
        url: `https://lzdz-isv.isvjcloud.com${url}?${body}`,
        headers: {
            'Host': 'lzdz-isv.isvjcloud.com',
            'Accept': 'application/json',
            //     'X-Requested-With': 'XMLHttpRequest',
            'Referer': 'https://lzdz-isv.isvjcloud.com/dingzhi/qqxing/pasture/activity/6318274?activityId=90121061401&shareUuid=15739046ca684e8c8fd303c8a14e889a&adsource=null&shareuserid4minipg=Ej42XlmwUZpSlF8TzjHBW2Sy3WQlSnqzfk0%2FaZMj9YjTmBx5mleHyWG1kOiKkz%2Fk&shopid=undefined&lng=107.146945&lat=33.255267&sid=cad74d1c843bd47422ae20cadf6fe5aw&un_area=8_573_6627_52446',
            'user-agent': 'jdapp;android;10.0.4;11;2393039353533623-7383235613364343;network/wifi;model/Redmi K30;addressid/138549750;aid/290955c2782e1c44;oaid/b30cf82cacfa8972;osVer/30;appBuild/88641;partner/xiaomi001;eufv/1;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 11; Redmi K30 Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045537 Mobile Safari/537.36',
            'content-type': 'application/x-www-form-urlencoded',
            'Cookie': `${cookie} IsvToken=${$.IsvToken};AUTH_C_USER=${$.pin}`,
        }
    }
}



function taskPostUrl(url, body) {
    return {
        url: `https://lzdz-isv.isvjcloud.com/${url}`,
        body: body,
        headers: {
            'Host': 'lzdz-isv.isvjcloud.com',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': 'https://lzdz-isv.isvjcloud.com/dingzhi/qqxing/pasture/activity/6318274?activityId=90121061401&shareUuid=15739046ca684e8c8fd303c8a14e889a&adsource=null&shareuserid4minipg=Ej42XlmwUZpSlF8TzjHBW2Sy3WQlSnqzfk0%2FaZMj9YjTmBx5mleHyWG1kOiKkz%2Fk&shopid=undefined&lng=107.146945&lat=33.255267&sid=cad74d1c843bd47422ae20cadf6fe5aw&un_area=8_573_6627_52446',
            'user-agent': 'jdapp;android;10.0.4;11;2393039353533623-7383235613364343;network/wifi;model/Redmi K30;addressid/138549750;aid/290955c2782e1c44;oaid/b30cf82cacfa8972;osVer/30;appBuild/88641;partner/xiaomi001;eufv/1;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 11; Redmi K30 Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045537 Mobile Safari/537.36',
            'content-type': 'application/x-www-form-urlencoded',
            'Cookie': `${cookie} IsvToken=${$.IsvToken};AUTH_C_USER=${$.pin}"`,
        }
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
