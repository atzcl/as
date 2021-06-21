/*
活动入口：京东APP我的-优惠券
脚本：删除优惠券
更新时间：2021-01-21
说明：1、删除优惠券名称中不含“京东”、“超市”、“生鲜”关键字的券；2、删除优惠券名称中含“XX旗舰店”的券；3、已删除的券可以在回收站中还原
 */
const $ = new Env('删除优惠券');
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';

//IOS等用户直接用NobyDa的jd cookie
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
const jdNotify = $.getdata('jdUnsubscribeNotify');//是否关闭通知，false打开通知推送，true关闭通知推送
let goodPageSize = $.getdata('jdUnsubscribePageSize') || 20;// 运行一次取消多少个已关注的商品。数字0表示不取关任何商品
let shopPageSize = $.getdata('jdUnsubscribeShopPageSize') || 20;// 运行一次取消多少个已关注的店铺。数字0表示不取关任何店铺
let stopGoods = $.getdata('jdUnsubscribeStopGoods') || '';//遇到此商品不再进行取关，此处内容需去商品详情页（自营处）长按拷贝商品信息
let stopShop = $.getdata('jdUnsubscribeStopShop') || '';//遇到此店铺不再进行取关，此处内容请尽量从头开始输入店铺名称
let delCount = 0;
let hasKeyword = 0; // 包含关键词的券
const JD_API_HOST = 'https://wq.jd.com/';

!(async () => {
  if (!cookiesArr[0]) {
    $.msg('【京东账号一】删除优惠券失败', '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
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
      await getCoupon();
      await showMsg();
    }
  }
})().catch((e) => {
  $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
}).finally(() => {
  $.done();
})

function delCoupon(couponId, couponTitle) {
  return new Promise(resolve => {
    const options = {
      url: `https://wq.jd.com/activeapi/deletecouponlistwithfinance?couponinfolist=${couponId}&_=${Date.now()}&sceneval=2&g_login_type=1&callback=jsonpCBKC&g_ty=ls`,
      headers: {
        'authority': 'wq.jd.com',
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
        'accept': '*/*',
        'referer': 'https://wqs.jd.com/',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'cookie': cookie
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        data = JSON.parse(data.match(new RegExp(/jsonpCBK.?\((.*);*/))[1]);
        if (data.retcode === 0) {
          console.log(`删除优惠券---${couponTitle}----成功\n`);
          delCount++;
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}

function getCoupon() {
  return new Promise(resolve => {
    let states = ['1', '6']
    for (let s = 0; s < states.length; s++) {
      let options = {
        url: `https://wq.jd.com/activeapi/queryjdcouponlistwithfinance?state=${states[s]}&wxadd=1&filterswitch=1&_=${Date.now()}&sceneval=2&g_login_type=1&callback=jsonpCBKB&g_ty=ls`,
        headers: {
          'authority': 'wq.jd.com',
          "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
          'accept': '*/*',
          'referer': 'https://wqs.jd.com/',
          'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
          'cookie': cookie
        }
      }
      $.get(options, async (err, resp, data) => {
        try {
          data = JSON.parse(data.match(new RegExp(/jsonpCBK.?\((.*);*/))[1]);
          let couponTitle = ''
          let couponId = ''
          if (states[s] === '6') {
            // 删除已过期
            let expire = data['coupon']['expired']
            for (let i = 0; i < expire.length; i++) {
              couponTitle = expire[i].couponTitle
              couponId = escape(`${expire[i].couponid},1,0`);
              await delCoupon(couponId, couponTitle)
            }
            // 删除已使用
            let used = data['coupon']['used']
            for (let i = 0; i < used.length; i++) {
              couponTitle = used[i].couponTitle
              couponId = escape(`${used[i].couponid},0,0`);
              await delCoupon(couponId, couponTitle)
            }
          } else if (states[s] === '1') {
            // 删除可使用且非超市、生鲜、京贴
            let useable = data.coupon.useable
            for (let i = 0; i < useable.length; i++) {
              couponTitle = useable[i].limitStr
              couponId = escape(`${useable[i].couponid},1,0`);
              if (!isJDCoupon(couponTitle)) {
                await delCoupon(couponId, couponTitle)
              } else {
                $.log(`跳过删除:${couponTitle}`)
                hasKeyword++;
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve();
        }
      })
    }
  })
}

function isJDCoupon(title) {
  if (title.indexOf('京东') > -1)
    return true
  else if (title.indexOf('超市') > -1)
    return true
  else if (title.indexOf('1元爆品') > -1)
    return true
  else if (title.indexOf('京贴') > -1)
    return true
  else if (title.indexOf('国际') > -1)
    return false
  else if (title.indexOf('旗舰店') > -1)
    return false
  else if (title.indexOf('生鲜') > -1)
    return true
  else if (title.indexOf('9.9减9') > -1)
    return true
  else if (title.indexOf('食品饮料') > -1)
    return true
  else
    return false
}

function showMsg() {
  if (!jdNotify || jdNotify === 'false') {
    $.msg($.name, ``, `【京东账号${$.index}】${$.nickName}\n【已删除优惠券】${delCount}张\n【跳过含关键词】${hasKeyword}张`);
  } else {
    $.log(`\n【京东账号${$.index}】${$.nickName}\n【已删除优惠券】${delCount}张\n【跳过含关键词】${hasKeyword}张`);
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
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}
