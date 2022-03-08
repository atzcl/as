/*
[task_local]
入口 极速版 赚金币 种水果
#柠檬我是大老板农场
export dlbtz="true" //通知打开
export dlbtz="false" //通知关闭
5 0-23/6 * * * http://nm66.top/jd_wsdlb.js, tag=柠檬我是大老板农场, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true
*/


const $ = new Env('柠檬我是大老板农场');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';

//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;
let allMessage = '';
let dlbtz = false; //通知开关
if ($.isNode() && process.env.dlbtz) {
  dlbtz = process.env.dlbtz;
}
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if ($.isNode() && process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
const JD_API_HOST = 'https://api.m.jd.com/client.action';

!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }

  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      ck2 = cookiesArr[Math.round(Math.random()*5)];
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


      await jdFruit()



    }
  }
if ($.isNode() && allMessage) {
        await notify.sendNotify(`${$.name}`, `${allMessage}` )
    }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function jdFruit() {

  await info()
  await dolist()
  await apCollectWater()
if ($.info.data.firstJoinFlag === true) {
 $.log("您忘了种植新的水果，快打开极速版种植吧")
if(dlbtz == true){
 allMessage += `京东账号${$.index}-${$.nickName || $.UserName}\n您忘了种植新的水果,内侧入口为：\nhttp://a8pck.cn/VbjDm${$.index !== cookiesArr.length ? '\n\n' : '\n\n'}`;}
}else if ($.info.data.firstJoinFlag === false) {

        console.log(`\n当前种植水果：${$.info.data.plantInfo[0].cropName}\n当前阶段: ${$.info.data.plantInfo[0].nowStep}\n当前下一阶段还需要浇水：${$.info.data.plantInfo[0].upgradeWateringNum}次`)
       if($.info.data.plantInfo[0].nowStep == 4){
       allMessage += `京东账号${$.index}-${$.nickName || $.UserName}\n当前种植水果可以收取了${$.index !== cookiesArr.length ? '\n\n' : '\n\n'}`;
       }
//   await help("7057MkYN_M4C3K_QNqU2YQ")
        if(dlbtz == true){
        allMessage += `京东账号${$.index}-${$.nickName || $.UserName}\n当前种植水果：${$.info.data.plantInfo[0].cropName}\n当前阶段: ${$.info.data.plantInfo[0].nowStep}\n当前下一阶段还需要浇水：${$.info.data.plantInfo[0].upgradeWateringNum}次${$.index !== cookiesArr.length ? '\n\n' : '\n\n'}`;}
                if (getwat.code === 0 ){
        $.log(`\n领取定时水滴：${getwat.data.collectWaterNumber}`)

                }

       if($.info.data.plantInfo[0].status == 0){
         $.log(`无需除草`)
       }else
       if($.info.data.plantInfo[0].status == 1){
         $.log(`需要除草`)
         await chucao($.info.data.earthInfo[0].nowPlantId,$.info.data.encPin)
         if(cc.errMsg == "success"){
         $.log(`除草成功`)
         }else
         if(cc.success == false){
             $.log(cc.errMsg)
             //break

         }
       }


        if ($.do.code === 0){
 let taskList = $.do.data
       for (let i = 0 ; i < taskList.length; i++){
       taskType = taskList[i].taskType
       id = taskList[i].id
       taskSourceUrl = taskList[i].taskSourceUrl

        await dotask(taskType,id,taskSourceUrl)
        await dotask(taskType,id,"70511671722")

        if ($.qd.code === 2005 ){
             $.log(`\n${$.qd.errMsg}`)

     }
     }
 }

     await jiaoshui($.info.data.earthInfo[0].nowPlantId)

     if (watering.success === true ){
          $.log(parseInt(watering.data.property * 0.1))
       cs = parseInt(watering.data.property * 0.1)
     if (cs > 0 ){
    for (let i = 0 ; i < cs; i++){
        await $.wait(3000)
        await jiaoshui($.info.data.earthInfo[0].nowPlantId)
    if (watering.code === 20004 ){
        $.log(`\n浇水水滴不足，快去做任务吧`)
          //break
        }

        if (watering.code === 0 ){
        $.log(`\n${watering.data.speedFarmPlantInfo.cropName}:\n还需水滴：${watering.data.speedFarmPlantInfo.nowStepNeedWater}\n还需浇水：${watering.data.speedFarmPlantInfo.upgradeWateringNum}`)

        }

}

}
}




}



}

function info() {
    return new Promise(async (resolve) => {

                let options = {
    url: `https://api.m.jd.com/?functionId=apHomePage&client=android&clientVersion=10&networkType=4g&eid=eidAdbfb812246s5r1OGwmiSQMahMl6K44kkna9TiDxOncOh%2BPHjHGH7f5BaezwPsv86FnJD2KTOGF5GjpLohc8Y3tfQqJw%2F3GbroYtSX%2BYNIOYuwm4w&fp=-1&uuid=7303439343432346-7356431353233321&osVersion=10&d_brand=OPPO&d_model=PCAM00&referer=-1&agent=-1&pageClickKey=-1&screen=360*780&lang=zh_CN&eu=7303439343432346&fv=7356431353233323&body=%7B%22linkId%22%3A%22fzf6tK4xMfE2ICK4-T_iUw%22%2C%22antiToken%22%3A%22oyv0oh46u0hbqqbh2pe16232308899736l86~NmZeSyVEbFNSd3V%2BdlJdC3lwAApjRHpTBiUjb35DFm5vLUROOBEzLUF7G28iAAFBKBgVFA1EPwIVKDclGENXbm8iVlQiAwpTTx1lKSsTCG5vfmsaDUR6LUEnG29%2BPU9UdSYHAGlWYEJXc3F7c1VUCit8UVplX2UQUSR%2FendVWwE3JVRkc0oKUwoyKhFmWzEQOTZCXQ1Eei1BKTQ5GENXbm8wX10zDzETDDI0Yy4FQ1EiKWsafTp0AQ0dZXcYQ0Jub2hrGiESClNZHWUlMBUdQXcYFRQNRCYYP2N9EWZQVR5%2BaA4UYUpmXVJwcRFmHE8ebyFTXCIBdEtBK3AhMkNBEC43FQJzVDkVBSUvLDITBVk9dg9MPQsySVYoL3gyERlAeyxNDSgDPkIEY2tvJ0NXEDQhQUs%2FUDNFDiAmdHYZFQorIgYJZ1RlQ1Bxf3V9WFoAPj1bWXNKdBUQL2V3ZhEMVzUoAV1gRHpTCjJld2ZQTx5vLl5bc1x0SFp4fm85%7C~1623230944818~1~20201218~eyJ2aXdlIjoiMCIsImJhaW4iOnt9fQ%3D%3D~1~504~gpli%7Cdoei%3A%2C1%2C0%2C0%2C0%2C0%2C1000%2C-1000%2C1000%2C-1000%3Bdmei%3A%2C1%2C0%2C0%2C1000%2C-1000%2C1000%2C-1000%2C1000%2C-1000%3Bemc%3A%3Bemmm%3A%3Bemcf%3A%3Bivli%3A%3Biivl%3A%3Bivcvj%3A%3Bscvje%3A%3Bewhi%3A%3B1623230944718%2C1623230944817%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%3B88yh%22%2C%22frontendInitStatus%22%3A%22s%22%2C%22platform%22%3A1%7D&appid=activities_platform&t=1623230951258`,

headers: {
"Origin": "https://thebigboss.jd.com",
"Host": "api.m.jd.com",
      "User-Agent": "jdltapp;android;3.5.0;10;7303439343432346-7356431353233323;network/4g;model/PCAM00;addressid/4228801336;aid/7049442d7e415232;oaid/;osVer/29;appBuild/1587;psn/J7DoQdnbd16144pyXDtYAH6c3B9Rkr60|87;psq/7;adk/;ads/;pap/JA2020_3112531|3.5.0|ANDROID 10;osv/10;pv/16.58;jdv/;ref/com.jd.jdlite.lib.mission.allowance.AllowanceFragment;partner/oppo;apprpd/Allowance_Registered;eufv/1;Mozilla/5.0 (Linux; Android 10; PCAM00 Build/QKQ1.190918.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/045140 Mobile Safari/537.36",
      "Cookie": cookie,
      }
                }

        $.get(options, async (err, resp, data) => {
            try {

                  $.info = JSON.parse(data);


            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}



function dotask(taskType,taskId,itemId) {
    return new Promise(async (resolve) => {

                let options = {
    url: `https://api.m.jd.com/?functionId=apDoTask&client=android&clientVersion=10&networkType=4g&eid=eidAdbfb812246s5r1OGwmiSQMahMl6K44kkna9TiDxOncOh+PHjHGH7f5BaezwPsv86FnJD2KTOGF5GjpLohc8Y3tfQqJw/3GbroYtSX+YNIOYuwm4w&fp=-1&uuid=7303439343432346-7356431353233321&osVersion=10&d_brand=OPPO&d_model=PCAM00&referer=-1&agent=-1&pageClickKey=-1&screen=360*780&lang=zh_CN&eu=7303439343432346&fv=7356431353233323&body={"linkId":"fzf6tK4xMfE2ICK4-T_iUw","taskType":"${taskType}","taskId":${taskId},"channel":4,"itemId":"${itemId}","antiToken":"oyv0oh46u0hbqqbh2pe16232308899736l86~NmZeSyVEbFNSd3V+dlJdC3lwAApjRHpTBiUjb35DFm5vLUROOBEzLUF7G28iAAFBKBgVFA1EPwIVKDclGENXbm8iVlQiAwpTTx1lKSsTCG5vfmsaDUR6LUEnG29+PU9UdSYHAGlWYEJXc3F7c1VUCit8UVplX2UQUSR/endVWwE3JVRkc0oKUwoyKhFmWzEQOTZCXQ1Eei1BKTQ5GENXbm8wX10zDzETDDI0Yy4FQ1EiKWsafTp0AQ0dZXcYQ0Jub2hrGiESClNZHWUlMBUdQXcYFRQNRCYYP2N9EWZQVR5+aA4UYUpmXVJwcRFmHE8ebyFTXCIBdEtBK3AhMkNBEC43FQJzVDkVBSUvLDITBVk9dg9MPQsySVYoL3gyERlAeyxNDSgDPkIEY2tvJ0NXEDQhQUs/UDNFDiAmdHYZFQorIgYJZ1RlQ1Bxf3V9WFoAPj1bWXNKdBUQL2V3ZhEMVzUoAV1gRHpTCjJld2ZQTx5vLl5bc1x0SFp4fm85|~1623230944818~1~20201218~eyJ2aXdlIjoiMCIsImJhaW4iOnt9fQ==~1~504~gpli|doei:,1,0,0,0,0,1000,-1000,1000,-1000;dmei:,1,0,0,1000,-1000,1000,-1000,1000,-1000;emc:;emmm:;emcf:;ivli:;iivl:;ivcvj:;scvje:;ewhi:;1623230944718,1623230944817,0,0,0,0,0,0,0,0,0;88yh","frontendInitStatus":"s","platform":1}&appid=activities_platform&t=1623236252762`,

headers: {
"Origin": "https://thebigboss.jd.com",
"Host": "api.m.jd.com",
      "User-Agent": "jdltapp;android;3.5.0;10;7303439343432346-7356431353233323;network/4g;model/PCAM00;addressid/4228801336;aid/7049442d7e415232;oaid/;osVer/29;appBuild/1587;psn/J7DoQdnbd16144pyXDtYAH6c3B9Rkr60|87;psq/7;adk/;ads/;pap/JA2020_3112531|3.5.0|ANDROID 10;osv/10;pv/16.58;jdv/;ref/com.jd.jdlite.lib.mission.allowance.AllowanceFragment;partner/oppo;apprpd/Allowance_Registered;eufv/1;Mozilla/5.0 (Linux; Android 10; PCAM00 Build/QKQ1.190918.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/045140 Mobile Safari/537.36",
      "Cookie": cookie,
      }
                }

        $.get(options, async (err, resp, data) => {
            try {

                  $.qd = JSON.parse(data);


            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}


function dolist() {
    return new Promise(async (resolve) => {

                let options = {
    url: `https://api.m.jd.com/?functionId=apTaskList&client=android&clientVersion=10&networkType=4g&eid=eidAdbfb812246s5r1OGwmiSQMahMl6K44kkna9TiDxOncOh%2BPHjHGH7f5BaezwPsv86FnJD2KTOGF5GjpLohc8Y3tfQqJw%2F3GbroYtSX%2BYNIOYuwm4w&fp=-1&uuid=7303439343432346-7356431353233321&osVersion=10&d_brand=OPPO&d_model=PCAM00&referer=-1&agent=-1&pageClickKey=-1&screen=360*780&lang=zh_CN&eu=7303439343432346&fv=7356431353233323&body=%7B%22linkId%22%3A%22fzf6tK4xMfE2ICK4-T_iUw%22%2C%22antiToken%22%3A%22oyv0oh46u0hbqqbh2pe16232308899736l86~NmZeSyVEbFNSd3V%2BdlJdC3lwAApjRHpTBiUjb35DFm5vLUROOBEzLUF7G28iAAFBKBgVFA1EPwIVKDclGENXbm8iVlQiAwpTTx1lKSsTCG5vfmsaDUR6LUEnG29%2BPU9UdSYHAGlWYEJXc3F7c1VUCit8UVplX2UQUSR%2FendVWwE3JVRkc0oKUwoyKhFmWzEQOTZCXQ1Eei1BKTQ5GENXbm8wX10zDzETDDI0Yy4FQ1EiKWsafTp0AQ0dZXcYQ0Jub2hrGiESClNZHWUlMBUdQXcYFRQNRCYYP2N9EWZQVR5%2BaA4UYUpmXVJwcRFmHE8ebyFTXCIBdEtBK3AhMkNBEC43FQJzVDkVBSUvLDITBVk9dg9MPQsySVYoL3gyERlAeyxNDSgDPkIEY2tvJ0NXEDQhQUs%2FUDNFDiAmdHYZFQorIgYJZ1RlQ1Bxf3V9WFoAPj1bWXNKdBUQL2V3ZhEMVzUoAV1gRHpTCjJld2ZQTx5vLl5bc1x0SFp4fm85%7C~1623230944818~1~20201218~eyJ2aXdlIjoiMCIsImJhaW4iOnt9fQ%3D%3D~1~504~gpli%7Cdoei%3A%2C1%2C0%2C0%2C0%2C0%2C1000%2C-1000%2C1000%2C-1000%3Bdmei%3A%2C1%2C0%2C0%2C1000%2C-1000%2C1000%2C-1000%2C1000%2C-1000%3Bemc%3A%3Bemmm%3A%3Bemcf%3A%3Bivli%3A%3Biivl%3A%3Bivcvj%3A%3Bscvje%3A%3Bewhi%3A%3B1623230944718%2C1623230944817%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%3B88yh%22%2C%22frontendInitStatus%22%3A%22s%22%2C%22platform%22%3A1%7D&appid=activities_platform&t=1623236246485`,

headers: {
"Origin": "https://thebigboss.jd.com",
"Host": "api.m.jd.com",
      "User-Agent": "jdltapp;android;3.5.0;10;7303439343432346-7356431353233323;network/4g;model/PCAM00;addressid/4228801336;aid/7049442d7e415232;oaid/;osVer/29;appBuild/1587;psn/J7DoQdnbd16144pyXDtYAH6c3B9Rkr60|87;psq/7;adk/;ads/;pap/JA2020_3112531|3.5.0|ANDROID 10;osv/10;pv/16.58;jdv/;ref/com.jd.jdlite.lib.mission.allowance.AllowanceFragment;partner/oppo;apprpd/Allowance_Registered;eufv/1;Mozilla/5.0 (Linux; Android 10; PCAM00 Build/QKQ1.190918.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/045140 Mobile Safari/537.36",
      "Cookie": cookie,
      }
                }

        $.get(options, async (err, resp, data) => {
            try {

                  $.do = JSON.parse(data);


            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

function jiaoshui(plantId) {
    return new Promise(async (resolve) => {

                let options = {
    url: `https://api.m.jd.com/?functionId=watering&client=android&clientVersion=10&networkType=4g&eid=eidAdbfb812246s5r1OGwmiSQMahMl6K44kkna9TiDxOncOh+PHjHGH7f5BaezwPsv86FnJD2KTOGF5GjpLohc8Y3tfQqJw/3GbroYtSX+YNIOYuwm4w&fp=-1&uuid=7303439343432346-7356431353233321&osVersion=10&d_brand=OPPO&d_model=PCAM00&referer=-1&agent=-1&pageClickKey=-1&screen=360*780&lang=zh_CN&eu=7303439343432346&fv=7356431353233323&body={"linkId":"fzf6tK4xMfE2ICK4-T_iUw","plantId":"${plantId}","antiToken":"oyv0oh46u0hbqqbh2pe16232308899736l86~NmZeSyVEbFNSd3V+dlJdC3lwAApjRHpTBiUjb35DFm5vLUROOBEzLUF7G28iAAFBKBgVFA1EPwIVKDclGENXbm8iVlQiAwpTTx1lKSsTCG5vfmsaDUR6LUEnG29+PU9UdSYHAGlWYEJXc3F7c1VUCit8UVplX2UQUSR/endVWwE3JVRkc0oKUwoyKhFmWzEQOTZCXQ1Eei1BKTQ5GENXbm8wX10zDzETDDI0Yy4FQ1EiKWsafTp0AQ0dZXcYQ0Jub2hrGiESClNZHWUlMBUdQXcYFRQNRCYYP2N9EWZQVR5+aA4UYUpmXVJwcRFmHE8ebyFTXCIBdEtBK3AhMkNBEC43FQJzVDkVBSUvLDITBVk9dg9MPQsySVYoL3gyERlAeyxNDSgDPkIEY2tvJ0NXEDQhQUs/UDNFDiAmdHYZFQorIgYJZ1RlQ1Bxf3V9WFoAPj1bWXNKdBUQL2V3ZhEMVzUoAV1gRHpTCjJld2ZQTx5vLl5bc1x0SFp4fm85|~1623230944818~1~20201218~eyJ2aXdlIjoiMCIsImJhaW4iOnt9fQ==~1~504~gpli|doei:,1,0,0,0,0,1000,-1000,1000,-1000;dmei:,1,0,0,1000,-1000,1000,-1000,1000,-1000;emc:;emmm:;emcf:;ivli:;iivl:;ivcvj:;scvje:;ewhi:;1623230944718,1623230944817,0,0,0,0,0,0,0,0,0;88yh","frontendInitStatus":"s","platform":1}&appid=activities_platform&t=1623237544296`,

headers: {
"Origin": "https://thebigboss.jd.com",
"Host": "api.m.jd.com",
      "User-Agent": "jdltapp;android;3.5.0;10;7303439343432346-7356431353233323;network/4g;model/PCAM00;addressid/4228801336;aid/7049442d7e415232;oaid/;osVer/29;appBuild/1587;psn/J7DoQdnbd16144pyXDtYAH6c3B9Rkr60|87;psq/7;adk/;ads/;pap/JA2020_3112531|3.5.0|ANDROID 10;osv/10;pv/16.58;jdv/;ref/com.jd.jdlite.lib.mission.allowance.AllowanceFragment;partner/oppo;apprpd/Allowance_Registered;eufv/1;Mozilla/5.0 (Linux; Android 10; PCAM00 Build/QKQ1.190918.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/045140 Mobile Safari/537.36",
      "Cookie": cookie,
      }
                }

        $.get(options, async (err, resp, data) => {
            try {

                  watering = JSON.parse(data);


            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

function apCollectWater() {
    return new Promise(async (resolve) => {

                let options = {
    url: `https://api.m.jd.com/ `,
body: `functionId=apCollectWater&client=ios&clientVersion=14.3&networkType=wifi&eid=eidIc2ff812158s1ARLLPvIBQjyII7trmiE3BQESzLTXqSC9s3TX28oQv3zQuaY+15FedjhWtgYfTsUSkl9FEDNBP8LQRrRx5GwEA93H4jSPYNJ1OvNs&fp=-1&uuid=75aeceef3046d8ce11d354ff89af9517a2e4aa11&osVersion=14.3&d_brand=iPhone&d_model=iPhone9,2&referer=-1&agent=-1&pageClickKey=-1&screen=414*736&lang=zh_CN&body={"linkId":"fzf6tK4xMfE2ICK4-T_iUw","antiToken":"80yyw6qzqeyzl42ape51623285354539awsu~NmZeSyVEbFNSd3V+dlhYBHl0Dg9iRHpTBiUjb35DFm5vLUROOBEzLUF7G28iAAFBKBgVFA1EPwIVKDclGENXbm8iVlQiAwpTTx1lKSsTCG5vfmsaDUR6LUEnG29+PU8DfnIOXTJXZElScyErdFZVCn11DgEyXjVAASIjLidVXQV+Klxkc0oKUwoyKhFmWzEQOTZCXQ1Eei1BKTQ5GENXbm8wX10zDzETDDI0Yy4FQ1EiKWsafTp0AQ0dZXcYQ0Jub2hrGiESClNZHWUlMBUdQXcYFRQNRCYYP2N9EWZQVR5+aA4UYUpmXVJydBFmHE8ebyFTXCIBdEtBKyQhdUNBEC43FQJzUyMJUTAtI31SAkd+KwFaMg0zFlAsMz89Ul1CKXJNQD9RIQQFY2tvJ0NXECp1AFIzED9DBnRxIT0bCVo8K1UJZ1RlQ1t0dHhwVF4KfHYGQnNKdBUQL2V3ZgUDBjUrDl1nRHpTCjJld2ZQTx5vLl5bc1x0SFp4fm85|~1623295641032~1~20201218~eyJ2aXdlIjoiMCIsImJhaW4iOnt9fQ==~1~~9lwr|doei:,1,0,0,0,0,1000,-1000,1000,-1000;dmei:,1,0,0,1000,-1000,1000,-1000,1000,-1000;emc:;emmm:;emcf:;ivli:;iivl:;ivcvj:;scvje:;ewhi:;1623295640969,1623295641031,0,0,0,0,0,0,0,0,0;88ys","frontendInitStatus":"s","platform":1}&appid=activities_platform&t=1623295724488`,
headers: {
"Origin": "https://thebigboss.jd.com",
"Host": "api.m.jd.com",
      "User-Agent": "jdltapp;android;3.5.0;10;7303439343432346-7356431353233323;network/4g;model/PCAM00;addressid/4228801336;aid/7049442d7e415232;oaid/;osVer/29;appBuild/1587;psn/J7DoQdnbd16144pyXDtYAH6c3B9Rkr60|87;psq/7;adk/;ads/;pap/JA2020_3112531|3.5.0|ANDROID 10;osv/10;pv/16.58;jdv/;ref/com.jd.jdlite.lib.mission.allowance.AllowanceFragment;partner/oppo;apprpd/Allowance_Registered;eufv/1;Mozilla/5.0 (Linux; Android 10; PCAM00 Build/QKQ1.190918.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/045140 Mobile Safari/537.36",
      "Cookie": cookie,
      }
                }

        $.post(options, async (err, resp, data) => {
            try {

                  getwat = JSON.parse(data);


            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}


function chucao(plantId,encryptUid) {
    return new Promise(async (resolve) => {

                let options = {
    url: `https://api.m.jd.com/?functionId=weeding&client=ios&clientVersion=14.3&networkType=4g&eid=eidIc2ff812158s1ARLLPvIBQjyII7trmiE3BQESzLTXqSC9s3TX28oQv3zQuaY+15FedjhWtgYfTsUSkl9FEDNBP8LQRrRx5GwEA93H4jSPYNJ1OvNs&fp=-1&uuid=75aeceef3046d8ce11d354ff89af9517a2e4aa18&osVersion=14.3&d_brand=iPhone&d_model=iPhone9,2&referer=-1&agent=-1&pageClickKey=-1&screen=414*736&lang=zh_CN&body={"linkId":"fzf6tK4xMfE2ICK4-T_iUw","plantId":"${plantId}","encryptUid":"${encryptUid}","antiToken":"g4utdunnt5ja7wazyp81624112440743frl8~NmZeSyVEbFNSd3V5dVBfBnl0AAtoRHpTBiUjb35DFm5vLUROOBEzLUF7G28iAAFBKBgVFA1EPwIVKDclGENXbm8iVlQiAwpTTx1lKSsTCG5vfmsaDUR6LUEnG29+PU9QLyFTADIAMkdXICZ4cFhbBXV8BF4yX25HV3h0dSdYVVMucQRkc0oKUwoyKhFmWzEQOTZCXQ1Eei1BKTQ5GENXbm8wX10zDzETDDI0Yy4FQ1EiKWsafTp0AQ0dZXcYQ0Jub2hrGiESClNZHWUlMBUdQXcYFRQNRCYYP2N9EWZQVR5+aA4UYUpmXVJychFmHE8ebyFTXCIBdEtBKzAhNUNBEC43FQJzB29EBHQsdT4GWAB8cFYOZ1M0AgEkMywqGRpCOzJCDGlXIRpaY2tvJ0NXECsnWVsnU2UBFCcjeDcDAVkpPUQJZ1RiQFJzc3l0VlkBIikEAHNKdBUQL2V3ZhlaAjU0RV0nRHpTCjJld2ZQTx5vLl5bc1x0SFp4fm85|~1624112440842~1~20201218~eyJ2aXdlIjoiMCIsImJhaW4iOnt9fQ==~1~~xlwr|doei:,1,0,0,0,0,1000,-1000,1000,-1000;dmei:,1,0,0,1000,-1000,1000,-1000,1000,-1000;emc:;emmm:;emcf:;ivli:;iivl:;ivcvj:;scvje:;ewhi:;1624112440733,1624112440839,0,0,0,0,0,0,0,0,0;88yu","frontendInitStatus":"s","platform":1}&appid=activities_platform&t=1624112445417 `,

headers: {
"Origin": "https://thebigboss.jd.com",
"Host": "api.m.jd.com",
      "User-Agent": "jdltapp;android;3.5.0;10;7303439343432346-7356431353233323;network/4g;model/PCAM00;addressid/4228801336;aid/7049442d7e415232;oaid/;osVer/29;appBuild/1587;psn/J7DoQdnbd16144pyXDtYAH6c3B9Rkr60|87;psq/7;adk/;ads/;pap/JA2020_3112531|3.5.0|ANDROID 10;osv/10;pv/16.58;jdv/;ref/com.jd.jdlite.lib.mission.allowance.AllowanceFragment;partner/oppo;apprpd/Allowance_Registered;eufv/1;Mozilla/5.0 (Linux; Android 10; PCAM00 Build/QKQ1.190918.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/045140 Mobile Safari/537.36",
      "Cookie": ck2,
      }
                }

        $.get(options, async (err, resp, data) => {
            try {

                  cc = JSON.parse(data);


            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

















// function help(userpin) {
//     return new Promise(async (resolve) => {

//                 let options = {
//     url: `https://thebigboss.jd.com/?id=fzf6tK4xMfE2ICK4-T_iUw&enter=share&userpin=${userpin}&task=92&ad_od=share&utm_source=androidapp&utm_medium=appshare&utm_campaign=t_335139774&utm_term=Wxfriends`,

// headers: {
// "Origin": "https://thebigboss.jd.com",
// "Host": "thebigboss.jd.com",
//       "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.5(0x18000528) NetType/WIFI Language/zh_CN",
//       "Cookie": cookie,
//       }
//                 }

//         $.get(options, async (err, resp, data) => {
//             try {

//                   //$.helpinfo = JSON.parse(data);


//             } catch (e) {
//                 $.logErr(e, resp);
//             } finally {
//                 resolve();
//             }
//         });
//     });
// }



async function taskPostUrl(functionId,body) {
  return {
    url: `${JD_API_HOST}`,
    body: `functionId=${functionId}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0&appid=content_ecology&uuid=6898c30638c55142969304c8e2167997fa59eb54&t=1622588448365`,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Accept-Language': 'zh-cn',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  }
}


async function TotalBean() {
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
            if (data["retcode"] === 13) {
              $.isLogin = false; //cookie过期
              return;
            }
            if (data["retcode"] === 0) {
              $.nickName = (data["base"] && data["base"].nickname) || $.UserName;
            } else {
              $.nickName = $.UserName;
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
async function safeGet(data) {
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
