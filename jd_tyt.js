/*
#自定义变量
export tytpacketId=""
 [task_local]
#柠檬推一推
0 0 * * * http://nm66.top/jd_tyt.js, tag=柠檬推一推, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true
*/
const $ = new Env('柠檬推一推');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';

//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;
let tytpacketId = '7588666c4b5c40a082a62341a9265acb-amRfTHlWeVlJWmpmeU9t';
// if (process.env.tytpacketId) {
//   tytpacketId = process.env.tytpacketId;
// }

//兼容elecV2P
tytpacketId = $.getdata('tytpacketId') ? $.getdata('tytpacketId') : tytpacketId;
if ($.isNode() && process.env.TYT_PACKETID) {
    tytpacketId = process.env.TYT_PACKETID;
}

if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
const JD_API_HOST = 'https://api.m.jd.com/client.action';

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
      await $.wait(10000)
      await tythelp()
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })
function tythelp() {
    return new Promise(async (resolve) => {

        let options = {
            url: `https://api.m.jd.com/?t=1623066557140`,
            //dS%2Bp85VyjydPuAOOnFP%2Faw%3D%3D
            body: `functionId=helpCoinDozer&appid=station-soa-h5&client=H5&clientVersion=1.0.0&t=1623120183787&body={"actId":"b980f1dd277a4ae4a0f52918709469bb","channel":"coin_dozer","antiToken":"mmkajtm9eqonssy6xoi1623119406463ic84~NmZeSyVEbFNSd3V+dVNdA3pxAABkRHpTBiUjb35DFm5vLUROOBEzLUF7G28iAAFBKBgVFA1EPwIVKDclGENXbm8iVlQiAwpTTx1lKSsTCG5vfmsaDUR6LUEnG29+PU9ReSdSWTNTNxICI3V0dlYOV3p0Bwg3UW9IVnd+KSdUC1E3KQFkc0oKUwoyKhFmWzEQOTZCXQ1Eei1BKTQ5GENXbm80Qks5ATkdB28tKWoCAl8RZhtkcxY4LUF7G29rPU8eEWZHTA1EbC1BKTM5NBJXbm9oaxohDwpTWR1lf3RNWR56aAcUYUpnQFcdZTBmTU9XKSBEX3NcdEEFMDdvaEMOQW9+FV82CDAUAXhzfTEDXV07I0VUZx49F1MucyosBwIHeTFSDycPIlNPYyRvfkMDQCwiBFo1VWFHBzsuPnVZB185dQEKYlZkRFR3cnVxUAFFf3QVFHMCJR9Be2U3MwkVQC8nWBp9RD8CQXtlfGZNT1gkJxUCc19vSFpjOg==|~1623120183785~1~20201218~eyJ2aXdlIjoiMCIsImJhaW4iOnt9fQ==~2~281~1pl4|5563f-70,aa,,;751e-,,,;359-70,aa,40,u;b512-70,aa,40,u;058-70,aa,40,u;doei:,1,0,0,0,0,1000,-1000,1000,-1000;dmei:,1,0,0,1000,-1000,1000,-1000,1000,-1000;emc:,5:1;emmm:;emcf:,5:1;ivli:;iivl:;ivcvj:;scvje:;ewhi:,5:197-49;1623120175774,1623120183784,0,1,5,5,0,1,0,0,0;u5ge","referer":"-1","frontendInitStatus":"s","packetId":"${tytpacketId}","helperStatus":"0"}&_ste=1&_stk=appid,body,client,clientVersion,functionId,t&h5st=20210608104303790;8489907903583162;10005;tk01w89681aa9a8nZDdIanIyWnVuWFLK4gnqY+05WKcPY3NWU2dcfa73B7PBM7ufJEN0U+4MyHW5N2mT/RNMq72ycJxH;7e6b956f1a8a71b269a0038bbb4abd24bcfb834a88910818cf1bdfc55b7b96e5`,
            headers: {
                "Origin": "https://pushgold.jd.com",
                "Host": "api.m.jd.com",
                "User-Agent": "jdltapp;iPhone;3.3.6;14.3;75aeceef3046d8ce11d354ff89af9517a2e4aa18;network/wifi;hasUPPay/0;pushNoticeIsOpen/0;lang/zh_CN;model/iPhone9,2;addressid/4585826605;hasOCPay/0;appBuild/1060;supportBestPay/0;pv/53.31;apprpd/;ref/https://invite-reward.jd.com/?lng=106.286950&lat=29.969353&sid=547255867e847394aedfb6d68c3e50fw&un_area=4_48201_54794_0#/invitee?inviterId=dS%2Bp85VyjydPuAOOnFP%2Faw%3D%3D;psq/0;ads/;psn/75aeceef3046d8ce11d354ff89af9517a2e4aa18|89;jdv/0|kong|t_1001003207_1762319_6901310|jingfen|30578707801140d09fcd54e5cd83bbf7|1621510932517|1621511027;adk/;app_device/IOS;pap/JA2020_3112531|3.3.6|IOS 14.3;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
                "Cookie": cookie,
            }
        }
        $.post(options, async (err, resp, data) => {
            try {
                data = JSON.parse(data);
                console.log(data.msg)
                if (data.code == 0) {
                    console.log("帮推：" + data.data.amount)
                } else
                    console.log(data.msg)
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

async function taskPostUrl(functionId,body) {
  return {
    url: `${JD_API_HOST}`,
    body: `functionId=${functionId}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0&appid=content_ecology&uuid=6898c30638c55142969304c8e2167997fa59eb54&t=1622588448365`,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Accept-Language': 'zh-cn',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  }
}


async function TotalBean() {
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
async function safeGet(data) {
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
