/**
*
  Name:财富岛提现
  Address: 京喜App ====>>>> 全民赚大钱
  Author：MoPoQAQ  ====>>>> 由zero205（zero205）进行二次修改，兼容elecV2P运行
  Update: 2021/2/2 13:00
  Thanks:
    💢疯疯💢
    银河大佬：https://github.com/zbt494
 * 获取京喜tokens方式
 * 打开京喜农场，手动完成任意任务，必须完成任务领到水滴，提示获取cookie成功
 * 打开京喜工厂，收取电力，提示获取cookie成功
 * 打开京喜财富岛，手动成功提现一次，提示获取cookie成功
 * 手动任意完成，提示获取cookie成功即可，然后退出跑任务脚本

  hostname = wq.jd.com, m.jingxi.com

  # quanx
  [rewrite_local]
  ^https\:\/\/wq\.jd\.com\/cubeactive\/farm\/dotask url script-request-header https://raw.githubusercontent.com/whyour/hundun/master/quanx/jx_tokens.js
  ^https\:\/\/m\.jingxi\.com\/dreamfactory\/generator\/CollectCurrentElectricity url script-request-header https://raw.githubusercontent.com/whyour/hundun/master/quanx/jx_tokens.js
  ^https\:\/\/m\.jingxi\.com\/jxcfd\/consume\/CashOut url script-request-header https://raw.githubusercontent.com/whyour/hundun/master/quanx/jx_tokens.js

  # loon
  [Script]
  http-request ^https\:\/\/wq\.jd\.com\/cubeactive\/farm\/dotask script-path=https://raw.githubusercontent.com/whyour/hundun/master/quanx/jx_tokens.js, requires-body=false, timeout=10, tag=京喜token
  http-request ^https\:\/\/m\.jingxi\.com\/dreamfactory\/generator\/CollectCurrentElectricity script-path=https://raw.githubusercontent.com/whyour/hundun/master/quanx/jx_tokens.js, requires-body=false, timeout=10, tag=京喜token
  http-request ^^https\:\/\/m\.jingxi\.com\/jxcfd\/consume\/CashOut script-path=https://raw.githubusercontent.com/whyour/hundun/master/quanx/jx_tokens.js, requires-body=false, timeout=10, tag=京喜token

  # surge
  [Script]
  京喜token = type=http-request,pattern=^https\:\/\/wq\.jd\.com\/cubeactive\/farm\/dotask,requires-body=0,max-size=0,script-path=https://raw.githubusercontent.com/whyour/hundun/master/quanx/jx_tokens.js
  京喜token = type=http-request,pattern=^https\:\/\/m\.jingxi\.com\/dreamfactory\/generator\/CollectCurrentElectricity,requires-body=0,max-size=0,script-path=https://raw.githubusercontent.com/whyour/hundun/master/quanx/jx_tokens.js
  京喜token = type=http-request,pattern=^https\:\/\/m\.jingxi\.com\/jxcfd\/consume\/CashOut,requires-body=0,max-size=0,script-path=https://raw.githubusercontent.com/whyour/hundun/master/quanx/jx_tokens.js

*
**/

const $ = new Env("京喜财富岛提现");
const JD_API_HOST = "https://m.jingxi.com/";
const jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
const jdTokenNode = $.isNode() ? require('./jdJxncTokens.js') : '';
$.result = [];
$.cookieArr = [];
$.currentCookie = '';
$.tokenArr = [];
$.currentToken = {'farm_jstoken': '', 'phoneid': '', 'timestamp': ''};
$.strPhoneID = '';
$.strPgUUNum = '';
$.userName = '';

!(async () => {
  if (!getCookies()) return;
  if (!getTokens()) return;
  for (let i = 0; i < $.cookieArr.length; i++) {
    $.currentCookie = $.cookieArr[i];
    $.currentToken = $.tokenArr[i];
    if ($.currentCookie && $.currentToken) {
      $.userName =  decodeURIComponent($.currentCookie.match(/pt_pin=(.+?);/) && $.currentCookie.match(/pt_pin=(.+?);/)[1]);
      $.log(`\n开始【京东账号${i + 1}】${$.userName}`);

      await cashOut();
    }
  }
  await showMsg();
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done());

function cashOut() {
  return new Promise(async (resolve) => {
    $.get(
      taskUrl(
        `consume/CashOut`,
        `ddwMoney=100&dwIsCreateToken=0&ddwMinPaperMoney=100000&strPgtimestamp=${$.currentToken['timestamp']}&strPhoneID=${$.currentToken['phoneid']}&strPgUUNum=${$.currentToken['farm_jstoken']}`
      ),
      async (err, resp, data) => {
        try {
          $.log(data);
          const { iRet, sErrMsg } = JSON.parse(data);
          $.log(sErrMsg);
          $.result.push(`【${$.userName}】\n ${sErrMsg == "" ? sErrMsg="今天手气太棒了" : sErrMsg}`);
          resolve(sErrMsg);
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve();
        }
      }
    );
  });
}

function taskUrl(function_path, body) {
  return {
    url: `${JD_API_HOST}jxcfd/${function_path}?strZone=jxcfd&bizCode=jxcfd&source=jxcfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=&${body}&_stk=_cfd_t%2CbizCode%2CddwMinPaperMoney%2CddwMoney%2CdwEnv%2CdwIsCreateToken%2Cptag%2Csource%2CstrPgUUNum%2CstrPgtimestamp%2CstrPhoneID%2CstrZone&_ste=1&_=${Date.now()}&sceneval=2&g_login_type=1&g_ty=ls`,
    headers: {
      Cookie: $.currentCookie,
      Accept: "*/*",
      Connection: "keep-alive",
      Referer:"https://st.jingxi.com/fortune_island/cash.html?jxsid=16115391812299482601&_f_i_jxapp=1",
      "Accept-Encoding": "gzip, deflate, br",
      Host: "m.jingxi.com",
      "User-Agent":"jdpingou;iPhone;4.1.4;14.3;9f08e3faf2c0b4e72900552400dfad2e7b2273ba;network/wifi;model/iPhone11,6;appBuild/100415;ADID/00000000-0000-0000-0000-000000000000;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/0;hasOCPay/0;supportBestPay/0;session/428;pap/JA2019_3111789;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
      "Accept-Language": "zh-cn",
    },
  };
}

function getCookies() {
  if ($.isNode()) {
    $.cookieArr = Object.values(jdCookieNode);
  } else {
    $.cookieArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
  }
  if (!$.cookieArr[0]) {
    $.msg(
      $.name,
      "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取",
      "https://bean.m.jd.com/",
      {
        "open-url": "https://bean.m.jd.com/",
      }
    );
    return false;
  }
  return true;
}

function getTokens() {
  if ($.isNode()) {
    Object.keys(jdTokenNode).forEach((item) => {
      $.tokenArr.push(jdTokenNode[item] ? JSON.parse(jdTokenNode[item]) : '{}');
    })
  } else {
    $.tokenArr = JSON.parse($.getdata('jx_tokens') || '[]');
  }
  if (!$.tokenArr[0]) {
    $.msg(
      $.name,
      "【⏰提示】请先获取京喜Token\n获取方式见脚本说明"
    );
    return false;
  }
  return true;
}

function showMsg() {
  return new Promise((resolve) => {
    if ($.notifyTime) {
      const notifyTimes = $.notifyTime.split(",").map((x) => x.split(":"));
      const now = $.time("HH:mm").split(":");
      $.log(`\n${JSON.stringify(notifyTimes)}`);
      $.log(`\n${JSON.stringify(now)}`);
      if (
        notifyTimes.some((x) => x[0] === now[0] && (!x[1] || x[1] === now[1]))
      ) {
        $.msg($.name, "", `\n${$.result.join("\n")}`);
      }
    } else {
      $.msg($.name, "", `\n${$.result.join("\n")}`);
    }
    resolve();
  });
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
