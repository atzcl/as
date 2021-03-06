/*
城城领现金
脚本兼容: QuantumultX, Surge,Loon, JSBox, Node.js
=================================Quantumultx=========================
[task_local]
#城城领现金
0 0-23/1 * * * https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_city.js, tag=城城领现金, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true
=================================Loon===================================
[Script]
cron "0 0-23/1 * * *" script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_city.js,tag=城城领现金
===================================Surge================================
城城领现金 = type=cron,cronexp="0 0-23/1 * * *",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_city.js
====================================小火箭=============================
城城领现金 = type=cron,script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_city.js, cronexpr="0 0-23/1 * * *", timeout=3600, enable=true
 */

const $ = new Env('城城领现金');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
//自动抽奖 ，环境变量  JD_CITY_EXCHANGE
let exchangeFlag = $.isNode() ? (process.env.JD_CITY_EXCHANGE === "true" ? true : false) : ($.getdata('jdJxdExchange') === "true" ? true : false)  //是否开启自动抽奖，建议活动快结束开启，默认关闭
let helpPool = $.isNode() ? (process.env.JD_CITY_HELPPOOL === "false" ? false : true) : ($.getdata('JD_CITY_HELPPOOL') === "false" ? false : true) //是否全部助力助力池开关，默认开启
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;
let uuid, UA;
$.shareCodes = ['-ryUXq8FN2NFMhuVQtPMojEEb5rRKBWV', '-ryUXP9ZNGBBNUCXG4mRoWIAGZ7vARo3']
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
  };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
const JD_API_HOST = 'https://api.m.jd.com/client.action';
let inviteCodes = []
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  if (exchangeFlag) {
    console.log(`脚本自动抽奖`)
  } else {
    console.log(`脚本不会自动抽奖，建议活动快结束开启，默认关闭(在10.29日自动开启抽奖),如需自动抽奖请设置环境变量  JD_CITY_EXCHANGE 为true`);
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
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      UA = `jdapp;iPhone;10.2.0;13.1.2;${randomString(40)};M/5.0;network/wifi;ADID/;model/iPhone8,1;addressid/2308460611;appBuild/167853;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
      uuid = UA.split(';')[4]
      await getInfo('', true);
      await $.wait(1000)
    }
  }
  inviteCodes = []
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
    $.index = i + 1;
    UA = `jdapp;iPhone;10.2.0;13.1.2;${randomString(40)};M/5.0;network/wifi;ADID/;model/iPhone8,1;addressid/2308460611;appBuild/167853;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
    uuid = UA.split(';')[4]
    await shareCodesFormat()
    let shareCodes;
    if (helpPool) {
      shareCodes = [...new Set([...inviteCodes])]
    } else {
      if (i === 0) {
        shareCodes = [...new Set([...inviteCodes])]
      } else {
        shareCodes = [...$.newShareCodes]
      }
    }
    for (let j = 0; j < shareCodes.length; j++) {
      console.log(helpPool ? `\n${$.UserName} 开始助力 助力池 【${shareCodes[j]}】` : i === 0 ? `\nCK1 ${$.UserName} 开始助力 助力池 【${shareCodes[j]}】` : `\n${$.UserName} 开始助力 【${shareCodes[j]}】`)
      await $.wait(1000)
      let res = await getInfo(shareCodes[j])
      if (res && res['data'] && res['data']['bizCode'] === 0) {
        if (res['data']['result']['toasts'] && res['data']['result']['toasts'][0] && res['data']['result']['toasts'][0]['status'] === '3') {
          console.log(`助力次数已耗尽，跳出`)
          break
        }
        if (res['data']['result']['toasts']) {
          if (res['data']['result']['toasts'][0]) {
            console.log(`助力 【${shareCodes[j]}】:${res.data.result.toasts[0].msg}`)
          } else {
            console.log(`未知错误，跳出`)
            break
          }
        }
      }
      if ((res && res['status'] && res['status'] === '3') || (res && res.data && res.data.bizCode === -11)) {
        // 助力次数耗尽 || 黑号
        break
      }
    }
    await $.wait(1000)
    await getInviteInfo();//雇佣
    if (exchangeFlag) {
      const res = await city_lotteryAward();//抽奖
      if (res && res > 0) {
        for (let i = 0; i < new Array(res).fill('').length; i++) {
          await $.wait(1000)
          await city_lotteryAward();//抽奖
        }
      }
    } else {
      //默认10.29开启抽奖
      if ((new Date().getMonth() + 1) === 1 && new Date().getDate() >= 21) {
        const res = await city_lotteryAward();//抽奖
        if (res && res > 0) {
          for (let i = 0; i < new Array(res).fill('').length; i++) {
            await $.wait(1000)
            await city_lotteryAward();//抽奖
          }
        }
      }
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

function getInfo(inviteId, flag = false) {
  let body = {"lbsCity": "1", "realLbsCity": "2953", "inviteId": inviteId, "headImg": "", "userName": "", "taskChannel": "1", "location": "", "safeStr": ""}
  return new Promise((resolve) => {
    $.post(taskPostUrl("city_getHomeDatav1", body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.code === 0) {
              if (data.data && data['data']['bizCode'] === 0) {
                if (flag) {
                  console.log(`【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${data.data && data.data.result.userActBaseInfo.inviteId}`);
                  if (data.data && data.data.result.userActBaseInfo.inviteId) {
                    $.shareCodes.push(data.data.result.userActBaseInfo.inviteId)
                  }
                  console.log(`剩余金额：${data.data.result.userActBaseInfo.poolMoney}`)
                  for (let pop of data.data.result.popWindows || []) {
                    if (pop.data.cash && (pop.data.cash !== data.data.result.userActBaseInfo.poolMoney)) {
                      await receiveCash("", "2");
                    }
                  }
                  const {taskDetailResultVo} = data.data.result.taskInfo;
                  const {lotteryTaskVos, taskVos} = taskDetailResultVo;
                  for (let lotteryTask of lotteryTaskVos) {
                    if (lotteryTask.times >= lotteryTask.maxTimes && lotteryTask.times !== undefined) {
                      for (let lo of lotteryTask?.badgeAwardVos || []) {
                        if (lo.status === 3) {
                          await receiveCash("", "6");
                        }
                      }
                    }
                  }
                }
                for (let vo of data.data.result && data.data.result.mainInfos || []) {
                  if (vo && vo.remaingAssistNum === 0 && vo.status === "1") {
                    console.log(vo.roundNum)
                    await receiveCash(vo.roundNum)
                    await $.wait(2 * 1000)
                  }
                }
              } else {
                console.log(`\n\n${inviteId ? '助力好友' : '获取邀请码'}失败:${data.data.bizMsg}`)
                if (flag) {
                  if (data.data && !data.data.result.userActBaseInfo.inviteId) {
                    console.log(`账号已黑，看不到邀请码\n`);
                  }
                }
              }
            } else {
              console.log(`\n\ncity_getHomeData失败:${JSON.stringify(data)}\n`)
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

function receiveCash(roundNum, type = '') {
  let body = {"cashType": 1, "roundNum": roundNum}
  if (type) body = {"cashType": type}
  return new Promise((resolve) => {
    $.post(taskPostUrl("city_receiveCash", body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            console.log(`领红包结果${data}`);
            data = JSON.parse(data);
            if (data['data']['bizCode'] === 0) {
              console.log(`获得 ${data.data.result.currentTimeCash} 元，共计 ${data.data.result.totalCash} 元`)
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

function getInviteInfo() {
  let body = {}
  return new Promise((resolve) => {
    $.post(taskPostUrl("city_masterMainData", body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data && (data.code === 0 && data.data.bizCode === 0)) {
              if (data.data.result.masterData.actStatus === 2) {
                await receiveCash("", "4")
                await $.wait(2000)
              }
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

function city_lotteryAward() {
  let body = {}
  return new Promise((resolve) => {
    $.post(taskPostUrl("city_lotteryAward", body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            console.log(`抽奖结果：${data}`);
            data = JSON.parse(data);
            if (data['data']['bizCode'] === 0) {
              const lotteryNum = data['data']['result']['lotteryNum'];
              resolve(lotteryNum);
            }
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

function taskPostUrl(functionId, body) {
  return {
    url: JD_API_HOST,
    body: `functionId=${functionId}&body=${JSON.stringify(body)}&client=wh5&clientVersion=1.0.0&uuid=${uuid}`,
    headers: {
      "Host": "api.m.jd.com",
      "Accept": "application/json, text/plain, */*",
      "Content-Type": "application/x-www-form-urlencoded",
      "Origin": "https://bunearth.m.jd.com",
      "Accept-Language": "zh-CN,zh-Hans;q=0.9",
      "User-Agent": UA,
      "Referer": "https://bunearth.m.jd.com/",
      "Accept-Encoding": "gzip, deflate, br",
      "Cookie": cookie
    }
  }
}

function randomString(e) {
  e = e || 32;
  let t = "abcdef0123456789", a = t.length, n = "";
  for (let i = 0; i < e; i++)
    n += t.charAt(Math.floor(Math.random() * a));
  return n
}
//格式化助力码
function shareCodesFormat() {
  return new Promise(async resolve => {
    // console.log(`第${$.index}个京东账号的助力码:::${$.shareCodesArr[$.index - 1]}`)
    $.newShareCodes = [];
    $.newShareCodes = [...new Set([...$.shareCodes, ...inviteCodes])];
    console.log(`\n第${$.index}个京东账号将要助力的好友${JSON.stringify($.newShareCodes)}`)
    resolve();
  })
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
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
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
