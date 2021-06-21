/*
* ==UserScript==
* @ScriptName        领现金兑换红包
* @Author            Cuttlefish
* @TgChannel         https://t.me/ddgksf2021
* @WechatID          公众号墨鱼手记
* @UpdateTime        20210309
* @ScriptFunction    红包的有效期只有3天（72小时）
* @UpdateLog         0311 [:] 更换个人信息查询的API接口
* @ScriptURL         https://raw.githubusercontent.com/ddgksf2013/Cuttlefish/master/Jd/jd_cash_exchange.js
* ==/UserScript==
【QuantumultX】 :
*************************
[task_local]
0,1,2 0 * * * https://raw.githubusercontent.com/ddgksf2013/Cuttlefish/master/Jd/jd_cash_exchange.js, tag=领现金兑换红包
*************************
【Loon】 :
*************************
[Script]
cron "0,1,2 0 * * *" script-path=https://raw.githubusercontent.com/ddgksf2013/Cuttlefish/master/Jd/jd_cash_exchange.js,tag=领现金兑换红包
*************************
【Surge】 :
*************************
[Script]
领现金兑换红包 = type=cron,cronexp="0,1,2 0 * * *",wake-system=1,timeout=120,script-path=https://raw.githubusercontent.com/ddgksf2013/Cuttlefish/master/Jd/jd_cash_exchange.js
*************************
【小火箭】 :
*************************
[Script]
领现金兑换红包 = type=cron,script-path=https://raw.githubusercontent.com/ddgksf2013/Cuttlefish/master/Jd/jd_cash_exchange.js, cronexpr="0,1,2 0 * * *", timeout=500, enable=true
*************************
[mitm]
hostname = api.m.jd.com
*/
const $ = new Env('领现金兑换红包');
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const JD_API_HOST = `https://api.m.jd.com/client.action?functionId=cash_getRedPacket`;
let cookiesArr = [], cookie = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
  };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      await TotalBean();
      console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      else{
        await exchange_redpocket();
		await showMsg();
      }
    }
  }
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())

function exchange_redpocket(){
  return new Promise(resolve => {
    $.post(jdUrl('cash_getRedPacket'), (err, resp, data) => {
      try {
        if (err) {
          data = JSON.parse(resp.body);
		  console.log(`Error：${JSON.stringify(data)}`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
			console.log(`Result：${JSON.stringify(data)}`);
			if(data.data.bizCode==0){
				//$.message = data.data.result.shareRewardTip;
				$.message = '成功！';
			}
			else{
				$.message = '今日可兑换的红包已抢完';
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

function showMsg() {
  return new Promise(resolve => {
    $.msg($.name, '', `【京东账号${$.index}】${$.nickName || $.UserName}\n${$.message}`);
    resolve()
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

//?timestamp=${new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000}
function taskUrl(function_id, body = {}) {
  return {
    url: `${JD_API_HOST}${function_id}`,
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "Host": "api.m.jd.com",
      'origin': 'https://h5.m.jd.com',
      "Referer": "https://h5.m.jd.com/babelDiy/Zeus/GzY6gTjVg1zqnQRnmWfMKC4PsT1/index.html",
      "Cookie": cookie,
      "User-Agent": "jdapp;iPhone;9.4.2;13.4.1;e9241834b8e0994edf39389a4d18ff6eeba990f5;network/4g;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone10,1;addressid/2413614733;supportBestPay/0;appBuild/167568;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
    }
  }
}

function jdUrl(function_id, body={}) {
  return {
    url: `https://api.m.jd.com/client.action?functionId=${function_id}`,
    body: 'area=12_904_3375_62168&body=%7B%22type%22%3A%222%22%2C%22amount%22%3A%221000%22%7D&build=167568&client=apple&clientVersion=9.4.2&d_brand=apple&d_model=iPhone10%2C1&eid=eidI7e0881206ds1SM32L/0VTwCr9pypbIK71EjN96Ar5iWtIQ80IdYlQ%2BS9Hquok3hgImlD95zTSq6RCyVM6OOO/6bine%2BXwICjjYPHS2HNCOJRYpA3&isBackground=N&joycious=78&lang=zh_CN&networkType=4g&networklibtype=JDNetworkBaseAF&openudid=e9241834b8e0994edf39389a4d18ff6eeba990f5&osVersion=13.4.1&partner=apple&rfs=0000&scope=11&screen=750%2A1334&sign=be8cfeeadc15ec25063e3bf0b23c8647&st=1614868202765&sv=122&uts=0f31TVRjBSto9/0xW/caLvwNVtr1%2Bfw3D78ba4pjkx%2BE5nueBcxpmyJawSIY2T47vFiOAgL0RXsOi3Dy7y5AZTZXRTRKi%2BTkCxPCG2PTKNtdIugmJsxGXqAvxgVIgQsquSX%2BJvLMjDBDkb2Y%2BVWFukYFF%2BS9y3L4htiO/2pfeiBQuKmmxkGQB51p%2BaTzjj1NKmmUNrYyhK2FqufkI7fg5g%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=unknown',
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*',
      'Host': 'api.m.jd.com',
	  'User-Agent': 'JD4iPhone/167568 (iPhone; iOS 13.4.1; Scale/2.00)',
	  'Accept-Language': 'en-HK;q=1, zh-Hans-HK;q=0.9, zh-Hant-HK;q=0.8',
      'Cookie': cookie
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
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
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
            if (data['retcode'] === 0) {
              $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
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
        resolve();
      }
    })
  })
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
