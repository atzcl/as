/*
50 8 * * * jd_plusReward.js
*/
const $ = new Env('逛PLUS抽京豆');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
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
      await main()
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
  let encryptAssignmentId, exchangeRate, scoreExchangeId
  let queryInteractiveInfo = await doApi("queryInteractiveInfo", {"encryptProjectId":"U13AR7JM6UNr2okmamEig7TD4Ef","ext":{"rewardEncryptAssignmentId":null,"needNum":50},"sourceCode":"aceaceqingzhan"})
  for (let key of Object.keys(queryInteractiveInfo.assignmentList)) {
    let vo = queryInteractiveInfo.assignmentList[key]
    if (vo.userVerificationInfo.userQulification) {
      if ([1].includes(vo.assignmentType)) {
        console.log(`去做【${vo.assignmentName}】`)
        if (vo.ext[vo.ext.extraType][0].status !== 2) {
          let doInteractiveAssignment = await doApi("doInteractiveAssignment", {"encryptProjectId":"U13AR7JM6UNr2okmamEig7TD4Ef","encryptAssignmentId":vo.encryptAssignmentId,"itemId":vo.ext[vo.ext.extraType][0].itemId,"sourceCode":"aceaceqingzhan"})
          if (doInteractiveAssignment.subCode === "0") {
            for (let key of Object.keys(doInteractiveAssignment.rewardsInfo.successRewards)) {
              let successRewards = doInteractiveAssignment.rewardsInfo.successRewards[key]
              console.log(`${doInteractiveAssignment.msg},获得${successRewards.quantityDetails[0].quantity}${successRewards.quantityDetails[0].rewardName}`)
            }
          } else {
            console.log(JSON.stringify(doInteractiveAssignment));
          }
          await $.wait(2000)
        } else {
          console.log(`任务已完成`);
        }
      } else if (vo.assignmentType === 30) {
        encryptAssignmentId = vo.encryptAssignmentId;
        exchangeRate = vo.exchangeRate
        scoreExchangeId = vo.scoreExchangeId
      }
    } else {
      console.log(`您不是PLUS会员，无法参与此活动`)
      return
    }
  }
  let queryInteractiveRewardInfo = await doApi("queryInteractiveRewardInfo", {"encryptProjectId":"U13AR7JM6UNr2okmamEig7TD4Ef","ext":{"detailEncryptAssignmentIds":[],"needExchangeRestScore":1,"detailTypeFlag":"1"},"sourceCode":"aceaceqingzhan"})
  let lotteryNum, usedScore
  if (queryInteractiveRewardInfo.subCode === "0") {
    usedScore = queryInteractiveRewardInfo.exchangeRestScoreMap[scoreExchangeId]
    lotteryNum = Math.floor(usedScore / exchangeRate)
    console.log(`\n可以抽奖${lotteryNum}次`)
    for (let i = lotteryNum; i > 0; i--) {
      let doInteractiveAssignment = await doApi("doInteractiveAssignment", {"encryptProjectId":"U13AR7JM6UNr2okmamEig7TD4Ef","encryptAssignmentId":encryptAssignmentId,"completionFlag":true,"ext":{"exchangeNum":1},"sourceCode":"aceaceqingzhan"})
      if (doInteractiveAssignment.subCode === "0") {
        for (let key of Object.keys(doInteractiveAssignment.rewardsInfo.successRewards)) {
          let successRewards = doInteractiveAssignment.rewardsInfo.successRewards[key]
          if (key === "3") {
            console.log(`获得${successRewards[0].quantity}京豆`);
          } else {
            console.log(JSON.stringify(doInteractiveAssignment));
          }
        }
      } else {
        console.log(JSON.stringify(doInteractiveAssignment));
      }
      await $.wait(2000)
    }
  }
}

function doApi(functionId, body) {
  return new Promise(resolve=> {
    let options = {
      url: `https://api.m.jd.com/client.action?functionId=${functionId}`,
      body: `appid=babelh5&body=${encodeURIComponent(JSON.stringify(body))}&sign=11&t=${Date.now()}`,
      headers: {
        "Host": "api.m.jd.com",
        "Accept": "*/*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Origin": "https://prodev.m.jd.com",
        "Accept-Language": "zh-CN,zh-Hans;q=0.9",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        "Referer": "https://prodev.m.jd.com/",
        "Accept-Encoding": "gzip, deflate, br",
        "Cookie": cookie
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(JSON.stringify(err))
          console.log(`${$.name} ${functionId} API请求失败，请检查网路重试`);
          resolve()
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
        resolve()
      } finally {
        resolve(data)
      }
    })
  })
}

function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      url: "https://wq.jd.com/user_new/info/GetJDUserInfoUnion?sceneval=2",
      headers: {
        Host: "wq.jd.com",
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
            if (data['retcode'] === 1001) {
              $.isLogin = false; //cookie过期
              return;
            }
            if (data['retcode'] === 0 && data.data && data.data.hasOwnProperty("userInfo")) {
              $.nickName = data.data.userInfo.baseInfo.nickname;
            }
          } else {
            console.log('京东服务器返回空数据');
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
