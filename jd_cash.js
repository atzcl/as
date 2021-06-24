/*
签到领现金，每日2毛～5毛
可互助，助力码每日不变，只变日期
活动入口：京东APP搜索领现金进入
已支持IOS双京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#签到领现金
2 0-23/4 * * * https://gitee.com/lxk0301/jd_scripts/raw/master/jd_cash.js, tag=签到领现金, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true
================Loon==============
[Script]
cron "2 0-23/4 * * *" script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_cash.js,tag=签到领现金
===============Surge=================
签到领现金 = type=cron,cronexp="2 0-23/4 * * *",wake-system=1,timeout=3600,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_cash.js
============小火箭=========
签到领现金 = type=cron,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_cash.js, cronexpr="2 0-23/4 * * *", timeout=3600, enable=true
 */
const $ = new Env('签到领现金')
const notify = $.isNode() ? require('./sendNotify') : ''
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : ''
let jdNotify = true //是否关闭通知，false打开通知推送，true关闭通知推送
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [],
  cookie = '',
  message
const randomCount = $.isNode() ? 20 : 5

let newShareCodes = process.env.cashinviteCode ? [{ inviteCode: process.env.cashinviteCode }] : [] //这里修改你的邀请码
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false')
    console.log = () => {}
} else {
  cookiesArr = [
    $.getdata('CookieJD'),
    $.getdata('CookieJD2'),
    ...jsonParse($.getdata('CookiesJD') || '[]').map((item) => item.cookie),
  ].filter((item) => !!item)
}
const JD_API_HOST = 'https://api.m.jd.com/client.action'
let allMessage = ''
!(async () => {
  if (!cookiesArr[0]) {
    $.msg(
      $.name,
      '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取',
      'https://bean.m.jd.com/bean/signIndex.action',
      { 'open-url': 'https://bean.m.jd.com/bean/signIndex.action' }
    )
    return
  }
  //await requireConfig()
  console.log(`您提供了${newShareCodes.length}个账号的${$.name}助力码\n`)
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i]
      $.UserName = decodeURIComponent(
        cookie.match(/pt_pin=([^; ]+)(?=;?)/) &&
          cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]
      )
      $.index = i + 1
      $.isLogin = true
      $.nickName = ''
      message = ''
      await TotalBean()
      console.log(
        `\n******开始【京东账号${$.index}】${
          $.nickName || $.UserName
        }*********\n`
      )
      if (!$.isLogin) {
        $.msg(
          $.name,
          `【提示】cookie已失效`,
          `京东账号${$.index} ${
            $.nickName || $.UserName
          }\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`,
          { 'open-url': 'https://bean.m.jd.com/bean/signIndex.action' }
        )

        if ($.isNode()) {
          await notify.sendNotify(
            `${$.name}cookie已失效 - ${$.UserName}`,
            `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`
          )
        }
        continue
      }
      await jdCash()
    }
  }
  if (allMessage) {
    if (
      $.isNode() &&
      (process.env.CASH_NOTIFY_CONTROL
        ? process.env.CASH_NOTIFY_CONTROL === 'false'
        : !!1)
    )
      await notify.sendNotify($.name, allMessage)
    $.msg($.name, '', allMessage)
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done()
  })
async function jdCash() {
  await index()
  //await shareCodesFormat()
  await helpFriends()
  await getReward()
  await getReward('2')
  await index(true)
  await showMsg()
}
function ShareInfo() {
  return new Promise((resolve) => {
    $.get(
      taskUrl('cash_getJDMobShareInfo', { source: 3 }),
      (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data)
              if (data.code === 0 && data.data.bizCode === 0) {
                console.log(`你的inviteCode: ${data.data.result.inviteCode}`)

                console.log(`你的shareDate: ${data.data.result.shareDate}`)
                let helpInfo = {
                  inviteCode: data.data.result.inviteCode,
                  shareDate: data.data.result.shareDate,
                }
              } else if (data.data.bizCode === 207) {
                console.log(data.data.bizMsg)
              } else {
                console.log(data.data.bizMsg)
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve(data)
        }
      }
    )
  })
}
function index(info = false) {
  return new Promise((resolve) => {
    $.get(taskUrl('cash_mob_home'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data)
            if (data.code === 0 && data.data.result) {
              if (info) {
                if (message) {
                  message += `当前现金：${data.data.result.signMoney}元`
                  allMessage += `京东账号${$.index}${$.nickName}\n${message}${
                    $.index !== cookiesArr.length ? '\n\n' : ''
                  }`
                }
                message += `当前现金：${data.data.result.signMoney}元`
                return
              }
              // console.log(`您的助力码为${data.data.result.inviteCode}`)
              console.log(
                `\n【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${data.data.result.inviteCode}\n`
              )
              //let helpInfo = {
              //'inviteCode': data.data.result.inviteCode,
              //'shareDate': data.data.result.shareDate
              // }
              await ShareInfo()
              $.shareDate = data.data.result.shareDate
              // $.log(`shareDate: ${$.shareDate}`)
              // console.log(helpInfo)
              for (let task of data.data.result.taskInfos) {
                if (task.type === 4) {
                  for (let i = task.doTimes; i < task.times; ++i) {
                    console.log(`去做${task.name}任务 ${i + 1}/${task.times}`)
                    await doTask(task.type, task.jump.params.skuId)
                    await $.wait(5000)
                  }
                } else if (task.type === 2) {
                  for (let i = task.doTimes; i < task.times; ++i) {
                    console.log(`去做${task.name}任务 ${i + 1}/${task.times}`)
                    await doTask(task.type, task.jump.params.shopId)
                    await $.wait(5000)
                  }
                } else if (
                  task.type === 16 ||
                  task.type === 3 ||
                  task.type === 5 ||
                  task.type === 17 ||
                  task.type === 21
                ) {
                  for (let i = task.doTimes; i < task.times; ++i) {
                    console.log(`去做${task.name}任务 ${i + 1}/${task.times}`)
                    await doTask(task.type, task.jump.params.url)
                    await $.wait(5000)
                  }
                }
              }
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data)
      }
    })
  })
}
async function helpFriends() {
  $.canHelp = true
  for (let code of newShareCodes) {
    //await $.wait(5000)
    console.log(`去帮助好友${code['inviteCode']}`)

    await helpFriend(code)
    if (!$.canHelp) break
    await $.wait(1000)
  }
}
function helpFriend(helpInfo) {
  return new Promise((resolve) => {
    $.get(
      taskUrl('cash_mob_assist', {
        ...helpInfo,
        source: 3,
        shareDate: 'IRs1bey0ZPg',
      }),
      (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data)
              if (data.code === 0 && data.data.bizCode === 0) {
                console.log(`助力成功，获得${data.data.result.cashStr}`)
                // console.log(data.data.result.taskInfos)
              } else if (data.data.bizCode === 207) {
                console.log(data.data.bizMsg)
                $.canHelp = false
              } else {
                console.log(data.data.bizMsg)
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve(data)
        }
      }
    )
  })
}
function doTask(type, taskInfo) {
  return new Promise((resolve) => {
    $.get(
      taskUrl('cash_doTask', { type: type, taskInfo: taskInfo }),
      (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data)
              if (data.code === 0) {
                console.log(`任务完成成功`)
                // console.log(data.data.result.taskInfos)
              } else {
                console.log(data)
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve(data)
        }
      }
    )
  })
}
function getReward(source = 1) {
  return new Promise((resolve) => {
    $.get(
      taskUrl('cash_mob_reward', { source: Number(source), rewardNode: '' }),
      (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data)
              if (data.code === 0 && data.data.bizCode === 0) {
                console.log(
                  `领奖成功，${data.data.result.shareRewardTip}【${data.data.result.shareRewardAmount}】`
                )
                message += `领奖成功，${data.data.result.shareRewardTip}【${data.data.result.shareRewardAmount}元】\n`
                // console.log(data.data.result.taskInfos)
              } else {
                // console.log(`领奖失败，${data.data.bizMsg}`)
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve(data)
        }
      }
    )
  })
}

function showMsg() {
  return new Promise((resolve) => {
    if (!jdNotify) {
      $.msg($.name, '', `${message}`)
    } else {
      $.log(`京东账号${$.index}${$.nickName}\n${message}`)
    }
    resolve()
  })
}

//格式化助力码
function shareCodesFormat() {
  return new Promise(async (resolve) => {
    //$.newShareCodes = [];

    $.newShareCodes = [
      ...new Set([...$.newShareCodes, ...(readShareCodeRes.data || [])]),
    ]

    $.newShareCodes.map(
      (item, index) =>
        ($.newShareCodes[index] = { inviteCode: item, shareDate: $.shareDate })
    )
    console.log(
      `第${$.index}个京东账号将要助力的好友${JSON.stringify($.newShareCodes)}`
    )
    resolve()
  })
}

function requireConfig() {
  return new Promise((resolve) => {
    console.log(`开始获取${$.name}配置文件\n`)
    let shareCodes = []
    if ($.isNode()) {
      if (process.env.JD_CASH_SHARECODES) {
        if (process.env.JD_CASH_SHARECODES.indexOf('\n') > -1) {
          shareCodes = process.env.JD_CASH_SHARECODES.split('\n')
        } else {
          shareCodes = process.env.JD_CASH_SHARECODES.split('&')
        }
      }
    }
    console.log(`共${cookiesArr.length}个京东账号\n`)
    //$.shareCodesArr = [];
    if ($.isNode()) {
      Object.keys(shareCodes).forEach((item) => {
        if (shareCodes[item]) {
          $.shareCodesArr.push(shareCodes[item])
        }
      })
    }
    console.log(`您提供了${$.shareCodesArr.length}个账号的${$.name}助力码\n`)
    resolve()
  })
}
function deepCopy(obj) {
  let objClone = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === 'object') {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        //判断ojb子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === 'object') {
          objClone[key] = deepCopy(obj[key])
        } else {
          //如果不是，简单复制
          objClone[key] = obj[key]
        }
      }
    }
  }
  return objClone
}
function taskUrl(functionId, body = {}) {
  return {
    url: `${JD_API_HOST}?functionId=${functionId}&body=${escape(
      JSON.stringify(body)
    )}&appid=CashRewardMiniH5Env&appid=9.1.0`,
    headers: {
      Cookie: cookie,
      Host: 'api.m.jd.com',
      Connection: 'keep-alive',
      'Content-Type': 'application/json',
      Referer: 'http://wq.jd.com/wxapp/pages/hd-interaction/index/index',
      'User-Agent': $.isNode()
        ? process.env.JD_USER_AGENT
          ? process.env.JD_USER_AGENT
          : require('./USER_AGENTS').USER_AGENT
        : $.getdata('JDUA')
        ? $.getdata('JDUA')
        : 'jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0',
      'Accept-Language': 'zh-cn',
      'Accept-Encoding': 'gzip, deflate, br',
    },
  }
}

function TotalBean() {
  return new Promise(async (resolve) => {
    const options = {
      url: `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      headers: {
        Accept: 'application/json,text/plain, */*',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-cn',
        Connection: 'keep-alive',
        Cookie: cookie,
        Referer: 'https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2',
        'User-Agent': $.isNode()
          ? process.env.JD_USER_AGENT
            ? process.env.JD_USER_AGENT
            : require('./USER_AGENTS').USER_AGENT
          : $.getdata('JDUA')
          ? $.getdata('JDUA')
          : 'jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0',
      },
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data)
            if (data['retcode'] === 13) {
              $.isLogin = false //cookie过期
              return
            }
            if (data['retcode'] === 0) {
              $.nickName = (data['base'] && data['base'].nickname) || $.UserName
            } else {
              $.nickName = $.UserName
            }
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve()
      }
    })
  })
}
function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == 'object') {
      return true
    }
  } catch (e) {
    console.log(e)
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`)
    return false
  }
}
function jsonParse(str) {
  if (typeof str == 'string') {
    try {
      return JSON.parse(str)
    } catch (e) {
      console.log(e)
      $.msg(
        $.name,
        '',
        '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie'
      )
      return []
    }
  }
}
