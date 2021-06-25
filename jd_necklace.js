const $ = new Env('点点券二代目');
const https = require('https');
const fs = require('fs/promises');
const {R_OK} = require('fs').constants;
const vm = require('vm');
const UA = require('./USER_AGENTS.js').USER_AGENT;

const URL = 'https://h5.m.jd.com/babelDiy/Zeus/41Lkp7DumXYCFmPYtU3LTcnTTXTX/index.html';
const REG_SCRIPT = /<script src="([^><]+\/(main\.\w+\.js))\?t=\d+">/gm;
const REG_ENTRY = /^(.*?\.push\(\[)(\d+,\d+)/;
const REG_PIN = /pt_pin=([^;]*)/;
const KEYWORD_MODULE = 'get_risk_result:';
const DATA = {appid: '50082', sceneid: 'DDhomePageh5'};
let smashUtils;

class ZooFakerNecklace {
  constructor(cookie, action) {
    this.cookie = cookie;
    this.action = action;
  }

  async run(data) {
    if (!smashUtils) {
      await this.init();
    }

    const t = Math.floor(1e+6 * Math.random()).toString().padEnd(6, '8');
    const pin = decodeURIComponent(this.cookie.match(REG_PIN)[1]);
    const {log} = smashUtils.get_risk_result({
      id: this.action,
      data: {
        ...data,
        pin,
        random: t,
      }
    });
    const body = {
      ...data,
      random: t,
      extraData: {log, sceneid: DATA.sceneid},
    };

    // console.log(body);
    return body;
  }

  async init() {
    console.time('ZooFakerNecklace');
    process.chdir(__dirname);
    const html = await ZooFakerNecklace.httpGet(URL);
    const script = REG_SCRIPT.exec(html);

    if (script) {
      const [, scriptUrl, filename] = script;
      const jsContent = await this.getJSContent(filename, scriptUrl);
      const fnMock = new Function;
      const ctx = {
        window: {addEventListener: fnMock},
        document: {
          addEventListener: fnMock,
          removeEventListener: fnMock,
          cookie: this.cookie,
        },
        navigator: {userAgent: UA},
      };
      const _this = this;
      Object.defineProperty(ctx.document, 'cookie', {
        get() {
          return _this.cookie;
        },
      });

      vm.createContext(ctx);
      vm.runInContext(jsContent, ctx);

      smashUtils = ctx.window.smashUtils;
      smashUtils.init(DATA);

      // console.log(ctx);
    }

    // console.log(html);
    // console.log(script[1],script[2]);
    console.timeEnd('ZooFakerNecklace');
  }

  async getJSContent(cacheKey, url) {
    try {
      await fs.access(cacheKey, R_OK);
      const rawFile = await fs.readFile(cacheKey, {encoding: 'utf8'});

      return rawFile;
    } catch (e) {
      let jsContent = await ZooFakerNecklace.httpGet(url);
      const findEntry = REG_ENTRY.test(jsContent);
      const ctx = {
        moduleIndex: 0,
      };
      const injectCode = `moduleIndex=arguments[0].findIndex(s=>s&&s.toString().indexOf('${KEYWORD_MODULE}')>0);return;`;
      const injectedContent = jsContent.replace(/^(!function\(\w\){)/, `$1${injectCode}`);

      vm.createContext(ctx);
      vm.runInContext(injectedContent, ctx);

      if (!(ctx.moduleIndex && findEntry)) {
        throw new Error('Module not found.');
      }
      jsContent = jsContent.replace(REG_ENTRY, `$1${ctx.moduleIndex},1`);
      // Fix device info (actually insecure, make less sense)
      jsContent = jsContent.replace(/\w+\.getDefaultArr\(7\)/, '["a","a","a","a","a","a","1"]');
      fs.writeFile(cacheKey, jsContent);
      return jsContent;

      REG_ENTRY.lastIndex = 0;
      const entry = REG_ENTRY.exec(jsContent);

      console.log(ctx.moduleIndex);
      console.log(entry[2]);
    }
  }

  static httpGet(url) {
    return new Promise((resolve, reject) => {
      const protocol = url.indexOf('http') !== 0 ? 'https:' : '';
      const req = https.get(protocol + url, (res) => {
        res.setEncoding('utf-8');

        let rawData = '';

        res.on('error', reject);
        res.on('data', chunk => rawData += chunk);
        res.on('end', () => resolve(rawData));
      });

      req.on('error', reject);
      req.end();
    });
  }
}

async function getBody($ = {}) {
  let riskData;
  switch ($.action) {
    case 'startTask':
      riskData = {taskId: $.id};
      break;
    case 'chargeScores':
      riskData = {bubleId: $.id};
      break;
    case 'sign':
      riskData = {};
    default:
      break;
  }
  const zf = new ZooFakerNecklace($.cookie, $.action);
  const log = await zf.run(riskData);

  return log
}

let cookiesArr = [], cookie = '', jdFruitShareArr = [], isBox = false, notify, newShareCodes, allMessage = '';
let body = '', res = '', uuid = 'fc13275e23b2613e6aae772533ca6f349d2e0a86'

!(async () => {
  await requireConfig();

  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.cookie = cookie;
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      await TotalBean();
      console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await main();
    }
  }
  if ($.isNode() && allMessage) {
    // await notify.sendNotify(`${$.name}`, `${allMessage}`, { url: openUrl })
  }
})()

async function main() {
  try {
    let result = (await api('necklace_homePage', {}))['data']['result'];
    // writeFile(JSON.stringify(result))

    try {
      if (result.signInfo.todayCurrentSceneSignStatus === 1) {
        $.action = 'sign';
        body = await getBody($)
        res = await api('necklace_sign', body);
        try {
          res.data.biz_code === 0 ? console.log('签到成功！获得', res.data.result.totalScoreNum) : console.log('签到失败！', JSON.stringify(res))
        } catch (e) {
          $.logErr("Signin Error: ", res)
        }
      }
    } catch (e) {
      console.log('没有获取到签到信息！')
    }
    await $.wait(3000)

    for (let t of result.taskConfigVos) {
      // console.log(t.id, t.taskName, t.taskType, t.taskStage)
      if (t.taskStage === 0 || t.taskStage === 1) {
        if (t.taskType === 2) {
          console.log(t.taskType, t.id, t.taskName, t.taskStage)
          if (t.taskStage === 0) {
            $.id = t.id
            $.action = 'startTask'
            body = await getBody($)
            res = await api('necklace_startTask', body)
            console.log('startTask: ', res)
            await $.wait(3000)
          }
          res = await api('necklace_reportTask', {"taskId": t.id})
          console.log('reportTask: ', res)
          await $.wait(2000)
        } else if (t.taskType === 6) {
          console.log(t.taskType, t.id, t.taskName, t.taskStage)
          res = await api('necklace_getTask', {taskId: t.id})
          for (let t6 of res.data.result.taskItems) {
            console.log(t6.id, t6.title)
            res = await api('necklace_reportTask', {taskId: t.id, itemId: t6.id})
            console.log(res)
            await $.wait(2000)
          }
        } else {
          console.log('其他任务')
          console.log('我不会')
        }
      }
    }

    result = (await api('necklace_homePage', {}))['data']['result'];
    for (let bubble of result.bubbles) {
      console.log('bubble:', bubble.score, bubble.id)
      $.action = 'chargeScores'
      $.id = bubble.id
      body = await getBody($)
      res = await api('necklace_chargeScores', body)
      try {
        res.data.biz_code === 0
          ? console.log('领奖成功！获得', res.data.result.giftScoreNum)
          : console.log('领奖失败！', JSON.stringify(res))
      } catch (e) {
        console.log('Bubble Error: ', res)
      }
      await $.wait(2000)
    }
  } catch (e) {
    console.log('运行失败，请手动进入app查看是否正常！')
    console.log('-----------')
    console.log(e)
    console.log('-----------')
  }
}

function api(fnId, body) {
  return new Promise(resolve => {
    $.post({
      url: `https://api.m.jd.com/api?appid=coupon-necklace&functionId=${fnId}&loginType=2&client=coupon-necklace&t=${Date.now()}&uuid=${uuid}`,
      headers: {
        'Host': 'api.m.jd.com',
        'accept': 'application/json, text/plain, */*',
        'content-type': 'application/x-www-form-urlencoded',
        'origin': 'https://h5.m.jd.com',
        'accept-language': 'zh-cn',
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        'referer': 'https://h5.m.jd.com/',
        'cookie': cookie
      },
      body: `body=${escape(JSON.stringify(body))}`
    }, (err, resp, data) => {
      try {
        data = JSON.parse(data)
      } catch (e) {
        $.logErr('Error: ', e, resp)
      } finally {
        resolve(data)
      }
    })
  })
}

function randomString(e) {
  e = e || 32;
  let t = "abcdefhijkmnprstwxyz2345678", a = t.length, n = "";
  for (i = 0; i < e; i++)
    n += t.charAt(Math.floor(Math.random() * a));
  return n
}

function writeFile(text) {
  if ($.isNode()) {
    const fs = require('fs');
    fs.writeFile('a.json', text, () => {
    })
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

function requireConfig() {
  return new Promise(resolve => {
    notify = $.isNode() ? require('./sendNotify') : '';
    //Node.js用户请在jdCookie.js处填写京东ck;
    const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
    const jdPetShareCodes = '';
    //IOS等用户直接用NobyDa的jd cookie
    if ($.isNode()) {
      Object.keys(jdCookieNode).forEach((item) => {
        if (jdCookieNode[item]) {
          cookiesArr.push(jdCookieNode[item])
        }
      })
      if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
      };
    } else {
      cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
    }
    console.log(`共${cookiesArr.length}个京东账号\n`)
    $.shareCodesArr = [];
    if ($.isNode()) {
      Object.keys(jdPetShareCodes).forEach((item) => {
        if (jdPetShareCodes[item]) {
          $.shareCodesArr.push(jdPetShareCodes[item])
        }
      })
    } else {
      // if ($.getdata('jd_pet_inviter')) $.shareCodesArr = $.getdata('jd_pet_inviter').split('\n').filter(item => !!item);
      // console.log(`\nBoxJs设置的${$.name}好友邀请码:${$.getdata('jd_pet_inviter') ? $.getdata('jd_pet_inviter') : '暂无'}\n`);
    }
    // console.log(`您提供了${$.shareCodesArr.length}个账号的东东萌宠助力码\n`);
    resolve()
  })
}
