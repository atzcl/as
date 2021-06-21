/*
东东超市兑换奖品 脚本地址：https://gitee.com/lxk0301/jd_scripts/raw/master/jd_blueCoin.js
感谢@yangtingxiao提供PR
更新时间：2021-3-2
活动入口：京东APP我的-更多工具-东东超市
支持京东多个账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============QuantumultX==============
[task_local]
#东东超市兑换奖品
0 0 0 * * * https://gitee.com/lxk0301/jd_scripts/raw/master/jd_blueCoin.js, tag=东东超市兑换奖品, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jxc.png, enabled=true
====================Loon=================
[Script]
cron "0 0 0 * * *" script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_blueCoin.js,tag=东东超市兑换奖品
===================Surge==================
东东超市兑换奖品 = type=cron,cronexp="0 0 0 * * *",wake-system=1,timeout=3600,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_blueCoin.js
============小火箭=========
东东超市兑换奖品 = type=cron,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_blueCoin.js, cronexpr="0 0 0 * * *", timeout=3600, enable=true
 */
const $ = new Env('东东超市兑换奖品');
const notify = $.isNode() ? require('./sendNotify') : '';
let allMessage = '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let coinToBeans = $.getdata('coinToBeans') || 20; //兑换多少数量的京豆（20或者1000），0表示不兑换，默认不兑换京豆，如需兑换把0改成20或者1000，或者'商品名称'(商品名称放到单引号内)即可
let jdNotify = false;//是否开启静默运行，默认false关闭(即:奖品兑换成功后会发出通知提示)
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

const JD_API_HOST = `https://api.m.jd.com/api?appid=jdsupermarket`;
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i =0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    if (cookie) {
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.data = {};
      $.coincount = 0;
      $.beanscount = 0;
      $.blueCost = 0;
      $.errBizCodeCount = 0;
      $.coinerr = "";
      $.beanerr = "";
      $.title = '';
      //console.log($.coincount);
      $.isLogin = true;
      $.nickName = '';
      // await TotalBean();
      console.log(`\n****开始【京东账号${$.index}】${$.nickName || $.UserName}****\n`);
      // console.log(`目前暂无兑换酒类的奖品功能，即使输入酒类名称，脚本也会提示下架\n`)
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName || $.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      //先兑换京豆
      if ($.isNode()) {
        if (process.env.MARKET_COIN_TO_BEANS) {
          coinToBeans = process.env.MARKET_COIN_TO_BEANS;
        }
      }
      try {
        if (`${coinToBeans}` !== '0') {
          await smtgHome();//查询蓝币数量，是否满足兑换的条件
          await PrizeIndex();
        } else {
          console.log('查询到您设置的是不兑换京豆选项，现在为您跳过兑换京豆。如需兑换，请去BoxJs设置或者修改脚本coinToBeans或设置环境变量MARKET_COIN_TO_BEANS\n')
        }
        await msgShow();
      } catch (e) {
        $.logErr(e)
      }
    }
  }
  if ($.isNode() && allMessage && $.ctrTemp) {
    await notify.sendNotify(`${$.name}`, `${allMessage}`)
  }
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())
async function PrizeIndex() {
  // await smtg_queryPrize();
  // await smtg_materialPrizeIndex();//兑换酒类奖品，此兑换API与之前的兑换京豆类的不一致，故目前无法进行
  await Promise.all([
    smtg_queryPrize(),
    smtg_materialPrizeIndex()
  ])
  const prizeList = [...$.queryPrizeData, ...$.materialPrizeIndex];
  // const prizeList = [...$.queryPrizeData];
  if (prizeList && prizeList.length) {
    if (`${coinToBeans}` === '1000') {
      if (prizeList[1] && prizeList[1].beanType === 'BeanPackage') {
        console.log(`查询换${prizeList[1].title}ID成功，ID:${prizeList[1].prizeId}`)
        $.title = prizeList[1].title;
        $.blueCost = prizeList[1].blueCost;
      } else {
        console.log(`查询换1000京豆ID失败`)
        $.beanerr = `东哥今天不给换`;
        return ;
      }
      if (prizeList[1] && prizeList[1].inStock === 506) {
        $.beanerr = `失败，1000京豆领光了，请明天再来`;
        return ;
      }
      if (prizeList[1] && prizeList[1].targetNum === prizeList[1] && prizeList[1].finishNum) {
        $.beanerr = `${prizeList[1].subTitle}`;
        return ;
      }
      //兑换1000京豆
      if ($.totalBlue > $.blueCost) {
        await smtg_obtainPrize(prizeList[1].prizeId);
      } else {
        console.log(`兑换失败,您目前蓝币${$.totalBlue}个,不足以兑换${$.title}所需的${$.blueCost}个`);
        $.beanerr = `兑换失败,您目前蓝币${$.totalBlue}个,不足以兑换${$.title}所需的${$.blueCost}个`;
      }
    } else if (`${coinToBeans}` === '20') {
      if (prizeList[0] && prizeList[0].beanType === 'Bean') {
        console.log(`查询换${prizeList[0].title}ID成功，ID:${prizeList[0].prizeId}`)
        $.title = prizeList[0].title;
        $.blueCost = prizeList[0].blueCost;
      } else {
        console.log(`查询换万能的京豆ID失败`)
        $.beanerr = `东哥今天不给换`;
        return ;
      }
      if (prizeList[0] && prizeList[0].inStock === 506) {
        console.log(`失败，万能的京豆领光了，请明天再来`);
        $.beanerr = `失败，万能的京豆领光了，请明天再来`;
        return ;
      }
      if ((prizeList[0] && prizeList[0].targetNum) === (prizeList[0] && prizeList[0].finishNum)) {
        $.beanerr = `${prizeList[0].subTitle}`;
        return ;
      }
      //兑换万能的京豆(1-20京豆)
      if ($.totalBlue > $.blueCost) {
        await smtg_obtainPrize(prizeList[0].prizeId,1000);
      } else {
        console.log(`兑换失败,您目前蓝币${$.totalBlue}个,不足以兑换${$.title}所需的${$.blueCost}个`);
        $.beanerr = `兑换失败,您目前蓝币${$.totalBlue}个,不足以兑换${$.title}所需的${$.blueCost}个`;
      }
    } else {
      //自定义输入兑换
      console.log(`\n\n温馨提示：需兑换商品的名称设置请尽量与其他商品有区分度，否则可能会兑换成其他类似商品\n\n`)
      let prizeId = '', i;
      for (let index = 0; index < prizeList.length; index ++) {
        if (prizeList[index].title.indexOf(coinToBeans) > -1) {
          prizeId = prizeList[index].prizeId;
          i = index;
          $.title = prizeList[index].title;
          $.blueCost = prizeList[index].blueCost;
          $.type = prizeList[index].type;
          $.beanType = prizeList[index].hasOwnProperty('beanType');
        }
      }
      if (prizeId) {
        if (prizeList[i].inStock === 506 || prizeList[i].inStock === -1) {
          console.log(`失败，您输入设置的${coinToBeans}领光了，请明天再来`);
          $.beanerr = `失败，您输入设置的${coinToBeans}领光了，请明天再来`;
          return ;
        }
        if ((prizeList[i].targetNum) && prizeList[i].targetNum === prizeList[i].finishNum) {
          $.beanerr = `${prizeList[0].subTitle}`;
          return ;
        }
        if ($.totalBlue > $.blueCost) {
          if ($.type === 4 && !$.beanType) {
            await smtg_obtainPrize(prizeId, 0, "smtg_lockMaterialPrize")
          } else {
            await smtg_obtainPrize(prizeId);
          }
        } else {
          console.log(`兑换失败,您目前蓝币${$.totalBlue}个,不足以兑换${$.title}所需的${$.blueCost}个`);
          $.beanerr = `兑换失败,您目前蓝币${$.totalBlue}个,不足以兑换${$.title}所需的${$.blueCost}个`;
        }
      } else {
        console.log(`奖品兑换列表[${coinToBeans}]已下架，请检查活动页面是否存在此商品，如存在请检查您的输入是否正确`);
        $.beanerr = `奖品兑换列表[${coinToBeans}]已下架`;
      }
    }
  }
}
//查询白酒类奖品列表API
function smtg_materialPrizeIndex(timeout = 0) {
  $.materialPrizeIndex = [];
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}&functionId=smtg_materialPrizeIndex&clientVersion=8.0.0&client=m&body=%7B%22channel%22:%221%22%7D&t=${Date.now()}`,
        headers : {
          'Origin' : `https://jdsupermarket.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Referer' : `https://jdsupermarket.jd.com/game/?tt=1597540727225`,
          'Host' : `api.m.jd.com`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        }
      }
      $.post(url, async (err, resp, data) => {
        try {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.bizCode !== 0) {
              $.beanerr = `${data.data.bizMsg}`;
              return
            }
            $.materialPrizeIndex = data.data.result.prizes || [];
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
//查询任务
function smtg_queryPrize(timeout = 0){
  $.queryPrizeData = [];
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}&functionId=smtg_queryPrize&clientVersion=8.0.0&client=m&body=%7B%7D&t=${Date.now()}`,
        headers : {
          'Origin' : `https://jdsupermarket.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Referer' : `https://jdsupermarket.jd.com/game/?tt=1597540727225`,
          'Host' : `api.m.jd.com`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        }
      }
      $.post(url, async (err, resp, data) => {
        try {
          if (safeGet(data)) {
            data = JSON.parse(data);
            // $.queryPrizeData = data;
            if (data.data.bizCode !== 0) {
              console.log(`${data.data.bizMsg}\n`)
              $.beanerr = `${data.data.bizMsg}`;
              return
            }
            if (data.data.bizCode === 0) {
              const { prizeList } = data.data.result;
              $.queryPrizeData = data.data.result.prizeList || [];
            }
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
//换京豆
function smtg_obtainPrize(prizeId, timeout = 0, functionId = 'smtg_obtainPrize') {
  //1000京豆，prizeId为4401379726
  const body = {
    prizeId,
    "channel": "1"
  }
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}&functionId=${functionId}&clientVersion=8.0.0&client=m&body=${encodeURIComponent(JSON.stringify(body))}&t=${Date.now()}`,
        headers : {
          'Origin' : `https://jdsupermarket.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Referer' : `https://jdsupermarket.jd.com/game/?tt=1597540727225`,
          'Host' : `api.m.jd.com`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        }
      }
      $.post(url, async (err, resp, data) => {
        try {
          console.log(`兑换结果:${data}`);
          if (safeGet(data)) {
            data = JSON.parse(data);
            $.data = data;
            if ($.data.data.bizCode !== 0 && $.data.data.bizCode !== 106) {
              $.beanerr = `${$.data.data.bizMsg}`;
              //console.log(`【京东账号${$.index}】${$.nickName} 换取京豆失败：${$.data.data.bizMsg}`)
              return
            }
            if ($.data.data.bizCode === 106) {
              $.errBizCodeCount ++;
              console.log(`debug 兑换京豆活动火爆次数:${$.errBizCodeCount}`);
              if ($.errBizCodeCount >= 20) return
            }
            if ($.data.data.bizCode === 0) {
              if (`${coinToBeans}` === '1000') {
                $.beanscount ++;
                console.log(`【京东账号${$.index}】${$.nickName || $.UserName} 第${$.data.data.result.exchangeNum}次换${$.title}成功`)
                if ($.beanscount === 1) return;
              } else if (`${coinToBeans}` === '20') {
                $.beanscount ++;
                console.log(`【京东账号${$.index}】${$.nickName || $.UserName} 第${$.data.data.result.exchangeNum}次换${$.title}成功`)
                if ($.data.data.result.exchangeNum === 20 || $.beanscount === coinToBeans || $.data.data.result.blue < 500) return;
              } else {
                $.beanscount ++;
                console.log(`【京东账号${$.index}】${$.nickName || $.UserName} 第${$.data.data.result.exchangeNum}次换${$.title}成功`)
                if ($.beanscount === 1) return;
              }
            }
          }
          await  smtg_obtainPrize(prizeId,3000);
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}
function smtgHome() {
  return new Promise((resolve) => {
    $.get(taskUrl('smtg_home'), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东超市兑换奖品: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.bizCode === 0) {
              const { result } = data.data;
              $.totalGold = result.totalGold;
              $.totalBlue = result.totalBlue;
              // console.log(`【总金币】${$.totalGold}个\n`);
              console.log(`【总蓝币】${$.totalBlue}个\n`);
            }
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

//通知
function msgShow() {
  // $.msg($.name, ``, `【京东账号${$.index}】${$.nickName}\n【收取蓝币】${$.coincount ? `${$.coincount}个` : $.coinerr }${coinToBeans ? `\n【兑换京豆】${ $.beanscount ? `${$.beanscount}个` : $.beanerr}` : ""}`);
  return new Promise(async resolve => {
    $.log(`\n【京东账号${$.index}】${$.nickName || $.UserName}\n${coinToBeans ? `【兑换${$.title}】${$.beanscount ? `成功` : $.beanerr}` : "您设置的是不兑换奖品"}\n`);
    if ($.isNode() && process.env.MARKET_REWARD_NOTIFY) {
      $.ctrTemp = `${process.env.MARKET_REWARD_NOTIFY}` === 'false';
    } else if ($.getdata('jdSuperMarketRewardNotify')) {
      $.ctrTemp = $.getdata('jdSuperMarketRewardNotify') === 'false';
    } else {
      $.ctrTemp = `${jdNotify}` === 'false';
    }
    //默认只在兑换奖品成功后弹窗提醒。情况情况加，只打印日志，不弹窗
    if ($.beanscount && $.ctrTemp) {
      $.msg($.name, ``, `【京东账号${$.index}】${$.nickName || $.UserName}\n${coinToBeans ? `【兑换${$.title}】${ $.beanscount ? `成功，数量：${$.beanscount}个` : $.beanerr}` : "您设置的是不兑换奖品"}`);
      allMessage += `【京东账号${$.index}】${$.nickName || $.UserName}\n${coinToBeans ? `【兑换${$.title}】${$.beanscount ? `成功，数量：${$.beanscount}个` : $.beanerr}` : "您设置的是不兑换奖品"}${$.index !== cookiesArr.length ? '\n\n' : ''}`
      // if ($.isNode()) {
      //   await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}`, `【京东账号${$.index}】${$.nickName}\n${coinToBeans ? `【兑换${$.title}】${$.beanscount ? `成功，数量：${$.beanscount}个` : $.beanerr}` : "您设置的是不兑换奖品"}`)
      // }
    }
    resolve()
  })
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
function taskUrl(function_id, body = {}) {
  return {
    url: `${JD_API_HOST}&functionId=${function_id}&clientVersion=8.0.0&client=m&body=${escape(JSON.stringify(body))}&t=${Date.now()}`,
    headers: {
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Host': 'api.m.jd.com',
      'Cookie': cookie,
      'Referer': 'https://jdsupermarket.jd.com/game',
      'Origin': 'https://jdsupermarket.jd.com',
    }
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
