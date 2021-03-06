/**
 脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
 IOS用户支持京东双账号,NodeJs用户支持N个京东账号
 更新时间：2021-06-21
 活动入口：京东APP我的-宠汪汪
 完成度 1%，要用的手动执行，先不加cron了
 默认80，10、20、40、80可选
 export feedNum = 80
 默认双人跑
 export JD_JOY_teamLevel = 2
 */

 const $ = new Env("宠汪汪二代目")
 console.log('\n====================Hello World====================\n')

 const http = require('http');
 const stream = require('stream');
 const zlib = require('zlib');
 const vm = require('vm');
 const PNG = require('png-js');
 const UA = require('./USER_AGENTS.js').USER_AGENT;
 const fs = require("fs");
 const md5 = Env.prototype.md5;

 Math.avg = function average() {
   var sum = 0;
   var len = this.length;
   for (var i = 0; i < len; i++) {
     sum += this[i];
   }
   return sum / len;
 };

 function sleep(timeout) {
   return new Promise((resolve) => setTimeout(resolve, timeout));
 }

 class PNGDecoder extends PNG {
   constructor(args) {
     super(args);
     this.pixels = [];
   }

   decodeToPixels() {
     return new Promise((resolve) => {
       this.decode((pixels) => {
         this.pixels = pixels;
         resolve();
       });
     });
   }

   getImageData(x, y, w, h) {
     const {pixels} = this;
     const len = w * h * 4;
     const startIndex = x * 4 + y * (w * 4);

     return {data: pixels.slice(startIndex, startIndex + len)};
   }
 }

 const PUZZLE_GAP = 8;
 const PUZZLE_PAD = 10;

 class PuzzleRecognizer {
   constructor(bg, patch, y) {
     // console.log(bg);
     const imgBg = new PNGDecoder(Buffer.from(bg, 'base64'));
     const imgPatch = new PNGDecoder(Buffer.from(patch, 'base64'));

     // console.log(imgBg);

     this.bg = imgBg;
     this.patch = imgPatch;
     this.rawBg = bg;
     this.rawPatch = patch;
     this.y = y;
     this.w = imgBg.width;
     this.h = imgBg.height;
   }

   async run() {
     await this.bg.decodeToPixels();
     await this.patch.decodeToPixels();

     return this.recognize();
   }

   recognize() {
     const {ctx, w: width, bg} = this;
     const {width: patchWidth, height: patchHeight} = this.patch;
     const posY = this.y + PUZZLE_PAD + ((patchHeight - PUZZLE_PAD) / 2) - (PUZZLE_GAP / 2);
     // const cData = ctx.getImageData(0, a.y + 10 + 20 - 4, 360, 8).data;
     const cData = bg.getImageData(0, posY, width, PUZZLE_GAP).data;
     const lumas = [];

     for (let x = 0; x < width; x++) {
       var sum = 0;

       // y xais
       for (let y = 0; y < PUZZLE_GAP; y++) {
         var idx = x * 4 + y * (width * 4);
         var r = cData[idx];
         var g = cData[idx + 1];
         var b = cData[idx + 2];
         var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

         sum += luma;
       }

       lumas.push(sum / PUZZLE_GAP);
     }

     const n = 2; // minium macroscopic image width (px)
     const margin = patchWidth - PUZZLE_PAD;
     const diff = 20; // macroscopic brightness difference
     const radius = PUZZLE_PAD;
     for (let i = 0, len = lumas.length - 2 * 4; i < len; i++) {
       const left = (lumas[i] + lumas[i + 1]) / n;
       const right = (lumas[i + 2] + lumas[i + 3]) / n;
       const mi = margin + i;
       const mLeft = (lumas[mi] + lumas[mi + 1]) / n;
       const mRigth = (lumas[mi + 2] + lumas[mi + 3]) / n;

       if (left - right > diff && mLeft - mRigth < -diff) {
         const pieces = lumas.slice(i + 2, margin + i + 2);
         const median = pieces.sort((x1, x2) => x1 - x2)[20];
         const avg = Math.avg(pieces);

         // noise reducation
         if (median > left || median > mRigth) return;
         if (avg > 100) return;
         // console.table({left,right,mLeft,mRigth,median});
         // ctx.fillRect(i+n-radius, 0, 1, 360);
         // console.log(i+n-radius);
         return i + n - radius;
       }
     }

     // not found
     return -1;
   }
 }

 const DATA = {
   "appId": "17839d5db83",
   "scene": "cww",
   "product": "embed",
   "lang": "zh_CN",
 };
 const SERVER = '49.7.27.91';

 class JDJRValidator {
   constructor() {
     this.data = {};
     this.x = 0;
     this.t = Date.now();
   }

   async run() {
     const tryRecognize = async () => {
       const x = await this.recognize();

       if (x > 0) {
         return x;
       }
       // retry
       return await tryRecognize();
     };
     const puzzleX = await tryRecognize();
     // console.log(puzzleX);
     const pos = new MousePosFaker(puzzleX).run();
     const d = getCoordinate(pos);

     // console.log(pos[pos.length-1][2] -Date.now());
     // await sleep(4500);
     await sleep(pos[pos.length - 1][2] - Date.now());
     const result = await JDJRValidator.jsonp('/slide/s.html', {d, ...this.data});

     if (result.message === 'success') {
       console.log(result);
       console.log('JDJRValidator: %fs', (Date.now() - this.t) / 1000);
       return result;
     } else {
       console.count(JSON.stringify(result));
       await sleep(300);
       return await this.run();
     }
   }

   async recognize() {
     const data = await JDJRValidator.jsonp('/slide/g.html', {e: ''});
     const {bg, patch, y} = data;
     // const uri = 'data:image/png;base64,';
     // const re = new PuzzleRecognizer(uri+bg, uri+patch, y);
     const re = new PuzzleRecognizer(bg, patch, y);
     const puzzleX = await re.run();

     if (puzzleX > 0) {
       this.data = {
         c: data.challenge,
         w: re.w,
         e: '',
         s: '',
         o: '',
       };
       this.x = puzzleX;
     }
     return puzzleX;
   }

   async report(n) {
     console.time('PuzzleRecognizer');
     let count = 0;

     for (let i = 0; i < n; i++) {
       const x = await this.recognize();

       if (x > 0) count++;
       if (i % 50 === 0) {
         // console.log('%f\%', (i / n) * 100);
       }
     }

     // console.log('successful: %f\%', (count / n) * 100);
     console.timeEnd('PuzzleRecognizer');
   }

   static jsonp(api, data = {}) {
     return new Promise((resolve, reject) => {
       const fnId = `jsonp_${String(Math.random()).replace('.', '')}`;
       const extraData = {callback: fnId};
       const query = new URLSearchParams({...DATA, ...extraData, ...data}).toString();
       const url = `http://${SERVER}${api}?${query}`;
       const headers = {
         'Accept': '*/*',
         'Accept-Encoding': 'gzip,deflate,br',
         'Accept-Language': 'zh-CN,en-US',
         'Connection': 'keep-alive',
         'Host': SERVER,
         'Proxy-Connection': 'keep-alive',
         'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html',
         'User-Agent': UA,
       };
       const req = http.get(url, {headers}, (response) => {
         try {
           let res = response;
           if (res.headers['content-encoding'] === 'gzip') {
             const unzipStream = new stream.PassThrough();
             stream.pipeline(
               response,
               zlib.createGunzip(),
               unzipStream,
               reject,
             );
             res = unzipStream;
           }
           res.setEncoding('utf8');

           let rawData = '';

           res.on('data', (chunk) => rawData += chunk);
           res.on('end', () => {
             try {
               const ctx = {
                 [fnId]: (data) => ctx.data = data,
                 data: {},
               };
               vm.createContext(ctx);
               vm.runInContext(rawData, ctx);
               res.resume();
               resolve(ctx.data);
             } catch (e) {
               console.log('生成验证码必须使用大陆IP')
             }
           })
         } catch (e) {
         }
       })

       req.on('error', reject);
       req.end();
     });
   }
 }

 function getCoordinate(c) {
   function string10to64(d) {
     var c = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-~".split("")
       , b = c.length
       , e = +d
       , a = [];
     do {
       mod = e % b;
       e = (e - mod) / b;
       a.unshift(c[mod])
     } while (e);
     return a.join("")
   }

   function prefixInteger(a, b) {
     return (Array(b).join(0) + a).slice(-b)
   }

   function pretreatment(d, c, b) {
     var e = string10to64(Math.abs(d));
     var a = "";
     if (!b) {
       a += (d > 0 ? "1" : "0")
     }
     a += prefixInteger(e, c);
     return a
   }

   var b = new Array();
   for (var e = 0; e < c.length; e++) {
     if (e == 0) {
       b.push(pretreatment(c[e][0] < 262143 ? c[e][0] : 262143, 3, true));
       b.push(pretreatment(c[e][1] < 16777215 ? c[e][1] : 16777215, 4, true));
       b.push(pretreatment(c[e][2] < 4398046511103 ? c[e][2] : 4398046511103, 7, true))
     } else {
       var a = c[e][0] - c[e - 1][0];
       var f = c[e][1] - c[e - 1][1];
       var d = c[e][2] - c[e - 1][2];
       b.push(pretreatment(a < 4095 ? a : 4095, 2, false));
       b.push(pretreatment(f < 4095 ? f : 4095, 2, false));
       b.push(pretreatment(d < 16777215 ? d : 16777215, 4, true))
     }
   }
   return b.join("")
 }

 const HZ = 25;

 class MousePosFaker {
   constructor(puzzleX) {
     this.x = parseInt(Math.random() * 20 + 20, 10);
     this.y = parseInt(Math.random() * 80 + 80, 10);
     this.t = Date.now();
     this.pos = [[this.x, this.y, this.t]];
     this.minDuration = parseInt(1000 / HZ, 10);
     // this.puzzleX = puzzleX;
     this.puzzleX = puzzleX + parseInt(Math.random() * 2 - 1, 10);

     this.STEP = parseInt(Math.random() * 6 + 5, 10);
     this.DURATION = parseInt(Math.random() * 7 + 14, 10) * 100;
     // [9,1600] [10,1400]
     this.STEP = 9;
     // this.DURATION = 2000;
     // console.log(this.STEP, this.DURATION);
   }

   run() {
     const perX = this.puzzleX / this.STEP;
     const perDuration = this.DURATION / this.STEP;
     const firstPos = [this.x - parseInt(Math.random() * 6, 10), this.y + parseInt(Math.random() * 11, 10), this.t];

     this.pos.unshift(firstPos);
     this.stepPos(perX, perDuration);
     this.fixPos();

     const reactTime = parseInt(60 + Math.random() * 100, 10);
     const lastIdx = this.pos.length - 1;
     const lastPos = [this.pos[lastIdx][0], this.pos[lastIdx][1], this.pos[lastIdx][2] + reactTime];

     this.pos.push(lastPos);
     return this.pos;
   }

   stepPos(x, duration) {
     let n = 0;
     const sqrt2 = Math.sqrt(2);
     for (let i = 1; i <= this.STEP; i++) {
       n += 1 / i;
     }
     for (let i = 0; i < this.STEP; i++) {
       x = this.puzzleX / (n * (i + 1));
       const currX = parseInt((Math.random() * 30 - 15) + x, 10);
       const currY = parseInt(Math.random() * 7 - 3, 10);
       const currDuration = parseInt((Math.random() * 0.4 + 0.8) * duration, 10);

       this.moveToAndCollect({
         x: currX,
         y: currY,
         duration: currDuration,
       });
     }
   }

   fixPos() {
     const actualX = this.pos[this.pos.length - 1][0] - this.pos[1][0];
     const deviation = this.puzzleX - actualX;

     if (Math.abs(deviation) > 4) {
       this.moveToAndCollect({
         x: deviation,
         y: parseInt(Math.random() * 8 - 3, 10),
         duration: 250,
       });
     }
   }

   moveToAndCollect({x, y, duration}) {
     let movedX = 0;
     let movedY = 0;
     let movedT = 0;
     const times = duration / this.minDuration;
     let perX = x / times;
     let perY = y / times;
     let padDuration = 0;

     if (Math.abs(perX) < 1) {
       padDuration = duration / Math.abs(x) - this.minDuration;
       perX = 1;
       perY = y / Math.abs(x);
     }

     while (Math.abs(movedX) < Math.abs(x)) {
       const rDuration = parseInt(padDuration + Math.random() * 16 - 4, 10);

       movedX += perX + Math.random() * 2 - 1;
       movedY += perY;
       movedT += this.minDuration + rDuration;

       const currX = parseInt(this.x + movedX, 10);
       const currY = parseInt(this.y + movedY, 10);
       const currT = this.t + movedT;

       this.pos.push([currX, currY, currT]);
     }

     this.x += x;
     this.y += y;
     this.t += Math.max(duration, movedT);
   }
 }

 function injectToRequest(fn) {
   return (opts, cb) => {
     fn(opts, async (err, resp, data) => {
       if (err) {
         console.error('Failed to request.');
         return;
       }

       if (data.search('验证') > -1) {
         console.log('JDJRValidator trying......');
         const res = await new JDJRValidator().run();

         opts.url += `&validate=${res.validate}`;
         fn(opts, cb);
       } else {
         cb(err, resp, data);
       }
     });
   };
 }

 let cookiesArr = [], cookie = '', notify;
 $.get = injectToRequest($.get.bind($))
 $.post = injectToRequest($.post.bind($))

 !(async () => {
   await requireConfig();
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
       $.nickName = $.UserName;
       if (!require('./JS_USER_AGENTS').HelloWorld) {
         console.log(`\n【京东账号${$.index}】${$.nickName || $.UserName}：运行环境检测失败\n`);
         continue
       }
       console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
       message = '';
       subTitle = '';

       await getFriends();

       await run('detail/v2');
       await run();
       await feed();

       let tasks = await taskList();
       for (let tp of tasks.datas) {
         console.log(tp.taskName, tp.receiveStatus)

         if (tp.receiveStatus === 'unreceive') {
           await award(tp.taskType);
           await $.wait(3000);
         }
         if (tp.taskName === '浏览频道') {
           for (let i = 0; i < 3; i++) {
             console.log(`\t第${i + 1}次浏览频道 检查遗漏`)
             let followChannelList = await getFollowChannels();
             for (let t of followChannelList['datas']) {
               if (!t.status) {
                 console.log('┖', t['channelName'])
                 await beforeTask('follow_channel', t.channelId);
                 await doTask(JSON.stringify({"channelId": t.channelId, "taskType": 'FollowChannel'}))
                 await $.wait(3000)
               }
             }
             await $.wait(3000)
           }
         }
         if (tp.taskName === '逛会场') {
           for (let t of tp.scanMarketList) {
             if (!t.status) {
               console.log('┖', t.marketName)
               await doTask(JSON.stringify({
                 "marketLink": `${t.marketLink || t.marketLinkH5}`,
                 "taskType": "ScanMarket"
               }))
               await $.wait(3000)
             }
           }
         }
         if (tp.taskName === '关注商品') {
           for (let t of tp.followGoodList) {
             if (!t.status) {
               console.log('┖', t.skuName)
               await beforeTask('follow_good', t.sku)
               await $.wait(1000)
               await doTask(`sku=${t.sku}`, 'followGood')
               await $.wait(3000)
             }
           }
         }
         if (tp.taskName === '关注店铺') {
           for (let t of tp.followShops) {
             if (!t.status) {
               await beforeTask('follow_shop', t.shopId);
               await $.wait(1000);
               await followShop(t.shopId)
               await $.wait(2000);
             }
           }
         }
       }
     }
   }
 })()

 function getFollowChannels() {
   return new Promise(resolve => {
     let lkt = new Date().getTime()
     let lks = md5('' + 'RtKLB8euDo7KwsO0' + lkt).toString()
     $.get({
       url: `https://jdjoy.jd.com/common/pet/getFollowChannels?reqSource=h5&invokeKey=RtKLB8euDo7KwsO0`,
       headers: {
         lkt: lkt,
         lks: lks,
         'Host': 'api.m.jd.com',
         'accept': '*/*',
         'content-type': 'application/x-www-form-urlencoded',
         'referer': '',
         "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
         'accept-language': 'zh-Hans-CN;q=1',
         'cookie': cookie
       },
     }, (err, resp, data) => {
       resolve(JSON.parse(data))
     })
   })
 }

 function taskList() {
   return new Promise(resolve => {
     let lkt = new Date().getTime()
     let lks = md5('' + 'RtKLB8euDo7KwsO0' + lkt).toString()
     $.get({
       url: `https://jdjoy.jd.com/common/pet/getPetTaskConfig?reqSource=h5&invokeKey=RtKLB8euDo7KwsO0`,
       headers: {
         lkt: lkt,
         lks: lks,
         'Origin': 'https://h5.m.jd.com',
         'Host': 'jdjoy.jd.com',
         'Content-Type': 'application/json',
         'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html',
         'User-Agent': 'jdapp;iPhone;10.1.0;12.4.1;fc13275e23b2613e6aae772533ca6f349d2e0a86;network/wifi;ADID/C51FD279-5C69-4F94-B1C5-890BC8EB501F;model/iPhone11,6;addressid/589374288;appBuild/167774;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
         'Cookie': cookie
       }
     }, (err, resp, data) => {
       try {
         if (err)
           console.log(err)
         data = JSON.parse(data)
         resolve(data);
       } catch (e) {
         $.logErr(e);
       } finally {
         resolve();
       }
     })
   })
 }

 function beforeTask(fn, shopId) {
   return new Promise(resolve => {
     let lkt = new Date().getTime()
     let lks = md5('' + 'RtKLB8euDo7KwsO0' + lkt).toString()
     $.get({
       url: `https://jdjoy.jd.com/common/pet/icon/click?iconCode=${fn}&linkAddr=${shopId}&reqSource=h5&invokeKey=RtKLB8euDo7KwsO0`,
       headers: {
         lkt: lkt,
         lks: lks,
         'Accept': '*/*',
         'Connection': 'keep-alive',
         'Content-Type': 'application/json',
         'Origin': 'https://h5.m.jd.com',
         'Accept-Language': 'zh-cn',
         'Host': 'jdjoy.jd.com',
         'User-Agent': 'jdapp;iPhone;10.0.6;12.4.1;fc13275e23b2613e6aae772533ca6f349d2e0a86;network/wifi;ADID/C51FD279-5C69-4F94-B1C5-890BC8EB501F;model/iPhone11,6;addressid/589374288;appBuild/167724;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
         'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html',
         'cookie': cookie
       }
     }, (err, resp, data) => {
       console.log('before task:', data);
       resolve();
     })
   })
 }

 function followShop(shopId) {
   return new Promise(resolve => {
     let lkt = new Date().getTime()
     let lks = md5('' + 'RtKLB8euDo7KwsO0' + lkt).toString()
     $.post({
       url: `https://jdjoy.jd.com/common/pet/followShop?reqSource=h5&invokeKey=RtKLB8euDo7KwsO0`,
       headers: {
         lkt: lkt,
         lks: lks,
         'User-Agent': 'jdapp;iPhone;10.0.6;12.4.1;fc13275e23b2613e6aae772533ca6f349d2e0a86;network/wifi;ADID/C51FD279-5C69-4F94-B1C5-890BC8EB501F;model/iPhone11,6;addressid/589374288;appBuild/167724;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
         'Accept-Language': 'zh-cn',
         'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html?babelChannel=ttt12&lng=0.000000&lat=0.000000&sid=87e644ae51ba60e68519b73d1518893w&un_area=12_904_3373_62101',
         'Host': 'jdjoy.jd.com',
         'Origin': 'https://h5.m.jd.com',
         'Accept': '*/*',
         'Connection': 'keep-alive',
         'Content-Type': 'application/x-www-form-urlencoded',
         'cookie': cookie
       },
       body: `shopId=${shopId}`
     }, (err, resp, data) => {
       console.log(data)
       resolve();
     })
   })
 }

 function doTask(body, fnId = 'scan') {
   return new Promise(resolve => {
     let lkt = new Date().getTime()
     let lks = md5('' + 'RtKLB8euDo7KwsO0' + lkt).toString()
     $.post({
       url: `https://jdjoy.jd.com/common/pet/${fnId}?reqSource=h5&invokeKey=RtKLB8euDo7KwsO0`,
       headers: {
         'lkt': lkt,
         'lks': lks,
         'Host': 'jdjoy.jd.com',
         'accept': '*/*',
         'content-type': fnId === 'followGood' || fnId === 'followShop' ? 'application/x-www-form-urlencoded' : 'application/json',
         'origin': 'https://h5.m.jd.com',
         'accept-language': 'zh-cn',
         'referer': 'https://h5.m.jd.com/',
         'Content-Type': fnId === 'followGood' ? 'application/x-www-form-urlencoded' : 'application/json; charset=UTF-8',
         "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
         'cookie': cookie
       },
       body: body
     }, (err, resp, data) => {
       if (err)
         console.log('\tdoTask() Error:', err)
       try {
         console.log('\tdotask:', data)
         data = JSON.parse(data);
         data.success ? console.log('\t任务成功') : console.log('\t任务失败', JSON.stringify(data))
       } catch (e) {
         $.logErr(e);
       } finally {
         resolve();
       }
     })
   })
 }

 function feed() {
   let feedNum = process.env.feedNum ? process.env.feedNum : 80
   return new Promise(resolve => {
     let lkt = new Date().getTime()
     let lks = md5('' + 'RtKLB8euDo7KwsO0' + lkt).toString()
     $.post({
       url: `https://jdjoy.jd.com/common/pet/enterRoom/h5?invitePin=&reqSource=h5&invokeKey=RtKLB8euDo7KwsO0`,
       headers: {
         'lkt': lkt,
         'lks': lks,
         'Host': 'jdjoy.jd.com',
         'accept': '*/*',
         'content-type': 'application/json',
         'origin': 'https://h5.m.jd.com',
         'accept-language': 'zh-cn',
         "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
         'referer': 'https://h5.m.jd.com/',
         'Content-Type': 'application/json; charset=UTF-8',
         'cookie': cookie
       },
       body: JSON.stringify({})
     }, (err, resp, data) => {
       data = JSON.parse(data)
       if (new Date().getTime() - new Date(data.data.lastFeedTime) < 10800000) {
         console.log('喂食间隔不够。')
         resolve();
       } else {
         console.log('开始喂食......')
         let lkt = new Date().getTime()
         let lks = md5('' + 'RtKLB8euDo7KwsO0' + lkt).toString()
         $.get({
           url: `https://jdjoy.jd.com/common/pet/feed?feedCount=${feedNum}&reqSource=h5&invokeKey=RtKLB8euDo7KwsO0`,
           headers: {
             'lkt': lkt,
             'lks': lks,
             'Host': 'jdjoy.jd.com',
             'accept': '*/*',
             'content-type': 'application/x-www-form-urlencoded',
             'origin': 'https://h5.m.jd.com',
             'accept-language': 'zh-cn',
             "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
             'referer': 'https://h5.m.jd.com/',
             'cookie': cookie
           },
         }, (err, resp, data) => {
           try {
             data = JSON.parse(data);
             data.errorCode === 'feed_ok' ? console.log(`\t喂食成功！`) : console.log('\t喂食失败', JSON.stringify(data))
           } catch (e) {
             $.logErr(e);
           } finally {
             resolve();
           }
         })
       }
     })
   })
 }

 function award(taskType) {
   return new Promise(resolve => {
     let lkt = new Date().getTime()
     let lks = md5('' + 'RtKLB8euDo7KwsO0' + lkt).toString()
     $.get({
       url: `https://jdjoy.jd.com/common/pet/getFood?reqSource=h5&invokeKey=RtKLB8euDo7KwsO0&taskType=${taskType}`,
       headers: {
         'lkt': lkt,
         'lks': lks,
         'Host': 'jdjoy.jd.com',
         'accept': '*/*',
         'content-type': 'application/x-www-form-urlencoded',
         'origin': 'https://h5.m.jd.com',
         'accept-language': 'zh-cn',
         "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
         'referer': 'https://h5.m.jd.com/',
         'Content-Type': 'application/json; charset=UTF-8',
         'cookie': cookie
       },
     }, (err, resp, data) => {
       try {
         data = JSON.parse(data);
         data.errorCode === 'received' ? console.log('任务完成:', data.data) : console.log('\t任务失败:', data)
       } catch (e) {
         $.logErr(e);
       } finally {
         resolve();
       }
     })
   })
 }

 function run(fn = 'match') {
   let level = process.env.JD_JOY_teamLevel ? process.env.JD_JOY_teamLevel : 2
   return new Promise(resolve => {
     let lkt = new Date().getTime()
     let lks = md5('' + 'RtKLB8euDo7KwsO0' + lkt).toString()
     $.get({
       url: `https://jdjoy.jd.com/common/pet/combat/${fn}?teamLevel=${level}&reqSource=h5&invokeKey=RtKLB8euDo7KwsO0`,
       headers: {
         'lkt': lkt,
         'lks': lks,
         'Host': 'jdjoy.jd.com',
         'sec-fetch-mode': 'cors',
         'origin': 'https://h5.m.jd.com',
         'content-type': 'application/json',
         'accept': '*/*',
         'x-requested-with': 'com.jingdong.app.mall',
         'sec-fetch-site': 'same-site',
         'referer': 'https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html',
         'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
         "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
         'cookie': cookie
       },
     }, async (err, resp, data) => {
       try {
         if (fn === 'receive') {
           console.log('领取赛跑奖励：', data)
         } else {
           data = JSON.parse(data);
           let race = data.data.petRaceResult
           if (race === 'participate') {
             console.log('匹配成功！')
           } else if (race === 'unbegin') {
             console.log('还未开始！')
           } else if (race === 'matching') {
             console.log('正在匹配！')
             await $.wait(2000)
             await run()
           } else if (race === 'unreceive') {
             console.log('开始领奖')
             await run('receive')
           } else if (race === 'time_over') {
             console.log('不在比赛时间')
           } else {
             console.log('这是什么！', data)
           }
         }
       } catch (e) {
         console.log(e)
       } finally {
         resolve();
       }
     })
   })
 }

 function getFriends() {
   return new Promise((resolve) => {
     let lkt = new Date().getTime()
     let lks = md5('' + 'RtKLB8euDo7KwsO0' + lkt).toString()
     $.post({
       url: 'https://jdjoy.jd.com/common/pet/enterRoom/h5?invitePin=&reqSource=h5&invokeKey=RtKLB8euDo7KwsO0',
       headers: {
         'lkt': lkt,
         'lks': lks,
         'Host': 'jdjoy.jd.com',
         'Content-Type': 'application/json',
         'X-Requested-With': 'com.jingdong.app.mall',
         'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html?babelChannel=ttt12&sid=445902658831621c5acf782ec27ce21w&un_area=12_904_3373_62101',
         'Origin': 'https://h5.m.jd.com',
         'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
         'Cookie': cookie
       },
       body: JSON.stringify({})
     }, async (err, resp, data) => {
       let flag = true
       for (let k = 0; k < 20; k++) {
         if (flag) {
           await $.wait(1000)
         } else {
           console.log('无法获取好友列表')
           break
         }
         $.get({
           url: 'https://jdjoy.jd.com/common/pet/h5/getFriends?itemsPerPage=20&currentPage=1&reqSource=h5&invokeKey=RtKLB8euDo7KwsO0',
           headers: {
             'Host': 'jdjoy.jd.com',
             'Accept': '*/*',
             'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html',
             "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
             'cookie': cookie
           }
         }, async (err, resp, data) => {
           data = JSON.parse(data)
           if (data.datas) {
             for (let f of data.datas) {
               if (f.stealStatus === 'can_steal') {
                 console.log('可偷:', f.friendPin)
                 let lkt = new Date().getTime()
                 let lks = md5('' + 'RtKLB8euDo7KwsO0' + lkt).toString()
                 $.get({
                   url: `https://jdjoy.jd.com/common/pet/enterFriendRoom?reqSource=h5&invokeKey=RtKLB8euDo7KwsO0&friendPin=${encodeURIComponent(f.friendPin)}`,
                   headers: {
                     'lkt': lkt,
                     'lks': lks,
                     'Host': 'jdjoy.jd.com',
                     'Accept': '*/*',
                     'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html',
                     "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
                     'cookie': cookie
                   }
                 }, (err, resp, data) => {
                   let lkt = new Date().getTime()
                   let lks = md5('' + 'RtKLB8euDo7KwsO0' + lkt).toString()
                   $.get({
                     url: `https://jdjoy.jd.com/common/pet/getRandomFood?reqSource=h5&invokeKey=RtKLB8euDo7KwsO0&friendPin=${encodeURIComponent(f.friendPin)}`,
                     headers: {
                       'lkt': lkt,
                       'lks': lks,
                       'Host': 'jdjoy.jd.com',
                       'Accept': '*/*',
                       'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html',
                       "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
                       'cookie': cookie
                     }
                   }, (err, resp, data) => {
                     data = JSON.parse(data)
                     console.log('偷狗粮:', data.errorCode, data.data)
                   })
                 })
               }
               await $.wait(1500)
             }
           }
         })
       }
       resolve();
     })
   })
 }

 function requireConfig() {
   return new Promise(resolve => {
     notify = $.isNode() ? require('./sendNotify') : '';
     //Node.js用户请在jdCookie.js处填写京东ck;
     const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
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

 function writeFile(text) {
   if ($.isNode()) {
     fs.writeFile('a.json', text, () => {
     })
   }
 }
