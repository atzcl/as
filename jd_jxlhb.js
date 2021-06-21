/*
京喜领88元红包
活动入口：京喜app-》我的-》京喜领88元红包
助力逻辑：先自己京东账号相互助力，如有剩余助力机会，则助力作者
温馨提示：如提示助力火爆，可尝试寻找京东客服
脚本兼容: Quantumult X, Surge, Loon, JSBox, Node.js
==============Quantumult X==============
[task_local]
#京喜领88元红包
4 10 * * * https://gitee.com/lxk0301/jd_scripts/raw/master/jd_jxlhb.js, tag=京喜领88元红包, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true

==============Loon==============
[Script]
cron "4 10 * * *" script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_jxlhb.js,tag=京喜领88元红包

================Surge===============
京喜领88元红包 = type=cron,cronexp="4 10 * * *",wake-system=1,timeout=3600,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_jxlhb.js

===============小火箭==========
京喜领88元红包 = type=cron,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_jxlhb.js, cronexpr="4 10 * * *", timeout=3600, enable=true
 */
const $ = new Env('京喜领88元红包');
const notify = $.isNode() ? require('./sendNotify') : {};
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : {};
let cookiesArr = [], cookie = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  });
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [
    $.getdata("CookieJD"),
    $.getdata("CookieJD2"),
    ...$.toObj($.getdata("CookiesJD") || "[]").map((item) => item.cookie)].filter((item) => !!item);
}
$.packetIdArr = [];
$.activeId = '489177';
const BASE_URL = 'https://wq.jd.com/cubeactive/steprewardv3'


!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  console.log('京喜领88元红包\n' +
      '活动入口：京喜app-》我的-》京喜领88元红包\n' +
      '助力逻辑：脚本会助力作者，介意请取消脚本')
  let res = await getAuthorShareCode() || [];
  let res2 = await getAuthorShareCode('https://ghproxy.com/https://raw.githubusercontent.com/zero205/updateTeam/main/shareCodes/jxhb.json') || [];
  if (res && res.activeId) $.activeId = res.activeId;
  $.authorMyShareIds = [...((res && res.codes) || []), ...res2];
  //开启红包,获取互助码
  for (let i = 0; i < cookiesArr.length; i++) {
    $.index = i + 1;
    cookie = cookiesArr[i];
    $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
    await TotalBean();
    console.log(`\n*****开始【京东账号${$.index}】${$.nickName || $.UserName}*****\n`);
    await main();
  }
  //互助
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    $.canHelp = true;
    $.max = false;
    $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
     for (let code of $.packetIdArr) {
       if (!code) continue;
       if ($.UserName === code['userName']) continue;
       if (!$.canHelp) break
       if ($.max) break
       console.log(`【${$.UserName}】去助力【${code['userName']}】邀请码：${code['strUserPin']}`);
       await enrollFriend(code['strUserPin']);
       await $.wait(2500);
     }
    if ($.canHelp) {
      console.log(`\n【${$.UserName}】有剩余助力机会，开始助力作者\n`)
      for (let item of $.authorMyShareIds) {
        if (!item) continue;
        if (!$.canHelp) break
        console.log(`【${$.UserName}】去助力作者的邀请码：${item}`);
        await enrollFriend(item);
        await $.wait(2500);
      }
    }
  }
  //拆红包
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    $.canOpenGrade = true;
    $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
    const grades = [1, 2, 3, 4, 5, 6];
    for (let grade of grades) {
      if (!$.canOpenGrade) break;
      if (!$.packetIdArr[i]) continue;
      console.log(`\n【${$.UserName}】去拆第${grade}个红包`);
      await openRedPack($.packetIdArr[i]['strUserPin'], grade);
      await $.wait(1000);
    }
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })
async function main() {
  await joinActive();
  await getUserInfo()
}
//参与活动
function joinActive() {
  return new Promise(resolve => {
    const body = ""
    const options = taskurl('JoinActive', body, 'activeId,channel,phoneid,publishFlag,stepreward_jstoken,timestamp');
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${$.name}:  API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          // console.log('开启活动', data)
          data = JSON.parse(data)
          if (data.iRet === 0) {
            console.log(`活动开启成功,助力邀请码为:${data.Data.strUserPin}\n`);
          } else {
            console.log(`活动开启失败：${data.sErrMsg}\n`);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
//获取助力码
function getUserInfo() {
  return new Promise(resolve => {
    const body = `joinDate=${$.time('yyyyMMdd')}`;
    const options = taskurl('GetUserInfo', body, 'activeId,channel,joinDate,phoneid,publishFlag,timestamp');
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${$.name}:  API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          // console.log('获取助力码', data)
          data = JSON.parse(data)
          if (data.iRet === 0) {
            console.log(`获取助力码成功：${data.Data.strUserPin}\n`);
            if (data.Data['dwCurrentGrade'] >= 6) {
              console.log(`6个阶梯红包已全部拆完\n`)
            } else {
              if (data.Data.strUserPin) {
                $.packetIdArr.push({
                  strUserPin: data.Data.strUserPin,
                  userName: $.UserName
                })
              }
            }
          } else {
            console.log(`获取助力码失败：${data.sErrMsg}\n`);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
//助力好友
function enrollFriend(strPin) {
  return new Promise(resolve => {
    // console.log('\nstrPin ' + strPin);
    const body = `strPin=${strPin}&joinDate=${$.time('yyyyMMdd')}`
    const options = taskurl('EnrollFriend', body, 'activeId,channel,joinDate,phoneid,publishFlag,strPin,timestamp');
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${$.name}:  API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          // console.log('助力结果', data)
          data = JSON.parse(data)
          if (data.iRet === 0) {
            //{"Data":{"prizeInfo":[]},"iRet":0,"sErrMsg":"成功"}
            console.log(`助力成功🎉:${data.sErrMsg}\n`);
            // if (data.Data.strUserPin) $.packetIdArr.push(data.Data.strUserPin);
          } else {
            if (data.iRet === 2015) $.canHelp = false;//助力已达上限
            if (data.iRet === 2016) {
              $.canHelp = false;//助力火爆
              console.log(`温馨提示：如提示助力火爆，可尝试寻找京东客服`);
            }
            if (data.iRet === 2013) $.max = true;
            console.log(`助力失败:${data.sErrMsg}\n`);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}

function openRedPack(strPin, grade) {
  return new Promise(resolve => {
    const body = `strPin=${strPin}&grade=${grade}`
    const options = taskurl('DoGradeDraw', body, 'activeId,channel,grade,phoneid,publishFlag,stepreward_jstoken,strPin,timestamp');
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${$.name}:  API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          // console.log(`拆红包结果：${data}`);
          data = JSON.parse(data)
          if (data.iRet === 0) {
            console.log(`拆红包成功:${data.sErrMsg}\n`);
          } else {
            if (data.iRet === 2017) $.canOpenGrade = false;
            console.log(`拆红包失败:${data.sErrMsg}\n`);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}

function getAuthorShareCode(url = "https://ghproxy.com/https://raw.githubusercontent.com/zero205/updateTeam/main/shareCodes/jxhb.json") {
  return new Promise(resolve => {
    const options = {
      url: `${url}`, "timeout": 10000, headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }
    };
    if ($.isNode() && process.env.TG_PROXY_HOST && process.env.TG_PROXY_PORT) {
      const tunnel = require("tunnel");
      const agent = {
        https: tunnel.httpsOverHttp({
          proxy: {
            host: process.env.TG_PROXY_HOST,
            port: process.env.TG_PROXY_PORT * 1
          }
        })
      }
      Object.assign(options, { agent })
    }
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
        } else {
          if (data) data = JSON.parse(data)
        }
      } catch (e) {
        // $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
//关键地方
var _0xod9='jsjiami.com.v6',_0x136d=[_0xod9,'LcOZwrHCvcKjbBoaIxU7cWrCilUPNMKnw6kgwrI7SCZgZsK+w5zCsH3CrQPCtlDCmcKQwqrCkMKVEgMWXDJIw7fDp3rDpcOTWW5oJ8OHwpHDmSnCmysnw6rCi8K9w6TDlz9wQMKow7tmIwgMwqbDksKnI8ObD1LDmQ==','wrXCjFZzMsOywovDiMOqwrw=','woA1w49IbG/Dpk0=','w7bCsBnDuw1tw7DCi8KWWsKKwoBUw6UTK8Onw5LDsjTDlzPClipV','w40wH8O4w4fDlS/DhBfCiMOXUsKtw7LCoXTDrsOOAFHCk1gXHFcqwpt+wqTCuG0zwr3CtnoVwpo=','TcKlwqg=','wo0NWg==','w6cZwq5Fa8OMFw==','wrfCvcODwqtm','w77CgmZzKcOtwoDDpg==','w7UGw6nChi0=','wqwUwo5UwphKwrXDnA==','V03CtsK3wrY=','w6/Cv0cgwqXDtA/Csw==','w5TDpzLCvwbDpMKnw6U=','wq3CtiLChMKO','wrUpwo5FfMKYSEc=','NsOBwqzCrsK1','w77ChHlSEsK/acKVwqw=','dcKuD8OvOXxcAsOMwoxBWkLDkVRUwpx7w54X','NcKXDsOfCg==','wrjCkD7CssKo','IcK8FcOuJmM=','UE7CjMKgwqEswrnCqA==','wqLCm8Ofwp1A','VHvCrMKiw5/DjA==','wqXCqWPCkcK2wpzDhwQ=','NMOJwqLDoms=','w5XCixvCnsOdwrM=','woPCvgHDhD9P','w4rCg3IEwo4=','TH7CssKvw57DhsOUfRNxwrpTwqvCksKFwq0UYcOdw7p4G8KtCH3Dk359Zw==','w7IwQ3XDlsKmw7zCm8OSaMOvGQkNUx1lw7w0wpDCmcKaw6TDiBNyLcK3w5EGVi/Cr8Kcw6tkw6PDpmfCisOvenJCw4/Dr8OlAcKZEExPWzrCi1V/w5ZxHcKHwogFHsK5HF03QzbCm8KWwoMFOyBswrc/wrrDkwICdAgzXAxNOcOyKArCnDlawrUMVsKxw7/CosKdwqjCiAXDsMOcwoFJwo4Uw7BLCcO7w7/Dqk3CrX9swq3CusOkNWbCpl0owoTCiQsvwpLCu2ZCYMOYwpfCrHnCjQ/CgUgsZMKJw6fCs8OIwpzCsHPDtcOUw6Ffw7HCl8O/XcO+PcOWw5V5wpZXwoDDvAvDkTXDjcO5wrVfbVNXNFl2wpNpw6/DhhhlwpJQw4d3DcO3GR8jwp1Gw4rCrcKENnZUw7t4ZMOjwoPCrMKdc0DDnsO4Tx7DiXzCrVcUE8KuQn/DtT8zw67CgktVw6oowpZ6wpTDgsOHOMKqw5rDnMKGN2TDixYsCsO+woXCrcKyw47DkQPCpyXDrgEcUcOrwrDCjMKHwrPDjT1xw6NufcK4akxEfsKfScOtLUMCwovDqCNeF0tawqTDj1zCpgjDk8OELDXDksO8w5w/w6rDhynDoMOhY8Ofw53DoB9Ew6Q6w7YiG8KEWV9lwp7DmDIl','wpLCh0PCg8Kt','JMKsVcOgLSBaGsOA','wpQ/wpE=','WuYBnjQsyrOjYbXihaAmi.com.v6=='];(function(_0x4d3f8b,_0x29a86b,_0x4d9443){var _0x4368bc=function(_0x535f7a,_0x2d7fbb,_0x5d13c1,_0x120242,_0x1ad1b8){_0x2d7fbb=_0x2d7fbb>>0x8,_0x1ad1b8='po';var _0x16bb74='shift',_0x2b3d51='push';if(_0x2d7fbb<_0x535f7a){while(--_0x535f7a){_0x120242=_0x4d3f8b[_0x16bb74]();if(_0x2d7fbb===_0x535f7a){_0x2d7fbb=_0x120242;_0x5d13c1=_0x4d3f8b[_0x1ad1b8+'p']();}else if(_0x2d7fbb&&_0x5d13c1['replace'](/[WuYBnQyrOYbXhA=]/g,'')===_0x2d7fbb){_0x4d3f8b[_0x2b3d51](_0x120242);}}_0x4d3f8b[_0x2b3d51](_0x4d3f8b[_0x16bb74]());}return 0x8dcf9;};return _0x4368bc(++_0x29a86b,_0x4d9443)>>_0x29a86b^_0x4d9443;}(_0x136d,0x142,0x14200));var _0x530e=function(_0x31f656,_0x242e53){_0x31f656=~~'0x'['concat'](_0x31f656);var _0x34c2fe=_0x136d[_0x31f656];if(_0x530e['zinAVS']===undefined){(function(){var _0x1903df=typeof window!=='undefined'?window:typeof process==='object'&&typeof require==='function'&&typeof global==='object'?global:this;var _0x16c579='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x1903df['atob']||(_0x1903df['atob']=function(_0x4d5f1a){var _0x5f3741=String(_0x4d5f1a)['replace'](/=+$/,'');for(var _0xbd09e=0x0,_0x26cb73,_0x187650,_0x10d2ee=0x0,_0x42a525='';_0x187650=_0x5f3741['charAt'](_0x10d2ee++);~_0x187650&&(_0x26cb73=_0xbd09e%0x4?_0x26cb73*0x40+_0x187650:_0x187650,_0xbd09e++%0x4)?_0x42a525+=String['fromCharCode'](0xff&_0x26cb73>>(-0x2*_0xbd09e&0x6)):0x0){_0x187650=_0x16c579['indexOf'](_0x187650);}return _0x42a525;});}());var _0x18e77a=function(_0x5ae3e4,_0x242e53){var _0x494202=[],_0x387ed3=0x0,_0x464d2f,_0x3f58e9='',_0x4b8300='';_0x5ae3e4=atob(_0x5ae3e4);for(var _0x23d0bc=0x0,_0x114f99=_0x5ae3e4['length'];_0x23d0bc<_0x114f99;_0x23d0bc++){_0x4b8300+='%'+('00'+_0x5ae3e4['charCodeAt'](_0x23d0bc)['toString'](0x10))['slice'](-0x2);}_0x5ae3e4=decodeURIComponent(_0x4b8300);for(var _0x2f8df4=0x0;_0x2f8df4<0x100;_0x2f8df4++){_0x494202[_0x2f8df4]=_0x2f8df4;}for(_0x2f8df4=0x0;_0x2f8df4<0x100;_0x2f8df4++){_0x387ed3=(_0x387ed3+_0x494202[_0x2f8df4]+_0x242e53['charCodeAt'](_0x2f8df4%_0x242e53['length']))%0x100;_0x464d2f=_0x494202[_0x2f8df4];_0x494202[_0x2f8df4]=_0x494202[_0x387ed3];_0x494202[_0x387ed3]=_0x464d2f;}_0x2f8df4=0x0;_0x387ed3=0x0;for(var _0x3828c5=0x0;_0x3828c5<_0x5ae3e4['length'];_0x3828c5++){_0x2f8df4=(_0x2f8df4+0x1)%0x100;_0x387ed3=(_0x387ed3+_0x494202[_0x2f8df4])%0x100;_0x464d2f=_0x494202[_0x2f8df4];_0x494202[_0x2f8df4]=_0x494202[_0x387ed3];_0x494202[_0x387ed3]=_0x464d2f;_0x3f58e9+=String['fromCharCode'](_0x5ae3e4['charCodeAt'](_0x3828c5)^_0x494202[(_0x494202[_0x2f8df4]+_0x494202[_0x387ed3])%0x100]);}return _0x3f58e9;};_0x530e['eROVYc']=_0x18e77a;_0x530e['kTcWSN']={};_0x530e['zinAVS']=!![];}var _0x3f1615=_0x530e['kTcWSN'][_0x31f656];if(_0x3f1615===undefined){if(_0x530e['RNUlzr']===undefined){_0x530e['RNUlzr']=!![];}_0x34c2fe=_0x530e['eROVYc'](_0x34c2fe,_0x242e53);_0x530e['kTcWSN'][_0x31f656]=_0x34c2fe;}else{_0x34c2fe=_0x3f1615;}return _0x34c2fe;};function taskurl(_0x10552c,_0x55ed91='',_0x53d809){var _0x195ffb={'fJuUC':function(_0x3e4e56,_0xb2386d){return _0x3e4e56+_0xb2386d;},'QSfPY':function(_0x5c5b33,_0x35de7a){return _0x5c5b33(_0x35de7a);},'YDCux':_0x530e('0','XYTi'),'RlBCI':_0x530e('1','2R&V'),'CAsfi':_0x530e('2','fYxG')};let _0x19d082=BASE_URL+'/'+_0x10552c+_0x530e('3','GT]x')+$[_0x530e('4','Y#&3')]+_0x530e('5','b@yi')+_0x55ed91+_0x530e('6','AKWG')+Date['now']()+_0x530e('7','pWj!')+(Date[_0x530e('8','8)3j')]()+0x2)+_0x530e('9','InMP');const _0x3968f3=_0x195ffb[_0x530e('a','dTWA')](_0x195ffb['fJuUC'](_0x195ffb['fJuUC'](Math['random']()[_0x530e('b','GT]x')](0x24)[_0x530e('c',')y[8')](0x2,0xa),Math['random']()[_0x530e('d','F!jF')](0x24)[_0x530e('e','h!e[')](0x2,0xa))+Math['random']()[_0x530e('f','pI^2')](0x24)['slice'](0x2,0xa),Math['random']()[_0x530e('10','Tlfp')](0x24)[_0x530e('11','*8UT')](0x2,0xa)),Math['random']()[_0x530e('12','InMP')](0x24)[_0x530e('13','fYxG')](0x2,0xa));_0x19d082+=_0x530e('14','rZlY')+_0x3968f3;_0x19d082+=_0x530e('15','XYTi')+_0x195ffb[_0x530e('16','XYTi')](_0x195ffb[_0x530e('17','*8UT')](Math[_0x530e('18','XYTi')]()[_0x530e('19','h!e[')](0x24)[_0x530e('1a','dTWA')](0x2,0xa),Math[_0x530e('1b',')hAe')]()[_0x530e('1c','L$CO')](0x24)[_0x530e('1d','uSZc')](0x2,0xa))+Math['random']()['toString'](0x24)['slice'](0x2,0xa),Math[_0x530e('1e','iAuv')]()[_0x530e('f','pI^2')](0x24)[_0x530e('11','*8UT')](0x2,0xa));if(_0x53d809){_0x19d082+=_0x530e('1f','EfqF')+_0x195ffb[_0x530e('20','pI^2')](encodeURIComponent,_0x53d809);}return{'url':_0x19d082,'headers':{'Host':_0x195ffb['YDCux'],'Cookie':cookie,'accept':_0x195ffb['RlBCI'],'user-agent':_0x530e('21',')hAe')+_0x3968f3+_0x530e('22','nC@y'),'accept-language':'zh-cn','referer':_0x195ffb[_0x530e('23','L$CO')]}};};_0xod9='jsjiami.com.v6';

function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      url: "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
      headers: {
        Host: "me-api.jd.com",
        Accept: "*/*",
        Connection: "keep-alive",
        Cookie: cookie,
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        "Accept-Language": "zh-cn",
        "Referer": "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
        "Accept-Encoding": "gzip, deflate, br"
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          $.logErr(err)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === "1001") {
              $.isLogin = false; //cookie过期
              return;
            }
            if (data['retcode'] === "0" && data.data && data.data.hasOwnProperty("userInfo")) {
              $.nickName = data.data.userInfo.baseInfo.nickname;
            }
          } else {
            $.log('京东服务器返回空数据');
          }
        }
      } catch (e) {
        $.logErr(e)
      } finally {
        resolve();
      }
    })
  })
}
