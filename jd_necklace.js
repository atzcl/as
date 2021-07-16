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
    }
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
let body = '', res = '', uuid = 'fc13275e23b2613e6aae772533ca6f349d2e0a86';
const ua = `jdltapp;iPhone;3.1.0;${Math.ceil(Math.random() * 4 + 10)}.${Math.ceil(Math.random() * 4)};${randomString(40)}`

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
})()

async function main() {
  try {
    let result = (await api('necklace_homePage', {}))['data']['result'];
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
    await $.wait(2000)

    for (let t of result.taskConfigVos) {
      // console.log(t.taskType, t.id, t.taskName, t.taskStage)
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
          $.id = t.id
          $.action = 'startTask'
          body = await getBody($)
          res = await api('necklace_startTask', body)
          console.log(res)
          res = await getTask(t.id)
          for (let t6 of res.data.result.taskItems) {
            console.log(t6.id, t6.title)
            res = await api('necklace_reportTask', {taskId: t.id, itemId: t6.id})
            console.log(res)
            await $.wait(2000)
          }
        } else if (t.taskType === 4 || t.taskType === 3) {
          if (t.taskStage === 0) {
            $.id = t.id
            $.action = 'startTask'
            body = await getBody($)
            res = await api('necklace_startTask', body)
            console.log(res)
            console.log(t.taskType, t.id, t.taskName)
            await homePageTask(t.taskType, t.id)
            await $.wait(2000)
          }
        }
      }
      await $.wait(2000)
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
        'User-Agent': ua,
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

function getTask(tid) {
  return new Promise(resolve => {
    $.post({
      url: `https://api.m.jd.com/api?appid=coupon-necklace&functionId=necklace_getTask&loginType=2&client=coupon-necklace&t=${Date.now()}`,
      headers: {
        'Host': 'api.m.jd.com',
        'accept': 'application/json, text/plain, */*',
        'origin': 'https://h5.m.jd.com',
        'User-Agent': ua,
        'sec-fetch-mode': 'cors',
        'content-type': 'application/x-www-form-urlencoded',
        'x-requested-with': 'com.jingdong.app.mall',
        'sec-fetch-site': 'same-site',
        'referer': 'https://h5.m.jd.com/babelDiy/Zeus/41Lkp7DumXYCFmPYtU3LTcnTTXTX/index.html',
        'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'cookie': cookie
      },
      body: `body=%7B%22taskId%22%3A${tid}%7D`
    }, (err, resp, data) => {
      try {
        data = JSON.parse(data)
        console.log(data)
      } catch (e) {
        $.logErr('Error: ', e, resp)
      } finally {
        resolve(data)
      }
    })
  })
}

async function homePageTask(taskType, id) {
  let functionId = 'getCcTaskList'
  let body = "area=16_1315_3486_59648&body=%7B%22pageClickKey%22%3A%22CouponCenter%22%2C%22shshshfpb%22%3A%22dPH6zeJy%5C/HFogCIf0ZGFYqSDOShGwmpjVOPM%5C/ViCGC5fgBLL9JoI9mjgUt46vjSFeSkmU9DZLEjFaeFTWBj4Axg%3D%3D%22%2C%22eid%22%3A%22eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY%5C/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0%5C/dGmOJzfbLuyNo%22%2C%22childActivityUrl%22%3A%22openapp.jdmobile%253a%252f%252fvirtual%253fparams%253d%257b%255c%2522category%255c%2522%253a%255c%2522jump%255c%2522%252c%255c%2522des%255c%2522%253a%255c%2522couponCenter%255c%2522%257d%22%2C%22lat%22%3A%2224.49441271645999%22%2C%22globalLat%22%3A%2224.49335%22%2C%22lng%22%3A%22118.1447713674174%22%2C%22globalLng%22%3A%22118.1423%22%7D&build=167707&client=apple&clientVersion=10.0.4&d_brand=apple&d_model=iPhone12%2C1&eid=eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0/dGmOJzfbLuyNo&isBackground=N&joycious=70&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=8a0d1837f803a12eb217fcf5e1f8769cbb3f898d&osVersion=14.3&partner=apple&rfs=0000&scope=11&screen=828%2A1792&sign=75afd018b5751e9ac4cba0b51b8adb3c&st=1624535152771&sv=101&uemps=0-0&uts=0f31TVRjBStsz%2BC9YKuTtbGZPv/xrvQQdSUKvavez1nEbzXO4dLo%2BXEvUHAXAd0VPmZqkUNAf2yO/fBM7ImhPYnyBrotzw06Kk7qP6mG42fhA1t5BkW3ZGLaQgPtiuosYOHPMyHpg%2BJ9ZQBP4g3zsSFq2DUWsTOZbb85I4ThMCgqvymyLl48ebUg7aQTle9CfTJVWu5gx0YZ/ScklgN9Pg%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=796606e8e181aa5865ec20728a27238b"
  await getCcTaskList(functionId, body, taskType);
  if (id === 229) {
    body = `area=16_1315_3486_59648&body=%7B%22shshshfpb%22%3A%22dPH6zeJy%5C/HFogCIf0ZGFYqSDOShGwmpjVOPM%5C/ViCGC5fgBLL9JoI9mjgUt46vjSFeSkmU9DZLEjFaeFTWBj4Axg%3D%3D%22%2C%22globalLng%22%3A%22118.1423%22%2C%22globalLat%22%3A%2224.49335%22%2C%22monitorSource%22%3A%22ccgroup_ios_index_task%22%2C%22monitorRefer%22%3A%22%22%2C%22taskType%22%3A%222%22%2C%22childActivityUrl%22%3A%22openapp.jdmobile%253a%252f%252fvirtual%253fparams%253d%257b%255c%2522category%255c%2522%253a%255c%2522jump%255c%2522%252c%255c%2522des%255c%2522%253a%255c%2522couponCenter%255c%2522%257d%22%2C%22pageClickKey%22%3A%22CouponCenter%22%2C%22lat%22%3A%2224.49441271645999%22%2C%22taskId%22%3A%22necklace_229%22%2C%22lng%22%3A%22118.1447713674174%22%2C%22eid%22%3A%22eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY%5C/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0%5C/dGmOJzfbLuyNo%22%7D&build=167707&client=apple&clientVersion=10.0.4&d_brand=apple&d_model=iPhone12%2C1&eid=eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0/dGmOJzfbLuyNo&isBackground=N&joycious=70&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=8a0d1837f803a12eb217fcf5e1f8769cbb3f898d&osVersion=14.3&partner=apple&rfs=0000&scope=11&screen=828%2A1792&sign=57453a76ffe9440d7961b05405fb4f13&st=1624535165882&sv=110&uemps=0-0&uts=0f31TVRjBStsz%2BC9YKuTtbGZPv/xrvQQdSUKvavez1nEbzXO4dLo%2BXEvUHAXAd0VPmZqkUNAf2yO/fBM7ImhPYnyBrotzw06Kk7qP6mG42fhA1t5BkW3ZGLaQgPtiuosYOHPMyHpg%2BJ9ZQBP4g3zsSFq2DUWsTOZbb85I4ThMCgqvymyLl48ebUg7aQTle9CfTJVWu5gx0YZ/ScklgN9Pg%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=796606e8e181aa5865ec20728a27238b`
  } else if (id === 260) {
    body = `area=16_1315_3486_59648&body=%7B%22shshshfpb%22%3A%22hRRVbEkLST%2BoqUB6fhir%2BfMoJS814u0eqASGoy8xq0vV1m9X9zKoAVYtaZjcO4UsQaWNyUrMVkZK5HBZ5aJo5zQ%3D%3D%22%2C%22globalLng%22%3A%22118.1423%22%2C%22globalLat%22%3A%2224.49335%22%2C%22monitorSource%22%3A%22ccgroup_ios_index_task%22%2C%22monitorRefer%22%3A%22%22%2C%22taskType%22%3A%222%22%2C%22childActivityUrl%22%3A%22openapp.jdmobile%253a%252f%252fvirtual%253fparams%253d%257b%255c%2522category%255c%2522%253a%255c%2522jump%255c%2522%252c%255c%2522des%255c%2522%253a%255c%2522couponCenter%255c%2522%257d%22%2C%22pageClickKey%22%3A%22CouponCenter%22%2C%22lat%22%3A%2224.49435886957707%22%2C%22taskId%22%3A%22necklace_260%22%2C%22lng%22%3A%22118.144791637343%22%2C%22eid%22%3A%22eidI0faa812328s1AvGqBpW%2BSouJeXiZIORi9gLxq36FvXhk6SQPmtUFPglIaTIxGXnVzVAwHm%5C/QEwj14SR2vxSgH5tw4rWGdLJtHzSh8bloRLoX8mFY%22%7D&build=167568&client=apple&clientVersion=9.4.2&d_brand=apple&d_model=iPhone12%2C1&eid=eidI0faa812328s1AvGqBpW%2BSouJeXiZIORi9gLxq36FvXhk6SQPmtUFPglIaTIxGXnVzVAwHm/QEwj14SR2vxSgH5tw4rWGdLJtHzSh8bloRLoX8mFY&isBackground=N&joycious=51&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=ebf4ce8ecbb641054b00c00483b1cee85660d196&osVersion=14.3&partner=apple&rfs=0000&scope=11&screen=828%2A1792&sign=93249982ced7ec850c69de8b3e859dab&st=1624610691429&sv=110&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJSTfJm3Nbyn7GqB7OtrJRuHoZMYV%2Bs0mkEZsSwjxzwlDPXLeepml5BnM5XPZQmPVomYBHlkSfLJWR5D1y0Ovgf60fpjMS2gXL5aLh50cNO3cmx2GvVTaTeYxvRUl%2BpaW7HXsuBhxJgA6pUzd01tBX9yiFih8xvToesg91Nl8KcWGYzXJ2/hWKXg%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=796606e8e181aa5865ec20728a27238b`
  } else if (id === 267) {
    body = `area=16_1315_3486_59648&body=%7B%22shshshfpb%22%3A%22dPH6zeJy%5C/HFogCIf0ZGFYqSDOShGwmpjVOPM%5C/ViCGC5fgBLL9JoI9mjgUt46vjSFeSkmU9DZLEjFaeFTWBj4Axg%3D%3D%22%2C%22globalLng%22%3A%22118.1423%22%2C%22globalLat%22%3A%2224.49335%22%2C%22monitorSource%22%3A%22ccgroup_ios_index_task%22%2C%22monitorRefer%22%3A%22%22%2C%22taskType%22%3A%222%22%2C%22childActivityUrl%22%3A%22openapp.jdmobile%253a%252f%252fvirtual%253fparams%253d%257b%255c%2522category%255c%2522%253a%255c%2522jump%255c%2522%252c%255c%2522des%255c%2522%253a%255c%2522couponCenter%255c%2522%257d%22%2C%22pageClickKey%22%3A%22CouponCenter%22%2C%22lat%22%3A%2224.49437467152672%22%2C%22taskId%22%3A%22necklace_267%22%2C%22lng%22%3A%22118.1447981202065%22%2C%22eid%22%3A%22eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY%5C/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0%5C/dGmOJzfbLuyNo%22%7D&build=167707&client=apple&clientVersion=10.0.4&d_brand=apple&d_model=iPhone12%2C1&eid=eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0/dGmOJzfbLuyNo&isBackground=N&joycious=70&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=8a0d1837f803a12eb217fcf5e1f8769cbb3f898d&osVersion=14.3&partner=apple&rfs=0000&scope=11&screen=828%2A1792&sign=64e2361aa2a81068930c0c3325fd45ef&st=1624950832218&sv=111&uemps=0-0&uts=0f31TVRjBSsMGLCxYS3UIqlZl8dbXmnuZ4ayfhN43Ot1QaV41onc66czNm7agt5ZxuI/ZiEjTyLMd9C68bu6j250BhqFBz9aHYMZHRsZRt99av4Tsia77GOWxlDaSYf5ixm0pZhBRR4OQ%2BUBD6%2BPW4wCMOS5CO3/VI2cFHPfi%2BdGNinbfncIha86vGUGuGKiHSAf4rUFY4wrafX6Rksw7g%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=796606e8e181aa5865ec20728a27238b`
  }
  if (taskType === 4) {
    console.log('需等待30秒')
    functionId = 'reportSinkTask'
    body = `&appid=XPMSGC2019&monitorSource=&uuid=16245525345801334814959&body=%7B%22platformType%22%3A%221%22%2C%22taskId%22%3A%22necklace_${id}%22%7D&client=m&clientVersion=4.6.0&area=16_1315_1316_59175&geo=%5Bobject%20Object%5D`
    await $.wait(15000);
  } else {
    console.log('需等待15秒')
    functionId = 'reportCcTask'
  }
  await $.wait(15500);
  await getCcTaskList(functionId, body, taskType);
}

function getCcTaskList(fn, body, taskType) {
  let url = `https://api.m.jd.com/client.action?functionId=${fn}`
  return new Promise(resolve => {
    if (fn === 'reportSinkTask') {
      url += body
      body = ''
    }
    $.post({
      url, body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Host": "api.m.jd.com",
        "Origin": "https://h5.m.jd.com",
        "Cookie": cookie,
        "Referer": "https://h5.m.jd.com/babelDiy/Zeus/4ZK4ZpvoSreRB92RRo8bpJAQNoTq/index.html",
        "User-Agent": ua,
      }
    }, async (err, resp, data) => {
      try {
        if (taskType === 3 && fn === 'reportCcTask')
          console.log('点击首页领券图标(进入领券中心浏览15s)任务:', data)
        if (taskType === 4 && fn === 'reportSinkTask')
          console.log('点击“券后9.9”任务:', data)
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
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
    const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
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
    resolve()
  })
}
