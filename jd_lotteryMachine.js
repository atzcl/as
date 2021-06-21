/*
京东抽奖机 https://raw.githubusercontent.com/yangtingxiao/QuantumultX/master/scripts/jd/jd_lotteryMachine.js
author：yangtingxiao
github： https://github.com/yangtingxiao
活动入口：京东APP中各种抽奖活动的汇总

修改自用 By xxx
更新时间：2021-05-25 8:50
 */
const $ = new Env('京东抽奖机&内部互助');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let cookiesArr = [], cookie = '';
Object.keys(jdCookieNode).forEach((item) => {
  cookiesArr.push(jdCookieNode[item])
})
// if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
// if (JSON.stringify(process.env).indexOf('GITHUB') > -1) process.exit(0);

const appIdArr = ['1EFRRxA','1EFRQwA','1EFRYxQ','1EFRXxg','1EFVRwA','1EFVRxw','1EFRZwA','1EFRZwQ','1EFRYwA','1EFVRxg','1EFVRxQ']
const homeDataFunPrefixArr = ['interact_template','interact_template','harmony_template','','','','','','','','','','','','','','','interact_template','interact_template']
const collectScoreFunPrefixArr = ['','','','','','','','','','','','','','','','','','interact_template','interact_template']

$.allShareId = {};
main();
async function main() {
  await help();//先账号内部互助
  await updateShareCodes();
  if (!$.body) await updateShareCodesCDN();
  if ($.body) {
    eval($.body);
  }
  $.http.get({url: `https://purge.jsdelivr.net/gh/yangtingxiao/QuantumultX@master/scripts/jd/jd_lotteryMachine.js`}).then((resp) => {
    if (resp.statusCode === 200) {
      let { body } = resp;
      body = JSON.parse(body);
      if (body['success']) {
        console.log(`jd_lotteryMachine.js文件  CDN刷新成功`)
      } else {
        console.log(`jd_lotteryMachine.js文件 CDN刷新失败`)
      }
    }
  }).catch((err) => console.log(`更新jd_lotteryMachine.js文件 CDN异常`, err));
}
async function help() {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
    return;
  }
  console.log(`\n\n当前共有${appIdArr.length}个抽奖机活动\n\n`);
  for (let j in appIdArr) {
    $.invites = [];
    $.appId = appIdArr[j];
    $.appIndex = parseInt(j) + 1;
    homeDataFunPrefix = homeDataFunPrefixArr[j] || 'healthyDay';
    console.log(`\n第${parseInt(j) + 1}个抽奖活动【${$.appId}】`)
    console.log(`functionId：${homeDataFunPrefix}_getHomeData`);
    $.acHelpFlag = true;//该活动是否需要助力，true需要，false 不需要
    for (let i = 0; i < cookiesArr.length; i++) {
      cookie = cookiesArr[i];
      if (cookie) {
        $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
        console.log(`\n***************开始京东账号${i + 1} ${$.UserName}***************`)
        await interact_template_getHomeData();
      }
      if (i === 0 && !$.acHelpFlag) {
        console.log(`\n第${parseInt(j) + 1}个抽奖活动【${$.appId}】,不需要助力`);
        break;
      }
    }
    if ($.invites.length > 0) {
      $.allShareId[appIdArr[j]] = $.invites;
    }
  }
  // console.log('$.allShareId', JSON.stringify($.allShareId))
  if (!cookiesArr || cookiesArr.length < 2) return
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    $.index = i + 1;
    $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
    for (let oneAppId in $.allShareId) {
      let oneAcHelpList = $.allShareId[oneAppId];
      for (let j = 0; j < oneAcHelpList.length; j++) {
        $.item = oneAcHelpList[j];
        if ($.UserName === $.item['userName']) continue;
        if (!$.item['taskToken'] && !$.item['taskId'] || $.item['max']) continue
        console.log(`账号${i + 1} ${$.UserName} 去助力账号 ${$.item['userName']}的第${$.item['index']}个抽奖活动【${$.item['appId']}】，邀请码 【${$.item['taskToken']}】`)
        $.canHelp = true;
        collectScoreFunPrefix = collectScoreFunPrefixArr[$.item['index'] - 1] || 'harmony'
        await harmony_collectScore();
        if (!$.canHelp) {
          // console.log(`跳出`);
          break;//此处如果break，则遇到第一个活动就无助力机会时，不会继续助力第二个活动了
        }
      }
    }
  }
}
function interact_template_getHomeData(timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://api.m.jd.com/client.action`,
        headers : {
          'Origin' : `https://h5.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Referer' : `https://h5.m.jd.com/babelDiy/Zeus/2WBcKYkn8viyxv7MoKKgfzmu7Dss/index.html`,
          'Host' : `api.m.jd.com`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body: `functionId=${homeDataFunPrefix}_getHomeData&body={"appId":"${$.appId}","taskToken":""}&client=wh5&clientVersion=1.0.0`
      }

      $.post(url, async (err, resp, data) => {
        try {
          let invitesFlag = false;
          data = JSON.parse(data);
          if (data['code'] === 0) {
            if (data.data && data.data.bizCode === 0) {
              for (let item of data.data.result.taskVos) {
                if ([14, 6].includes(item.taskType)) {
                  console.log(`邀请码：${item.assistTaskDetailVo.taskToken}`)
                  console.log(`邀请好友助力：${item.times}/${item['maxTimes']}\n`);
                  if (item.assistTaskDetailVo.taskToken && item.taskId && item.times !== item['maxTimes']) {
                    $.invites.push({
                      taskToken: item.assistTaskDetailVo.taskToken,
                      taskId: item.taskId,
                      userName: $.UserName,
                      appId: $.appId,
                      index: $.appIndex,
                      max: false
                    })
                  }
                  invitesFlag = true;//该活动存在助力码
                }
              }
              if (!invitesFlag) {
                $.acHelpFlag = false;
              }
            } else {
              console.log(`获取抽奖活动数据失败：${data.data.bizMsg}`);
              $.invites.push({
                taskToken: null,
                taskId: null,
                userName: $.UserName,
                appId: $.appId,
                index: $.appIndex
              })
            }
          } else {
            console.log(`获取抽奖活动数据异常：${JSON.stringify(data)}`)
            $.invites.push({
              taskToken: null,
              taskId: null,
              userName: $.UserName,
              appId: $.appId,
              index: $.appIndex
            })
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}
//做任务
function harmony_collectScore(timeout = 0) {
  // console.log(`助力 ${taskToken}`)
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://api.m.jd.com/client.action`,
        headers: {
          "Accept": "application/json, text/plain, */*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "zh-cn",
          "Connection": "keep-alive",
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": cookie,
          "Host": "api.m.jd.com",
          "Origin": "https://h5.m.jd.com",
          "Referer": `https://h5.m.jd.com/babelDiy/Zeus/ahMDcVkuPyTd2zSBmWC11aMvb51/index.html?inviteId=${$.item['taskToken']}`,
          "User-Agent": "jdapp;iPhone;9.4.6;14.3;88732f840b77821b345bf07fd71f609e6ff12f43;network/4g;ADID/B28DA848-0DA0-4AAA-AE7E-A6F55695C590;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone11,8;addressid/2005183373;supportBestPay/0;appBuild/167618;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"
        },
        body: `functionId=${collectScoreFunPrefix}_collectScore&body={"appId": "${$.appId}","taskToken":"${$.item['taskToken']}","taskId":${$.item['taskId']},"actionType": 0}&client=wh5&clientVersion=1.0.0`
      }
      $.post(url, async (err, resp, data) => {
        try {
          // console.log(data)
          data = JSON.parse(data);
          if (data['code'] === 0) {
            if (data['data']['bizCode'] === 0) {
              console.log(`助力结果：${data.data.bizMsg}🎉\n`);
            } else {
              if (data['data']['bizCode'] === 108) $.canHelp = false;
              if (data['data']['bizCode'] === 103) $.item['max'] = true;
              console.log(`助力失败：${data.data.bizMsg}\n`);
            }
          } else {
            console.log(`助力异常：${JSON.stringify(data)}\n`);
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    }, timeout)
  })
}

function updateShareCodes(url = 'https://raw.githubusercontent.com/yangtingxiao/QuantumultX/master/scripts/jd/jd_lotteryMachine.js') {
  return new Promise(resolve => {
    const options = {
      url: `${url}?${Date.now()}`, "timeout": 10000, headers: {
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
          console.log(`请求访问 【raw.githubusercontent.com】 的jd_lotteryMachine.js文件失败：${JSON.stringify(err)}\n\n下面使用 【cdn.jsdelivr.net】请求访问jd_lotteryMachine.js文件`)
        } else {
          $.body = data;
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function updateShareCodesCDN(url = 'https://cdn.jsdelivr.net/gh/yangtingxiao/QuantumultX@master/scripts/jd/jd_lotteryMachine.js') {
  return new Promise(async resolve => {
    $.get({url: `${url}?${Date.now()}`, timeout: 10000}, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          $.body = data;
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
    await $.wait(3000)
    resolve();
  })
}
