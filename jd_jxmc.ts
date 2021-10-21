/**
 * 京喜牧场
 * 买、喂、收蛋、锄草、挑逗
 */

 import axios from 'axios';
 import {requireConfig, getBeanShareCode, getFarmShareCode, wait, requestAlgo, h5st} from './TS_USER_AGENTS';
 import {Md5} from "ts-md5";

 const jxmcToken = require('./utils/jd_jxmc.js').getToken;

 let A: any = require('./utils/jd_jxmcToken')
 let cookie: string = '', res: any = '', shareCodes: string[] = [], homePageInfo: any, activeid: string = '', jxToken: any, UserName: string, index: number;
 let shareCodesHbInterval: string[] = [
   'g_eiitD1h9-a-PX-GytKiGrfw77E3iG0LpMlIb2JHcY-wA6tEddBOcJwL_X2RBqX-DYyjeJlzcPTvXGeVLQoOw'
 ], shareCodesHb: string[] = [];

 !(async () => {
   await requestAlgo();
   let cookiesArr: any = await requireConfig();

   for (let i = 0; i < cookiesArr.length; i++) {
     cookie = cookiesArr[i];
     UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
     index = i + 1;
     console.log(`\n开始【京东账号${index}】${UserName}\n`);

     jxToken = await jxmcToken(cookie);
     homePageInfo = await api('queryservice/GetHomePageInfo', 'activeid,activekey,channel,isgift,isquerypicksite,sceneid', {
       isgift: 0,
       isquerypicksite: 0
     })
     activeid = homePageInfo.data.activeid
     let lastgettime: number
     if (homePageInfo.data?.cow?.lastgettime) {
       lastgettime = homePageInfo.data.cow.lastgettime
     } else {
       continue
     }

     let food: number = 0
     try {
       food = homePageInfo.data.materialinfo[0].value;
     } catch (e) {
       console.log('未开通？黑号？')
       continue
     }
     let petid: number = homePageInfo.data.petinfo[0].petid;
     let coins = homePageInfo.data.coins;

     console.log('助力码:', homePageInfo.data.sharekey);
     shareCodes.push(homePageInfo.data.sharekey);

     console.log('现有草:', food);
     console.log('金币:', coins);

     // 红包
     res = await api('operservice/GetInviteStatus', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,timestamp')
     console.log('红包助力:', res.data.sharekey)
     shareCodesHbInterval.push(res.data.sharekey)

     // 收牛牛
     res = await api('operservice/GetCoin', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,timestamp,token', {token: A(lastgettime)})
     if (res.ret === 0)
       console.log('收牛牛:', res.data.addcoin)
     await wait(1000)

     // 签到
     res = await api('queryservice/GetSignInfo', 'activeid,activekey,channel,sceneid')
     if (res.data.signlist) {
       for (let day of res.data.signlist) {
         if (day.fortoday && !day.hasdone) {
           res = await api('operservice/GetSignReward', 'channel,currdate,sceneid', {currdate: res.data.currdate})
           if (res.ret === 0) {
             console.log('签到成功!')
           } else {
             console.log(res)
           }
           break
         }
       }
     } else {
       console.log('没有获取到签到信息！')
     }

     // 登录领白菜
     res = await api('queryservice/GetVisitBackInfo', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,timestamp')
     if (res.iscandraw === 1) {
       res = await api('operservice/GetVisitBackCabbage', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,timestamp')
       if (res.ret === 0) {
         console.log('登录领白菜：', res.data.drawnum)
       }
     }

     console.log('任务列表开始')
     for (let j = 0; j < 30; j++) {
       if (await getTask() === 0) {
         break
       }
       await wait(3000)
     }
     console.log('任务列表结束')

     while (coins >= 5000 && food <= 500) {
       res = await api('operservice/Buy', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,timestamp,type', {type: '1'})
       if (res.ret === 0) {
         console.log('买草成功:', res.data.newnum)
         coins -= 5000
         food += 100
       } else {
         console.log(res)
         break
       }
       await wait(5000)
     }
     await wait(5000)

     while (food >= 10) {
       try {
         res = await api('operservice/Feed', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,timestamp')
         if (res.ret === 0) {
           food -= 10
           console.log('剩余草:', res.data.newnum)
         } else if (res.ret === 2020) {
           if (res.data.maintaskId === 'pause' || res.data.maintaskId === 'E-1') {
             console.log('收🥚')
             res = await api('operservice/GetSelfResult', 'channel,itemid,sceneid,type', {petid: petid, type: '11'})
             if (res.ret === 0) {
               console.log('收🥚成功:', res.data.newnum)
             } else {
               console.log('收🥚失败:', res)
             }
           }
         } else if (res.ret === 2005) {
           console.log('今天吃撑了')
           break
         } else {
           console.log('Feed未知错误:', res)
           break
         }
         await wait(6000)
       } catch (e) {
         break
       }
     }
     await wait(4000)

     while (1) {
       try {
         res = await api('operservice/Action', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,timestamp,type', {type: '2'})
         if (res.data.addcoins === 0 || JSON.stringify(res.data) === '{}') break
         console.log('锄草:', res.data.addcoins)
         await wait(5000)
         if (res.data.surprise) {
           res = await api("operservice/GetSelfResult", "activeid,activekey,channel,sceneid,type", {type: '14'})
           console.log('锄草奖励:', res.data.prizepool)
           await wait(5000)
         }
       } catch (e) {
         console.log('Error:', e)
         break
       }
     }
     await wait(5000)

     while (1) {
       try {
         res = await api('operservice/Action', 'activeid,activekey,channel,petid,sceneid,type', {
           type: '1',
           petid: petid
         })
         if (res.data.addcoins === 0 || JSON.stringify(res.data) === '{}') break
         console.log('挑逗:', res.data.addcoins)
         await wait(5000)
       } catch (e) {
         console.log('Error:', e)
         break
       }
     }
   }



   for (let i = 0; i < cookiesArr.length; i++) {
     cookie = cookiesArr[i]
     jxToken = await jxmcToken(cookie);
     for (let j = 0; j < shareCodesHb.length; j++) {
       if (i !== j) {
         console.log(`账号${i + 1}去助力${shareCodesHb[j]}`)
         res = await api('operservice/InviteEnroll', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,sharekey,timestamp', {sharekey: shareCodesHb[j]})
         if (res.ret === 0) {
           console.log(res)
           console.log('助力成功:', JSON.stringify(res))
         } else {
           console.log('助力失败：', JSON.stringify(res))
         }
         await wait(1000)
       }
     }
   }

   for (let i = 0; i < cookiesArr.length; i++) {
     cookie = cookiesArr[i]
     jxToken = await jxmcToken(cookie);
     for (let j = 0; j < shareCodes.length; j++) {
       if (i !== j) {
         console.log(`账号${i + 1}去助力${shareCodes[j]}`)
         res = await api('operservice/EnrollFriend', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,sharekey,timestamp', {sharekey: shareCodes[j]})
         if (res.ret === 0) {
           console.log(res)
           console.log('助力成功，获得:', res.data.addcoins)
         } else {
           console.log('助力失败：', res)
         }
         await wait(5000)
       }
     }
   }
 })()

 interface Params {
   isgift?: number,
   isquerypicksite?: number,
   petid?: number,
   type?: string,
   taskId?: number
   configExtra?: string,
   sharekey?: string,
   currdate?: string,
   token?: string
 }

 async function getTask() {
   console.log('刷新任务列表')
   let tasks: any = await api('GetUserTaskStatusList', 'bizCode,dateType,source')
   for (let t of tasks.data.userTaskStatusList) {
     if (t.completedTimes == t.targetTimes && t.awardStatus === 2) {
       res = await api('Award', 'bizCode,source,taskId', {taskId: t.taskId})
       if (res.ret === 0) {
         let awardCoin = res.data.prizeInfo.match(/:(.*)}/)![1] * 1
         console.log('领奖成功:', awardCoin)
         await wait(4000)
         return 1
       } else {
         console.log('领奖失败:', res)
         return 0
       }
     }

     if (t.dateType === 2 && t.completedTimes < t.targetTimes && t.awardStatus === 2 && t.taskType === 2) {
       res = await api('DoTask', 'bizCode,configExtra,source,taskId', {taskId: t.taskId, configExtra: ''})
       if (res.ret === 0) {
         console.log('任务完成');
         await wait(5000);
         return 1
       } else {
         console.log('任务失败:', res)
         return 0
       }
     }
   }
   return 0
 }

 async function api(fn: string, stk: string, params: Params = {}) {
   let url: string = ''
   if (['GetUserTaskStatusList', 'DoTask', 'Award'].indexOf(fn) > -1)
     url = `https://m.jingxi.com/newtasksys/newtasksys_front/${fn}?_=${Date.now()}&source=jxmc&bizCode=jxmc&_ste=1&sceneval=2&_stk=${encodeURIComponent(stk)}`
   else
     url = `https://m.jingxi.com/jxmc/${fn}?channel=7&sceneid=1001&activeid=${activeid}&activekey=null&jxmc_jstoken=${jxToken.farm_jstoken}&timestamp=${jxToken.timestamp}&phoneid=${jxToken.phoneid}&_stk=${encodeURIComponent(stk)}&_ste=1&_=${Date.now()}&sceneval=2&g_login_type=1&callback=jsonpCBK${randomWord()}&g_ty=ls`
   url = h5st(url, stk, params, 10028)
   try {
     let {data} = await axios.get(url, {
       headers: {
         'Cookie': cookie,
         'Host': 'm.jingxi.com',
         'User-Agent': 'jdpingou;',
         'Referer': 'https://st.jingxi.com/',
       }
     })
     if (typeof data === 'string')
       return JSON.parse(data.replace(/jsonpCBK.?\(/, '').split('\n')[0])
     return data
   } catch (e) {
     return {}
   }
 }

 function randomWord() {
   return String.fromCharCode(Math.floor(Math.random() * 26) + "A".charCodeAt(0))
 }
