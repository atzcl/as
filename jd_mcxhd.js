/*
author：tg@chenxing666
新潮品牌狂欢
脚本兼容: Quantumult X, Surge, Loon, JSBox, Node.js
==============Quantumult X==============
[task_local]
#新潮品牌狂欢
4 10 * * * https://gitee.com/lxk0301/jd_scripts/raw/master/jd_mcxhd.js, tag=新潮品牌狂欢, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true

==============Loon==============
[Script]
cron "4 10 * * *" script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_mcxhd.js,tag=新潮品牌狂欢

================Surge===============
新潮品牌狂欢 = type=cron,cronexp="4 10 * * *",wake-system=1,timeout=3600,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_mcxhd.js

===============小火箭==========
新潮品牌狂欢 = type=cron,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_mcxhd.js, cronexpr="4 10 * * *", timeout=3600, enable=true
*/
const $ = new Env('新潮品牌狂欢');

const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;

if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
  };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

const JD_API_HOST = 'https://api.m.jd.com/';
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
    return;
  }
  $.shareCodeList = []
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.beans = 0
      $.nickName = '';
      message = '';
      await TotalBean();
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/`, {"open-url": "https://bean.m.jd.com/"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        } else {
          $.setdata('', `CookieJD${i ? i + 1 : ""}`);//cookie失效，故清空cookie。$.setdata('', `CookieJD${i ? i + 1 : "" }`);//cookie失效，故清空cookie。
        }
        continue
      }
      await superBox()
      await showMsg();
    }
  }
  console.log(`\n开始自己京东内部相互助力\n`);
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      for (let vo of $.shareCodeList) {
        if (!vo) continue;
        await doTask(vo)
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

function showMsg() {
  message += `本次运行获得${$.earn}京豆`
  return new Promise(resolve => {
    $.msg($.name, '', `【京东账号${$.index}】${$.nickName}\n${message}`);
    resolve()
  })
}


async function superBox() {
  $.earn = 0
  await taskList()
  $.canDo = true
  while($.canDo){
    await startGame()
  }
}

function doTask(itemToken,taskToken=null) {
  let body = {"itemToken":itemToken}
  return new Promise(resolve => {
    $.get(taskUrl('doTask', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);

            if (data.retCode === '200') {
              console.log(`任务完成成功`)
              if(taskToken) {
                await queryTask(taskToken)
                await $.wait(5*1000)
                await viewTask(taskToken)
                await checkTask(itemToken)
              }
            } else {
              console.log(`任务完成失败，${data.retMessage}`)
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
function queryTask(taskToken){
  return new Promise(resolve => {
    $.get({
      url: `https://api.m.jd.com/?client=wh5&clientVersion=1.0.0&functionId=queryVkComponent&body={%22businessId%22:%22chanyedai%22,%22componentId%22:%22f6e2c64666f54b46868496f290f181e6%22,%22taskParam%22:%22%257B%2522taskToken%2522%3A%2522${taskToken}%2522%257D%22}&_timestamp=${+new Date()}`,
      headers: {
        'Host': 'api.m.jd.com',
        'Origin': 'https://h5.m.jd.com',
        'Accept': '*/*',
        'User-Agent': 'jdapp;iPhone;10.0.2;14.5.1;appBuild/167688;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
        'Accept-Language': 'zh-cn',
        'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/3fHfkJDWEckhqH73tRgUgxmg8U9S/index.html',
        Cookie: cookie
      }
    }, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
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
function viewTask(taskToken){
  const body = {
    "dataSource": "newshortAward",
    "method": "getTaskAward",
    "reqParams": JSON.stringify({"taskToken": taskToken}),
    "sdkVersion": "1.0.0",
    "clientLanguage": "zh"
  }
  return new Promise(resolve => {
    $.get({
      url: `https://api.m.jd.com/?client=wh5&clientVersion=1.0.0&functionId=qryViewkitCallbackResult&body=${escape(JSON.stringify(body))}&_timestamp=${+new Date()}`,
      headers: {
        'Host': 'api.m.jd.com',
        'Origin': 'https://h5.m.jd.com',
        'Accept': '*/*',
        'User-Agent': 'jdapp;iPhone;10.0.2;14.5.1;appBuild/167688;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
        'Accept-Language': 'zh-cn',
        'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/3fHfkJDWEckhqH73tRgUgxmg8U9S/index.html',
        Cookie: cookie
      }
    }, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data)
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
function checkTask(itemToken) {
  let body = {"itemToken":itemToken}
  return new Promise(resolve => {
    $.get(taskUrl('checkTaskStatus', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.retCode === '200') {
              console.log(`任务完成成功`)
            } else {
              console.log(`任务完成失败，${data.retMessage}`)
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
function taskList() {
  return new Promise(resolve => {
    $.get(taskUrl('taskList'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.retCode === '200') {
              for(let vo of data.result.tasks){
                if(vo.times < vo.maxTimes)
                  for(let bo of vo.subItem){
                    if (vo.taskType === '6'){
                      const shareCode = bo.itemToken
                      console.log(`好友助力码:${shareCode}`)
                      if (shareCode) $.shareCodeList.push(shareCode)
                    }
                    else if(vo.taskType!=='9') {
                      await doTask(bo.itemToken)
                    }
                    else{
                      await doTask(bo.itemToken,bo.taskToken)
                    }
                  }
              }
            } else {
              console.log(`抽奖失败`)
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
function startGame() {
  return new Promise(resolve => {
    $.get(taskUrl('startGame'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.retCode === '200') {
              console.log(`游戏开始成功`)
              await $.wait(10*1000)
              await reportGame(data.result.passScore + 2)
            } else {
              // if (data.retCode === '1102') $.canDo = false
              console.log(`游戏开始失败`, JSON.stringify(data))
              $.canDo = false
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
function reportGame(score) {
  return new Promise(resolve => {
    $.get(taskUrl('reportGame',{score:score}), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {

          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.retCode === '200') {
              const earn = data?.result?.gift?.jbeanNum ?? 0
              $.earn += earn
              console.log(`游戏结束成功，获得 ${earn} 京豆`)
            } else {
              console.log(data.retMessage)
              $.canDo = false
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
function taskUrl(function_id, body = {}) {
  body['token'] = 'jd17919499fb7031e5'
  return {
    url: `${JD_API_HOST}/client.action?functionId=mcxhd_brandcity_${function_id}&appid=publicUseApi&body=${escape(JSON.stringify(body))}&t=${+ new Date()}&client=wh5&clientVersion=1.0.0&sid=&uuid=`,
    headers: {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "Host": "api.m.jd.com",
      "Referer": "https://h5.m.jd.com/babelDiy/Zeus/31LKY9sFZZUvj5aN1TrZUE4V6xzQ/index.html",
      "Cookie": cookie,
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.141"
    }
  }
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
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0") : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
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
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
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
      $.msg($.name, '', '不要在BoxJS手动复制粘贴修改cookie')
      return [];
    }
  }
}
