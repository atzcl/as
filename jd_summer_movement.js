/*
https://wbbny.m.jd.com/babelDiy/Zeus/2rtpffK8wqNyPBH6wyUDuBKoAbCt/index.html
cron 12 9,11,13,15,17 * * * https://raw.githubusercontent.com/smiek2221/scripts/master/jd_summer_movement.js
需要解密
https://raw.githubusercontent.com/smiek2221/scripts/master/MovementFaker.js
解密脚本 跟 任务脚本同一目录 可以手动下载
*/
const $ = new Env('燃动夏季');
const MovementFaker = require('./MovementFaker.js')
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const ShHelpFlag = true;//是否SH助力  true 助力，false 不助力
const ShHelpAuthorFlag = true;//是否助力作者SH  true 助力，false 不助力
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [];
$.cookie = '';
$.inviteList = [];
$.secretpInfo = {};
$.ShInviteList = [];
$.innerShInviteList = [
  'HcmphLbwLg2gd9KdEYU6h2f83lCeIEUTjDv0bsVpEz78YR7g-oruAMuk8Ts6YW6GHkNoMRFF0blVx4di_eC-XA',
  'HcmphLbwLg_wK9GeFYJhhUW1R2vHRalms93Eu2DJlP4P370DM26RTfRukKfIamB7DMSaAt-FqzrvvWLv3DDAKw',
  'HcmphDkw2NMI5lshggK2dbnH43LupddrISxV_EW3Fb3B3NzfaXeEUVk5yyA28XYYg3exu4df'
];
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

$.appid = 'o2_act';
const UA = $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "JD4iPhone/9.3.5 CFNetwork/1209 Darwin/20.2.0") : ($.getdata('JDUA') ? $.getdata('JDUA') : "JD4iPhone/9.3.5 CFNetwork/1209 Darwin/20.2.0")


!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      $.cookie = cookiesArr[i];
      $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = $.UserName;
      $.hotFlag = false; //是否火爆
      console.log(`\n*****开始【京东账号${$.index}】${$.nickName || $.UserName}*****\n`);
      console.log(`\n如有未完成的任务，请多执行几次\n`);
      await movement()
      if($.hotFlag)$.secretpInfo[$.UserName] = false;//火爆账号不执行助力
    }
  }
  // 助力
  let res = [];
  if (new Date().getUTCHours() + 8 >= 17) res = await getAuthorShareCode() || [];
  if (ShHelpAuthorFlag) {
    $.innerShInviteList = getRandomArrayElements([...$.innerShInviteList, ...res], [...$.innerShInviteList, ...res].length);
    $.ShInviteList.push(...$.innerShInviteList);
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    $.cookie = cookiesArr[i];
    $.canHelp = true;
    $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
    if (!$.secretpInfo[$.UserName]) {
      continue;
    }
    // $.secretp = $.secretpInfo[$.UserName];
    $.index = i + 1;
    if (new Date().getUTCHours() + 8 >= 9) {
      console.log(`\n******开始内部京东账号【百元守卫站SH】助力*********\n`);
      for (let i = 0; i < $.ShInviteList.length && ShHelpFlag && $.canHelp; i++) {
        console.log(`${$.UserName} 去助力SH码 ${$.ShInviteList[i]}`);
        $.inviteId = $.ShInviteList[i];
        await takePostRequest('shHelp');
        await $.wait(1000);
      }
      $.canHelp = true;
    }
    if ($.inviteList && $.inviteList.length) console.log(`\n******开始内部京东账号【邀请好友助力】*********\n`);
    for (let j = 0; j < $.inviteList.length && $.canHelp; j++) {
      $.oneInviteInfo = $.inviteList[j];
      if ($.oneInviteInfo.ues === $.UserName || $.oneInviteInfo.max) {
        continue;
      }
      //console.log($.oneInviteInfo);
      $.inviteId = $.oneInviteInfo.inviteId;
      console.log(`${$.UserName}去助力${$.oneInviteInfo.ues},助力码${$.inviteId}`);
      //await takePostRequest('helpHomeData');
      await takePostRequest('help');
      await $.wait(2000);
    }
  }


})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })


async function movement() {
  try {
    $.signSingle = {};
    $.homeData = {};
    $.secretp = ``;
    $.taskList = [];
    $.shopSign = ``;
    await takePostRequest('olympicgames_home');
    $.userInfo =$.homeData.result.userActBaseInfo
    console.log(`\n待兑换金额：${Number($.userInfo.poolMoney)} 当前等级:${$.userInfo.medalLevel}  ${$.userInfo.poolCurrency}/${$.userInfo.exchangeThreshold}(攒卡领${Number($.userInfo.cash)}元)\n`);
    await $.wait(1000);
    if($.userInfo && typeof $.userInfo.sex == 'undefined'){
      await takePostRequest('olympicgames_tiroGuide');
      await $.wait(1000);
    }
    $.userInfo = $.homeData.result.userActBaseInfo;
    if (Number($.userInfo.poolCurrency) >= Number($.userInfo.exchangeThreshold)) {
      console.log(`满足升级条件，去升级`);
      await takePostRequest('olympicgames_receiveCash');
      await $.wait(1000);
    }
    bubbleInfos = $.homeData.result.bubbleInfos;
    for(let item of bubbleInfos){
      if(item.type != 7){
        $.collectId = item.type
        await takePostRequest('olympicgames_collectCurrency');
        await $.wait(1000);
      }
    }
    console.log('\n运动')
    $.speedTraining = true;
    await takePostRequest('olympicgames_startTraining');
    await $.wait(1000);
    for(let i=0;i<=3;i++){
      if($.speedTraining){
        await takePostRequest('olympicgames_speedTraining');
        await $.wait(1000);
      }else{
        break;
      }
    }

    await takePostRequest('olympicgames_getTaskDetail');
    await $.wait(1000);
    //做任务
    for (let i = 0; i < $.taskList.length && !$.hotFlag; i++) {
      $.oneTask = $.taskList[i];
      if ([1, 3, 5, 7, 9, 26].includes($.oneTask.taskType) && $.oneTask.status === 1) {
        $.activityInfoList = $.oneTask.shoppingActivityVos || $.oneTask.brandMemberVos || $.oneTask.followShopVo || $.oneTask.browseShopVo;
        for (let j = 0; j < $.activityInfoList.length; j++) {
          $.oneActivityInfo = $.activityInfoList[j];
          if ($.oneActivityInfo.status !== 1 || !$.oneActivityInfo.taskToken) {
            continue;
          }
          $.callbackInfo = {};
          console.log(`做任务：${$.oneActivityInfo.title || $.oneActivityInfo.taskName || $.oneActivityInfo.shopName};等待完成`);
          await takePostRequest('olympicgames_doTaskDetail');
          if ($.callbackInfo.code === 0 && $.callbackInfo.data && $.callbackInfo.data.result && $.callbackInfo.data.result.taskToken) {
            await $.wait(getRndInteger(7000, 8000));
            let sendInfo = encodeURIComponent(`{"dataSource":"newshortAward","method":"getTaskAward","reqParams":"{\\"taskToken\\":\\"${$.callbackInfo.data.result.taskToken}\\"}","sdkVersion":"1.0.0","clientLanguage":"zh"}`)
            await callbackResult(sendInfo)
          } else if ($.oneTask.taskType === 5 || $.oneTask.taskType === 3 || $.oneTask.taskType === 26) {
            await $.wait(2000);
            console.log(`任务完成`);
          } else {
            console.log($.callbackInfo);
            console.log(`任务失败`);
            await $.wait(3000);

          }

        }
        break
      } else if ($.oneTask.taskType === 2 && $.oneTask.status === 1 && $.oneTask.scoreRuleVos[0].scoreRuleType === 2){
        console.log(`做任务：${$.oneTask.taskName};等待完成 (实际不会添加到购物车)`);
        $.taskId = $.oneTask.taskId;
        $.feedDetailInfo = {};
        await takePostRequest('olympicgames_getFeedDetail');
        let productList = $.feedDetailInfo.productInfoVos;
        let needTime = Number($.feedDetailInfo.maxTimes) - Number($.feedDetailInfo.times);
        for (let j = 0; j < productList.length && needTime > 0; j++) {
          if(productList[j].status !== 1){
            continue;
          }
          $.taskToken = productList[j].taskToken;
          console.log(`加购：${productList[j].skuName}`);
          await takePostRequest('add_car');
          await $.wait(1500);
          needTime --;
        }
      }else if ($.oneTask.taskType === 2 && $.oneTask.status === 1 && $.oneTask.scoreRuleVos[0].scoreRuleType === 0){
        $.activityInfoList = $.oneTask.productInfoVos ;
        for (let j = 0; j < $.activityInfoList.length; j++) {
          $.oneActivityInfo = $.activityInfoList[j];
          if ($.oneActivityInfo.status !== 1 || !$.oneActivityInfo.taskToken) {
            continue;
          }
          $.callbackInfo = {};
          console.log(`做任务：浏览${$.oneActivityInfo.skuName};等待完成`);
          await takePostRequest('olympicgames_doTaskDetail');
          if ($.oneTask.taskType === 2) {
            await $.wait(2000);
            console.log(`任务完成`);
          } else {
            console.log($.callbackInfo);
            console.log(`任务失败`);
            await $.wait(3000);
          }
        }
      }
    }

    $.Shend = false
    await $.wait(1000);
    console.log('\n百元守卫站')
    await takePostRequest('olypicgames_guradHome');
    await $.wait(1000);
    if($.Shend){
      await takePostRequest('olympicgames_receiveCash');
      await $.wait(1000);
    }

  } catch (e) {
    $.logErr(e)
  }

}

async function takePostRequest(type) {
  let body = ``;
  let myRequest = ``;
  switch (type) {
    case 'olympicgames_home':
      body = `functionId=olympicgames_home&body={}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
      myRequest = await getPostRequest(`olympicgames_home`, body);
      break;
    case 'olympicgames_collectCurrency':
      body = await getPostBody(type);
      myRequest = await getPostRequest(`olympicgames_collectCurrency`, body);
      break
    case 'olympicgames_receiveCash':
      let id = 6
      if($.Shend) id = 4
      body = `functionId=olympicgames_receiveCash&body={"type":${id}}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
      myRequest = await getPostRequest(`olympicgames_receiveCash`, body);
      break
    case 'olypicgames_guradHome':
      body = `functionId=olypicgames_guradHome&body={}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
      myRequest = await getPostRequest(`olypicgames_guradHome`, body);
      break
    case 'olympicgames_getTaskDetail':
      body = `functionId=${type}&body={"taskId":"","appSign":"1"}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
      myRequest = await getPostRequest(`olympicgames_getTaskDetail`, body);
      break;
    case 'olympicgames_doTaskDetail':
      body = await getPostBody(type);
      myRequest = await getPostRequest(`olympicgames_doTaskDetail`, body);
      break;
    case 'olympicgames_getFeedDetail':
      body = `functionId=olympicgames_getFeedDetail&body={"taskId":"${$.taskId}"}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
      myRequest = await getPostRequest(`olympicgames_getFeedDetail`, body);
      break;
    case 'add_car':
      body = await getPostBody(type);
      myRequest = await getPostRequest(`olympicgames_doTaskDetail`,body);
      break;
    case 'shHelp':
    case 'help':
      body = await getPostBody(type);
      myRequest = await getPostRequest(`zoo_collectScore`, body);
      break;
    case 'olympicgames_startTraining':
      body = await getPostBody(type);
      myRequest = await getPostRequest(`olympicgames_startTraining`, body);
      break;
    case 'olympicgames_speedTraining':
      body = await getPostBody(type);
      myRequest = await getPostRequest(`olympicgames_speedTraining`, body);
      break;
    case 'olympicgames_tiroGuide':
      let sex = getRndInteger(0,2)
      let sportsGoal = getRndInteger(1,4)
      body = `functionId=olympicgames_tiroGuide&body={"sex":${sex},"sportsGoal":${sportsGoal}}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
      myRequest = await getPostRequest(`olympicgames_tiroGuide`, body);
      break;
    default:
      console.log(`错误${type}`);
  }
  if(myRequest){
    return new Promise(async resolve => {
      $.post(myRequest, (err, resp, data) => {
        try {
          // console.log(data);
          dealReturn(type, data);
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve();
        }
      })
    })
  }
}


async function dealReturn(type, res) {
  try {
    data = JSON.parse(res);
  } catch (e) {
    console.log(`返回异常：${res}`);
    return;
  }
  switch (type) {
    case 'olympicgames_home':
      if (data.code === 0) {
        if (data.data['bizCode'] === 0) {
          $.homeData = data.data;
          $.secretpInfo[$.UserName] = true
        }
      }
      break;
    case 'olympicgames_collectCurrency':
      if (data.code === 0 && data.data && data.data.result) {
        console.log(`收取成功，获得：${data.data.result.poolCurrency}`);
      } else if (data.data && data.data.bizMsg) {
        console.log(data.data.bizMsg);
      } else {
        console.log(res);
      }
      if (data.code === 0 && data.data && data.data.bizCode === -1002) {
        $.hotFlag = true;
        console.log(`该账户脚本执行任务火爆，暂停执行任务，请手动做任务或者等待解决脚本火爆问题`)
      }
      break;
    case 'olympicgames_receiveCash':
      if (data.code === 0 && data.data && data.data.result) {
        if (data.data.result.couponVO) {
          console.log('升级成功')
          let res = data.data.result.couponVO
          console.log(`获得[${res.couponName}]优惠券：${res.usageThreshold} 优惠：${res.quota} 时间：${res.useTimeRange}`);
        }else if(data.data.result.userActBaseVO){
          console.log('结算结果')
          let res = data.data.result.userActBaseVO
          console.log(`当前金额：${res.totalMoney}\n${JSON.stringify(res)}`);
        }
      } else if (data.data && data.data.bizMsg) {
        console.log(data.data.bizMsg);
      } else {
        console.log(res);
      }
      break;
    case 'olympicgames_getTaskDetail':
      if (data.data && data.data.bizCode === 0) {
        console.log(`互助码：${data.data.result && data.data.result.inviteId || '助力已满，获取助力码失败'}`);
        if (data.data.result && data.data.result.inviteId) {
          $.inviteList.push({
            'ues': $.UserName,
            // 'secretp': $.secretp,
            'inviteId': data.data.result.inviteId,
            'max': false
          });
        }
        $.taskList = data.data.result && data.data.result.taskVos || [];
      } else if (data.data && data.data.bizMsg) {
        console.log(data.data.bizMsg);
      } else {
        console.log(res);
      }
      break;
    case 'olypicgames_guradHome':
      if (data.data && data.data.bizCode === 0) {
        console.log(`SH互助码：${data.data.result && data.data.result.inviteId || '助力已满，获取助力码失败'}`);
        if (data.data.result && data.data.result.inviteId) {
          if (data.data.result.inviteId) $.ShInviteList.push(data.data.result.inviteId);
          console.log(`守护金额：${Number(data.data.result.activityLeftAmount || 0)} 护盾剩余：${timeFn(Number(data.data.result.guardLeftSeconds || 0) * 1000)} 离结束剩：${timeFn(Number(data.data.result.activityLeftSeconds || 0) * 1000)}`)
          if(data.data.result.activityLeftSeconds == 0) $.Shend = true
        }
        $.taskList = data.data.result && data.data.result.taskVos || [];
      } else if (data.data && data.data.bizMsg) {
        console.log(data.data.bizMsg);
      } else {
        console.log(res);
      }
      break;
    case 'olympicgames_doTaskDetail':
      $.callbackInfo = data;
      break;
    case 'olympicgames_getFeedDetail':
      if (data.code === 0) {
        $.feedDetailInfo = data.data.result.addProductVos[0] || [];
      }
      break;
    case 'add_car':
      if (data.code === 0) {
        let acquiredScore = data.data.result.acquiredScore;
        if (Number(acquiredScore) > 0) {
          console.log(`加购成功,获得金币:${acquiredScore}`);
        } else {
          console.log(`加购成功`);
        }
      } else {
        console.log(res);
        console.log(`加购失败`);
      }
      break
    case 'shHelp':
    case 'help':
      if (data.data && data.data.bizCode === 0) {
        let cash = ''
        if (data.data.result.hongBaoVO && data.data.result.hongBaoVO.withdrawCash) cash = `，并获得${Number(data.data.result.hongBaoVO.withdrawCash)}红包`
        console.log(`助力成功${cash}`);
      } else if (data.data && data.data.bizMsg) {
        if (data.data.bizMsg.indexOf('今天用完所有') > -1) {
          $.canHelp = false;
        }
        console.log(data.data.bizMsg);
      } else {
        console.log(res);
      }
      break;
    case 'olympicgames_speedTraining':
      if (data.data && data.data.bizCode === 0 && data.data.result) {
        let res = data.data.result
        console.log(`获得[${res.couponName}]优惠券：${res.usageThreshold} 优惠：${res.quota} 时间：${res.useTimeRange}`);
      } else if (data.data && data.data.bizMsg) {
        if (data.data.bizMsg.indexOf('不在运动中') > -1) {
          $.speedTraining = false;
        }
        console.log(data.data.bizMsg);
      } else {
        console.log(res);
      }
      break;
    case 'olympicgames_startTraining':
      if (data.data && data.data.bizCode === 0 && data.data.result) {
        let res = data.data.result
        console.log(`倒计时${res.countdown}s ${res.currencyPerSec}卡币/s`);
      } else if (data.data && data.data.bizMsg) {
        if (data.data.bizMsg.indexOf('运动量已经够啦') > -1) {
          $.speedTraining = false;
        }
        console.log(data.data.bizMsg);
      } else {
        console.log(res);
      }
      break;
    case 'olympicgames_tiroGuide':
      console.log(res);
      break;
    default:
      console.log(`未判断的异常${type}`);

  }

}

async function getPostBody(type) {
  return new Promise(async resolve => {
    let taskBody = '';
    try {
      const log = await MovementFaker.getBody($)
      if (type === 'help' || type === 'shHelp') {
        taskBody = `functionId=olympicgames_assist&body=${JSON.stringify({"inviteId":$.inviteId,"type": "confirm","ss" :log})}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`
      } else if (type === 'olympicgames_collectCurrency') {
        taskBody = `functionId=olympicgames_collectCurrency&body=${JSON.stringify({"type":$.collectId,"ss" : log})}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
      } else if (type === 'olympicgames_startTraining' || type === 'olympicgames_speedTraining') {
        taskBody = `functionId=${type}&body=${JSON.stringify({"ss" : log})}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
      } else if(type === 'add_car'){
        taskBody = `functionId=olympicgames_doTaskDetail&body=${JSON.stringify({"taskId": $.taskId,"taskToken":$.taskToken,"ss" : log})}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`
      }else{
        taskBody = `functionId=${type}&body=${JSON.stringify({"taskId": $.oneTask.taskId,"actionType":1,"taskToken" : $.oneActivityInfo.taskToken,"ss" : log})}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`
      }
    } catch (e) {
      $.logErr(e)
    } finally {
      resolve(taskBody);
    }
  })
}

async function getPostRequest(type, body) {
  let url = `https://api.m.jd.com/client.action?advId=${type}`;
  const method = `POST`;
  const headers = {
    "Accept": "application/json",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded",
    'Cookie': $.cookie,
    "Origin": "https://wbbny.m.jd.com",
    "Referer": "https://wbbny.m.jd.com/",
    "User-Agent": "jdapp;iPhone;9.2.0;14.1;",

  };
  return {url: url, method: method, headers: headers, body: body};
}


//领取奖励
function callbackResult(info) {
  return new Promise((resolve) => {
    let url = {
      url: `https://api.m.jd.com/?functionId=qryViewkitCallbackResult&client=wh5&clientVersion=1.0.0&body=${info}&_timestamp=` + Date.now(),
      headers: {
        'Origin': `https://bunearth.m.jd.com`,
        'Cookie': $.cookie,
        'Connection': `keep-alive`,
        'Accept': `*/*`,
        'Host': `api.m.jd.com`,
        'User-Agent': "jdapp;iPhone;10.0.2;14.3;8a0d1837f803a12eb217fcf5e1f8769cbb3f898d;network/wifi;model/iPhone12,1;addressid/4199175193;appBuild/167694;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
        'Accept-Encoding': `gzip, deflate, br`,
        'Accept-Language': `zh-cn`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://bunearth.m.jd.com'
      }
    }

    $.get(url, async (err, resp, data) => {
      try {
        data = JSON.parse(data);
        console.log(data.toast.subTitle)
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    })
  })
}

/**
 * 随机从一数组里面取
 * @param arr
 * @param count
 * @returns {Buffer}
 */
 function getRandomArrayElements(arr, count) {
  var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

// 随机数
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

// 计算时间
function timeFn(dateBegin) {
  //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
  var dateEnd = new Date(0);//获取当前时间
  var dateDiff = dateBegin - dateEnd.getTime();//时间差的毫秒数
  var leave1 = dateDiff % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000))//计算出小时数
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000)    //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000))//计算相差分钟数
  //计算相差秒数
  var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000)

  var timeFn = hours + ":" + minutes + ":" + seconds;
  return timeFn;
}
