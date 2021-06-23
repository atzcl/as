/**
 脚本兼容: Docker, Node.js
 更新时间：2021-06-22
 活动入口：京东APP我的-宠汪汪
 完成度 1.01%


 默认500
 export JD_JOY_REWARD_NAME = 500
 */

 const $ = new Env("宠汪汪兑换二代目")
 console.log('\n====================Hello World====================\n')

 const https = require('https');
 const http = require('http');
 const stream = require('stream');
 const zlib = require('zlib');
 const vm = require('vm');
 const PNG = require('png-js');
 const UA = require('./USER_AGENTS.js').USER_AGENT;


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

   runWithCanvas() {
     const {createCanvas, Image} = require('canvas');
     const canvas = createCanvas();
     const ctx = canvas.getContext('2d');
     const imgBg = new Image();
     const imgPatch = new Image();
     const prefix = 'data:image/png;base64,';

     imgBg.src = prefix + this.rawBg;
     imgPatch.src = prefix + this.rawPatch;
     const {naturalWidth: w, naturalHeight: h} = imgBg;
     canvas.width = w;
     canvas.height = h;
     ctx.clearRect(0, 0, w, h);
     ctx.drawImage(imgBg, 0, 0, w, h);

     const width = w;
     const {naturalWidth, naturalHeight} = imgPatch;
     const posY = this.y + PUZZLE_PAD + ((naturalHeight - PUZZLE_PAD) / 2) - (PUZZLE_GAP / 2);
     // const cData = ctx.getImageData(0, a.y + 10 + 20 - 4, 360, 8).data;
     const cData = ctx.getImageData(0, posY, width, PUZZLE_GAP).data;
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
     const margin = naturalWidth - PUZZLE_PAD;
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
 const SERVER = 'iv.jd.com';

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

     console.log('successful: %f\%', (count / n) * 100);
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

             // console.log(ctx.data);
             res.resume();
             resolve(ctx.data);
           } catch (e) {
             reject(e);
           }
         });
       });

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

 const HZ = 60;

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

         if (!flag) {
           console.log('1')
           while (1) {
             let h = new Date().getHours();
             let s = new Date().getSeconds();
             if (s >= 50 || s <= 30) {
               console.log('start......')
               break;
             }
             await $.wait(100);
           }
           flag = false
           fn(opts, cb)
         }
         if (flag) {
           console.log('2')
           flag = false
           fn(opts, cb);
         }
       } else {
         if (flag) {
           console.log('3')
           flag = false
           cb(err, resp, data);
         } else {
           console.log('4')
           while (1) {
             let h = new Date().getHours();
             let s = new Date().getSeconds();
             if (s >= 50 || s <= 30) {
               console.log('start......')
               break;
             }
             await $.wait(100);
           }
           cb(err, resp, data);
         }
       }
     });
   };
 }

 let cookiesArr = [], cookie = '', notify;
 $.get = injectToRequest($.get.bind($))
 $.post = injectToRequest($.post.bind($))

 // 目标值
 let target = process.env.JD_JOY_REWARD_NAME ? parseInt(process.env.JD_JOY_REWARD_NAME) : 500;
 let flag = true;

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
       message = '';
       subTitle = '';

       let tasks = await init();


       let h = new Date().getHours();
       let config = ''
       if (h >= 0 && h < 8)
         config = tasks.data['beanConfigs0']
       if (h >= 8 && h < 16)
         config = tasks.data['beanConfigs8']
       if (h >= 16 && h < 24)
         config = tasks.data['beanConfigs16']
       for (let bean of config) {
         console.log(bean.id, bean.giftName, bean.leftStock)
         if (bean.giftValue === target) {
           await exchange(bean.id)

           // if (bean.leftStock) {
           //   await exchange(bean.id)
           // } else {
           //   console.log(`${bean.giftName}无货`)
           // }
         }
       }
     }
   }
 })()


 function init() {
   return new Promise(resolve => {
     $.get({
       url: `https://jdjoy.jd.com/common/gift/getBeanConfigs?reqSource=h5&invokeKey=NRp8OPxZMFXmGkaE`,
       headers: {
         'Host': 'jdjoy.jd.com',
         'accept': '*/*',
         'content-type': 'application/json',
         'origin': 'https://h5.m.jd.com',
         "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
         'referer': 'https://jdjoy.jd.com/',
         'accept-language': 'zh-cn',
         'cookie': cookie
       }
     }, (err, resp, data) => {
       try {
         // writeFile(data)
         data = $.toObj(data)
         resolve(data);
       } catch (e) {
         $.logErr(e);
       } finally {
         resolve();
       }
     })
   })
 }

 function exchange(beanId) {
   console.log('exchange()')
   return new Promise(resolve => {
     $.post({
       url: `https://jdjoy.jd.com/common/gift/new/exchange?reqSource=h5&invokeKey=NRp8OPxZMFXmGkaE`,
       headers: {
         "Host": "jdjoy.jd.com",
         "Accept-Language": "zh-cn",
         "Content-Type": "application/json",
         "Origin": "https://jdjoy.jd.com",
         "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
         "Referer": "https://jdjoy.jd.com/pet/index",
         "Cookie": cookie
       },
       body: JSON.stringify({"buyParam": {"orderSource": 'pet', "saleInfoId": beanId}, "deviceInfo": {}})
     }, (err, resp, data) => {
       try {
         // writeFile(data)
         data = $.toObj(data)
         console.log(data)
         resolve(data);
       } catch (e) {
         $.logErr(e);
       } finally {
         resolve();
       }
     })
   })
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

 function writeFile(text) {
   if ($.isNode()) {
     const fs = require('fs');
     fs.writeFile('a.json', text, () => {
     })
   }
 }

