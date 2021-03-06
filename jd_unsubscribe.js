/*
脚本：取关京东店铺和商品(批量版) from @X1a0He大佬
因种豆得豆和宠汪汪以及NobyDa大佬的京东签到脚本会关注店铺和商品，故此脚本用来取消已关注的店铺和商品
默认：每运行一次脚本全部已关注的店铺与商品
建议此脚本运行时间在 种豆得豆和宠汪汪脚本运行之后 再执行
现有功能: 1、取关商品。2、取关店铺。3、匹配到boxjs输入的过滤关键词后，不再进行此商品/店铺后面(包含输入的关键词商品/店铺)的取关
脚本兼容: Quantumult X, Surge, Loon, JSBox, Node.js, 小火箭
==============Quantumult X===========
[task_local]
#取关京东店铺商品
55 23 * * * jd_unsubscribe.js, tag=取关京东店铺商品, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true
===========Loon============
[Script]
cron "55 23 * * *" script-path=jd_unsubscribe.js,tag=取关京东店铺商品
============Surge=============
取关京东店铺商品 = type=cron,cronexp="55 23 * * *",wake-system=1,timeout=3600,script-path=jd_unsubscribe.js
===========小火箭========
取关京东店铺商品 = type=cron,script-path=jd_unsubscribe.js, cronexpr="55 23 * * *", timeout=3600, enable=true
 */
const $ = new Env('取关京东店铺和商品');
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';

//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [],
  cookie = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
const jdNotify = $.getdata('jdUnsubscribeNotify'); //是否关闭通知，false打开通知推送，true关闭通知推送
let goodPageSize = $.getdata('jdUnsubscribePageSize') || 20; // 运行一次取消多全部已关注的商品。数字0表示不取关任何商品
let shopPageSize = $.getdata('jdUnsubscribeShopPageSize') || 20; // 运行一次取消全部已关注的店铺。数字0表示不取关任何店铺
let stopGoods = $.getdata('jdUnsubscribeStopGoods') || ''; //遇到此商品不再进行取关，此处内容需去商品详情页（自营处）长按拷贝商品信息
let stopShop = $.getdata('jdUnsubscribeStopShop') || ''; //遇到此店铺不再进行取关，此处内容请尽量从头开始输入店铺名称
let unsubscribeGoodsNum = 0,
  unsubscribeShopsNum = 0;
const JD_API_HOST = 'https://wq.jd.com/fav';
!(async () => {
  if (!cookiesArr[0]) {
    $.msg('【京东账号一】取关京东店铺商品失败', '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {
      "open-url": "https://bean.m.jd.com/bean/signIndex.action"
    });
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      await TotalBean();
      console.log(`\n****开始【京东账号${$.index}】${$.nickName || $.UserName}*****\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
          "open-url": "https://bean.m.jd.com/bean/signIndex.action"
        });

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await requireConfig();
      await jdUnsubscribe_xh();
      await showMsg_xh();
    }
  }
})()
.catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function jdUnsubscribe_xh() {
  await Promise.all([
    goodsMain_xh(),
    shopMain_xh()
  ])
  //再次获取还有多少已关注的店铺与商品
  if ($.unsubscribeGoodsCount != 0 || $.unsubscribeShopsCount != 0) {
    await Promise.all([
      getFollowGoods_xh(),
      getFollowShops_xh()
    ])
  }
}

function showMsg_xh() {
  if (!jdNotify || jdNotify === 'false') {
    $.msg($.name, ``, `【京东账号${$.index}】${$.nickName}\n【已取消关注店铺】${unsubscribeShopsNum}个\n【已取消关注商品】${unsubscribeGoodsNum}个\n【还剩关注店铺】${$.shopsTotalNum}个\n【还剩关注商品】${$.goodsTotalNum}个\n`);
  } else {
    $.log(`\n【京东账号${$.index}】${$.nickName}\n【已取消关注店铺】${unsubscribeShopsNum}个\n【已取消关注商品】${unsubscribeGoodsNum}个\n【还剩关注店铺】${$.shopsTotalNum}个\n【还剩关注商品】${$.goodsTotalNum}个\n`);
  }
}

function getSubstr(str, leftStr, rightStr) {
  let left = str.indexOf(leftStr);
  let right = str.indexOf(rightStr, left);
  if (left < 0 || right < left) return '';
  return str.substring(left + leftStr.length, right);
}

async function goodsMain_xh() {
  $.unsubscribeGoodsCount = 0;
  if ((goodPageSize * 1) !== 0) {
    await unsubscribeGoods_xh();
    while ($.goodsTotalNum != 0) {
      await unsubscribeGoods_xh();
    }
  } else {
    console.log(`\n您设置的是不取关商品\n`);
  }
}

async function unsubscribeGoods_xh() {
  let followGoods = await getFollowGoods_xh();
  if (followGoods.iRet === '0') {
    if (followGoods.totalNum > 0) {
      let commIdList = "";
      for (let item of followGoods['data']) {
        //console.log(`是否匹配：${item.commTitle.indexOf(stopGoods.replace(/\ufffc|\s*/g, ''))}`)
        if (stopGoods && item.commTitle.indexOf(stopGoods.replace(/\ufffc|\s*/g, '')) > -1) {
          console.log(`匹配到了您设定的商品--${stopGoods}，不在进行取消关注商品`)
          break;
        } else {
          commIdList += item.commId + ",";
        }
        unsubscribeGoodsNum++;
      }
      if (commIdList.length > 0) {
        console.log("正在执行取消收藏的商品commId如下：\n" + commIdList + "\n");
        let res = await unsubscribeGoodsFun_xh(commIdList);
        if (res.iRet === "0" && res.errMsg === "success") {
          console.log(`批量取消收藏商品成功\n`)
          console.log(`已取消收藏商品：${unsubscribeGoodsNum}个\n`)
        } else {
          console.log(`批量取消收藏商品失败\n`)
        }
        await $.wait(2000);
      } else {
        console.log("无商品可取消收藏");
      }
    }
  } else {
    console.log(`获取已关注商品失败：${JSON.stringify(followGoods)}`);
  }
}

function getFollowGoods_xh() {
  $.goodsTotalNum = 0;
  return new Promise((resolve) => {
    const option = {
      url: `${JD_API_HOST}/comm/FavCommQueryFilter?cp=1&pageSize=20&sceneval=2`,
      headers: {
        "Connection": "keep-alive",
        "Cookie": cookie,
        "User-Agent": "jdapp;JD4iPhone/167724 (iPhone; iOS 15.0; Scale/3.00)",
        "Referer": "https://wqs.jd.com/"
      },
    }
    $.get(option, async (err, resp, data) => {
      try {
        data = JSON.parse(getSubstr(data, "try{(", ");}catch(e){}"));
        if (data.iRet === '0') {
          $.goodsTotalNum = data.totalNum;
          console.log(`当前已关注【商品】：${$.goodsTotalNum}个\n`)
        } else {
          $.goodsTotalNum = 0;
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  })
}

function unsubscribeGoodsFun_xh(commIdList) {
  return new Promise(resolve => {
    const option = {
      url: `${JD_API_HOST}/comm/FavCommBatchDel?commId=${commIdList}&sceneval=2&g_login_type=1`,
      headers: {
        "Connection": "keep-alive",
        "Cookie": cookie,
        "User-Agent": "jdapp;JD4iPhone/167724 (iPhone; iOS 15.0; Scale/3.00)",
        "Referer": "https://wqs.jd.com/"
      },
    }
    $.get(option, (err, resp, data) => {
      try {
        data = JSON.parse(data);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  })
}

async function shopMain_xh() {
  $.unsubscribeShopsCount = 0;
  if ((shopPageSize * 1) !== 0) {
    await unsubscribeShops_xh();
    while ($.shopsTotalNum != 0) {
      await unsubscribeShops_xh();
    }
  } else {
    console.log(`\n您设置的是不取关店铺\n`);
  }
}
async function unsubscribeShops_xh() {
  let followShops = await getFollowShops_xh();
  if (followShops.iRet === '0') {
    if (followShops.totalNum > 0) {
      let shopIdList = "";
      for (let item of followShops.data) {
        if (stopShop && (item.shopName && item.shopName.indexOf(stopShop.replace(/\s*/g, '')) > -1)) {
          console.log(`匹配到了您设定的店铺--${item.shopName}，不在进行取消关注该店铺`)
          break;
        } else {
          shopIdList += item.shopId + ",";
        }
        unsubscribeShopsNum++;
      }
      if (shopIdList.length > 0) {
        console.log("正在执行取消关注的店铺shopId如下：\n" + shopIdList + "\n");
        let res = await unsubscribeShopsFun_xh(shopIdList);
        if (res.iRet == "0") {
          console.log(`批量取消关注店铺成功`)
          console.log(`已取消关注店铺：${unsubscribeShopsNum}个\n`)
        } else {
          console.log(`批量取消关注店铺失败\n`)
        }
        await $.wait(2000);
      } else {
        console.log("无店铺可取消关注");
      }
    }
  } else {
    console.log(`获取已关注店铺失败：${JSON.stringify(followShops)}`);
  }
}

function getFollowShops_xh() {
  $.shopsTotalNum = 0;
  return new Promise((resolve) => {
    const option = {
      url: `${JD_API_HOST}/shop/QueryShopFavList?cp=1&pageSize=${shopPageSize}&sceneval=2&g_login_type=1&callback=jsonpCBKA`,
      headers: {
        "Connection": "keep-alive",
        "Cookie": cookie,
        "User-Agent": "jdapp;JD4iPhone/167724 (iPhone; iOS 15.0; Scale/3.00)",
        "Referer": "https://wqs.jd.com/"
      },
    }
    $.get(option, (err, resp, data) => {
      try {
        data = JSON.parse(getSubstr(data, "try{jsonpCBKA(", ");}catch(e){}"));
        if (data.iRet === '0') {
          $.shopsTotalNum = data.totalNum;
          console.log(`当前已关注【店铺】：${$.shopsTotalNum}个\n`)
        } else {
          $.shopsTotalNum = 0;
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  })
}

function unsubscribeShopsFun_xh(shopIdList) {
  return new Promise(resolve => {
    const option = {
      url: `${JD_API_HOST}/shop/batchunfollow?shopId=${shopIdList}&sceneval=2&g_login_type=1`,
      headers: {
        "Connection": "keep-alive",
        "Cookie": cookie,
        "User-Agent": "jdapp;JD4iPhone/167724 (iPhone; iOS 15.0; Scale/3.00)",
        "Referer": "https://wqs.jd.com/"
      },
    }
    $.get(option, (err, resp, data) => {
      try {
        data = JSON.parse(data);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
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

function requireConfig() {
  return new Promise(resolve => {
    if ($.isNode() && process.env.UN_SUBSCRIBES) {
      if (process.env.UN_SUBSCRIBES.indexOf('&') > -1) {
        $.UN_SUBSCRIBES = process.env.UN_SUBSCRIBES.split('&');
      } else if (process.env.UN_SUBSCRIBES.indexOf('\n') > -1) {
        $.UN_SUBSCRIBES = process.env.UN_SUBSCRIBES.split('\n');
      } else if (process.env.UN_SUBSCRIBES.indexOf('\\n') > -1) {
        $.UN_SUBSCRIBES = process.env.UN_SUBSCRIBES.split('\\n');
      } else {
        $.UN_SUBSCRIBES = process.env.UN_SUBSCRIBES.split();
      }
      console.log(`您环境变量 UN_SUBSCRIBES 设置的内容为:\n${JSON.stringify($.UN_SUBSCRIBES)}`)
      goodPageSize = $.UN_SUBSCRIBES[0] || goodPageSize;
      shopPageSize = $.UN_SUBSCRIBES[1] || shopPageSize;
      stopGoods = $.UN_SUBSCRIBES[2] || stopGoods;
      stopShop = $.UN_SUBSCRIBES[3] || stopShop;
    }
    resolve()
  })
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
