/*
 [task_local]
 #柠檬赚京豆步数换京豆 自行去刷步数
 * 15 * * * http://nm66.top/jd_bs.js, tag=柠檬赚京豆步数换京豆, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true
*/

const $ = new Env('柠檬赚京豆步数换京豆')
const notify = $.isNode() ? require('./sendNotify') : ''
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : ''

//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [],
  cookie = '',
  message

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
          //await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }

      await bs2000()
      await bs5000()
      await bs10000()
      await bs20000()
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done()
  })

function bs2000(timeout = 0) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let url = {
        url:
          `https://api.m.jd.com/api?functionId=swat_game_exchangejingbean&fromType=wxapp&timestamp=` +
          Date.now(),
        headers: {
          Referer: `https://servicewechat.com/wxa5bf5ee667d91626/142/page-frame.html`,
          Cookie: `${cookie}appkey=797c7d5f8f0f499b936aad5edcffa08c;appid=wxa5bf5ee667d91626;wxclient=gxhwx;ie_ai=1;`,
          Connection: `keep-alive`,
          'content-type': `application/x-www-form-urlencoded`,
          Host: `api.m.jd.com`,
          'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.5(0x18000528) NetType/4G Language/zh_CN`,
          'Accept-Encoding': `gzip,compress,br,deflate`,
          'Accept-Language': `zh-cn`,
        },
        body: `body={"stepNumber":2000}&appid=swat_miniprogram&client=tjj_m&screen=1920*1080&osVersion=5.0.0&networkType=wifi&sdkName=orderDetail&sdkVersion=1.0.0&clientVersion=3.1.3&area=11`,
      }

      $.post(url, async (err, resp, data) => {
        try {
          //console.log(url.url)
          //console.log(data)
          data = JSON.parse(data)
          //console.log(data)
          if (data.code === 0) {
            console.log('柠檬赚京豆步数换京豆:2000步' + data.msg)
            //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆:2000步\n"+data.msg)
          } else {
            console.log('柠檬赚京豆步数换京豆:2000步' + data.msg)
            //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆2000步\n步数不足或今日你已经兑换")
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve()
        }
      })
    }, timeout)
  })
}
function bs5000(timeout = 0) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let url = {
        url:
          `https://api.m.jd.com/api?functionId=swat_game_exchangejingbean&fromType=wxapp&timestamp=` +
          Date.now(),
        headers: {
          Referer: `https://servicewechat.com/wxa5bf5ee667d91626/142/page-frame.html`,
          Cookie: `${cookie}appkey=797c7d5f8f0f499b936aad5edcffa08c;appid=wxa5bf5ee667d91626;wxclient=gxhwx;ie_ai=1;`,
          Connection: `keep-alive`,
          'content-type': `application/x-www-form-urlencoded`,
          Host: `api.m.jd.com`,
          'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.5(0x18000528) NetType/4G Language/zh_CN`,
          'Accept-Encoding': `gzip,compress,br,deflate`,
          'Accept-Language': `zh-cn`,
        },
        body: `body={"stepNumber":5000}&appid=swat_miniprogram&client=tjj_m&screen=1920*1080&osVersion=5.0.0&networkType=wifi&sdkName=orderDetail&sdkVersion=1.0.0&clientVersion=3.1.3&area=11`,
      }

      $.post(url, async (err, resp, data) => {
        try {
          //console.log(url.url)
          //console.log(data)
          data = JSON.parse(data)
          //console.log(data)
          if (data.code === 0) {
            console.log('柠檬赚京豆步数换京豆:5000步' + data.msg)
            //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆:5000步\n"+data.msg)
          } else {
            console.log('柠檬赚京豆步数换京豆:5000步' + data.msg)
            //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆5000步\n步数不足或今日你已经兑换")
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve()
        }
      })
    }, timeout)
  })
}

function bs10000(timeout = 0) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let url = {
        url:
          `https://api.m.jd.com/api?functionId=swat_game_exchangejingbean&fromType=wxapp&timestamp=` +
          Date.now(),
        headers: {
          Referer: `https://servicewechat.com/wxa5bf5ee667d91626/142/page-frame.html`,
          Cookie: `${cookie}appkey=797c7d5f8f0f499b936aad5edcffa08c;appid=wxa5bf5ee667d91626;wxclient=gxhwx;ie_ai=1;`,
          Connection: `keep-alive`,
          'content-type': `application/x-www-form-urlencoded`,
          Host: `api.m.jd.com`,
          'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.5(0x18000528) NetType/4G Language/zh_CN`,
          'Accept-Encoding': `gzip,compress,br,deflate`,
          'Accept-Language': `zh-cn`,
        },
        body: `body={"stepNumber":10000}&appid=swat_miniprogram&client=tjj_m&screen=1920*1080&osVersion=5.0.0&networkType=wifi&sdkName=orderDetail&sdkVersion=1.0.0&clientVersion=3.1.3&area=11`,
      }

      $.post(url, async (err, resp, data) => {
        try {
          //console.log(url.url)
          //console.log(data)
          data = JSON.parse(data)
          //console.log(data)
          if (data.code === 0) {
            console.log('柠檬赚京豆步数换京豆:10000步' + data.msg)
            //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆:10000步\n"+data.msg)
          } else {
            console.log('柠檬赚京豆步数换京豆:10000步' + data.msg)
            //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆10000步\n步数不足或今日你已经兑换")
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve()
        }
      })
    }, timeout)
  })
}
function bs20000(timeout = 0) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let url = {
        url:
          `https://api.m.jd.com/api?functionId=swat_game_exchangejingbean&fromType=wxapp&timestamp=` +
          Date.now(),
        headers: {
          Referer: `https://servicewechat.com/wxa5bf5ee667d91626/142/page-frame.html`,
          Cookie: `${cookie}appkey=797c7d5f8f0f499b936aad5edcffa08c;appid=wxa5bf5ee667d91626;wxclient=gxhwx;ie_ai=1;`,
          Connection: `keep-alive`,
          'content-type': `application/x-www-form-urlencoded`,
          Host: `api.m.jd.com`,
          'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.5(0x18000528) NetType/4G Language/zh_CN`,
          'Accept-Encoding': `gzip,compress,br,deflate`,
          'Accept-Language': `zh-cn`,
        },
        body: `body={"stepNumber":20000}&appid=swat_miniprogram&client=tjj_m&screen=1920*1080&osVersion=5.0.0&networkType=wifi&sdkName=orderDetail&sdkVersion=1.0.0&clientVersion=3.1.3&area=11`,
      }

      $.post(url, async (err, resp, data) => {
        try {
          //console.log(url.url)
          //console.log(data)
          data = JSON.parse(data)
          //console.log(data)
          if (data.code === 0) {
            console.log('柠檬赚京豆步数换京豆:20000步' + data.msg)
            //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆:20000步\n"+data.msg)
          } else {
            console.log('柠檬赚京豆步数换京豆:20000步' + data.msg)
            //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆20000步\n步数不足或今日你已经兑换")
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve()
        }
      })
    }, timeout)
  })
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
          : 'jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
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
