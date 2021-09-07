/*
脚本默认会帮我助力开工位，介意请添加变量HELP_JOYPARK，false为不助力
export HELP_JOYPARK=""
更新地址：https://github.com/Tsukasa007/my_script
============Quantumultx===============
[task_local]
#汪汪乐园每日任务
20 7,9,17,20 * * * jd_joypark_task.js, tag=汪汪乐园每日任务, img-url=https://raw.githubusercontent.com/tsukasa007/icon/master/jd_joypark_task.png, enabled=true
================Loon==============
[Script]
cron "20 7,9,17,20 * * *" script-path=jd_joypark_task.js,tag=汪汪乐园每日任务
===============Surge=================
汪汪乐园每日任务 = type=cron,cronexp="20 7,9,17,20 * * *",wake-system=1,timeout=3600,script-path=jd_joypark_task.js
============小火箭=========
汪汪乐园每日任务 = type=cron,script-path=jd_joypark_task.js, cronexpr="20 7,9,17,20 * * *", timeout=3600, enable=true
*/
const $ = new Env('汪汪乐园每日任务');
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '';

if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
$.invitePinTaskList = []
$.invitePin = [
  '1KD_2dZtY-8Iuvcz9v3X6SqgnjFnfPjWY1NrFAgYQHc',
  'va9w0OtllPXeZl2LAnFAgogZTBg9HmGJ6pzfW89r1D4'
]
const JD_API_HOST = `https://api.m.jd.com/client.action`;
message = ""
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
      "open-url": "https://bean.m.jd.com/"
    });
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    if (cookie) {
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      $.openIndex = 0
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if ($.isNode()) {
        if (process.env.HELP_JOYPARK && process.env.HELP_JOYPARK == "false") {
        } else {
          for (let j = 0; j < $.invitePin.length; j++) {
            let resp = await getJoyBaseInfo(undefined, 2, $.invitePin[j]);
            if (resp.data && resp.data.helpState && resp.data.helpState === 1) {
              $.log("帮【zero205】开工位成功，感谢！\n");
            } else if (resp.data && resp.data.helpState && resp.data.helpState === 3) {
              $.log("你不是新用户！跳过开工位助力\n");
              break
            } else if (resp.data && resp.data.helpState && resp.data.helpState === 2) {
              $.log(`他的工位已全部开完啦！\n`);
              $.openIndex++
            } else {
              $.log("开工位失败！\n");
            }
          }
        }
      }
      await getJoyBaseInfo()
      if ($.joyBaseInfo && $.joyBaseInfo.invitePin) {
        $.log(`${$.name} - ${$.UserName}  助力码: ${$.joyBaseInfo.invitePin}`);
        $.invitePinTaskList.push($.joyBaseInfo.invitePin);
      } else {
        $.log(`${$.name} - ${$.UserName}  助力码: null`);
        $.invitePinTaskList.push('');
        $.isLogin = false
        $.log("服务端异常，不知道为啥有时候这样，后面再观察一下，手动执行应该又没问题了")
        continue
      }
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
          "open-url": "https://bean.m.jd.com/bean/signIndex.action"
        });
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await getTaskList();

      // 签到 / 逛会场 / 浏览商品
      for (const task of $.taskList) {
        if (task.taskType === 'SIGN') {
          $.log(`${task.taskTitle} 签到`)
          await apDoTask(task.id, task.taskType, undefined);

          $.log(`${task.taskTitle} 领取签到奖励`)
          await apTaskDrawAward(task.id, task.taskType);

        }
        if (task.taskType === 'BROWSE_PRODUCT' || task.taskType === 'BROWSE_CHANNEL') {
          let productList = await apTaskDetail(task.id, task.taskType);

          let productListNow = 0;
          if (productList.length === 0) {
            let resp = await apTaskDrawAward(task.id, task.taskType);

            if (!resp.success) {
              $.log(`${task.taskTitle} 领取完成!`)
              productList = await apTaskDetail(task.id, task.taskType);

            }
          }
          //做
          while (task.taskLimitTimes - task.taskDoTimes >= 0) {

            if (productList.length === 0) {
              $.log(`${task.taskTitle} 活动火爆，素材库没有素材，我也不知道啥回事 = = `);
              break;
            }
            $.log(`${task.taskTitle} ${task.taskDoTimes}/${task.taskLimitTimes}`);
            let resp = await apDoTask(task.id, task.taskType, productList[productListNow].itemId, productList[productListNow].appid);

            if (resp.code === 2005 || resp.code === 0) {
              $.log(`${task.taskTitle} 任务完成！`)
            } else {
              $.log(`${resp.echo} 任务失败！`)
            }
            productListNow++;
            task.taskDoTimes++;
            if (!productList[productListNow]) {
              break
            }
          }
          //领
          for (let j = 0; j < task.taskLimitTimes; j++) {
            let resp = await apTaskDrawAward(task.id, task.taskType);

            if (!resp.success) {
              $.log(`${task.taskTitle} 领取完成!`)
              break
            }
          }
        } else if (task.taskType === 'SHARE_INVITE') {
          for (let j = 0; j < 5; j++) {
            let resp = await apTaskDrawAward(167, 'SHARE_INVITE');

            if (!resp.success) {
              break
            }
            $.log("领取助力奖励成功！")
          }
        }
      }
    }
  }

  $.log("\n======汪汪乐园开始内部互助======\n======有剩余助力次数则帮zero205助力======\n")
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    if (cookie) {
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
          "open-url": "https://bean.m.jd.com/bean/signIndex.action"
        });
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      $.newinvitePinTaskList = [...($.invitePinTaskList || []), ...($.invitePin || [])]
      for (const invitePinTaskListKey of $.newinvitePinTaskList) {
        $.log(`【京东账号${$.index}】${$.nickName || $.UserName} 助力 ${invitePinTaskListKey}`)
        let resp = await getJoyBaseInfo(167, 1, invitePinTaskListKey);
        if (resp.success) {
          if (resp.data.helpState === 1) {
            $.log("助力成功！");
          } else if (resp.data.helpState === 0) {
            $.log("自己不能助力自己！");
          } else if (resp.data.helpState === 2) {
            $.log("助力过了！");
          } else if (resp.data.helpState === 3) {
            $.log("没有助力次数了！");
            break
          } else if (resp.data.helpState === 4) {
            $.log("这个B助力满了！");
          }
        } else {
          $.log("数据异常 助力失败！\n\n")
          break
        }
      }
    }
  }
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())
//获取活动信息

//任务列表
function getTaskList() {
  //await $.wait(20)
  return new Promise(resolve => {
    $.post(taskPostClientActionUrl(`body=%7B%22linkId%22%3A%22LsQNxL7iWDlXUs6cFl-AAg%22%7D&appid=activities_platform`, `apTaskList`), async (err, resp, data) => {
      $.log('=== 任务列表 start ===')
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          $.taskList = data.data
          for (const row of $.taskList) {
            $.log(`${row.taskTitle} ${row.taskDoTimes}/${row.taskLimitTimes}`)
          }
          $.log('=== 任务列表 end  ===')
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

/**
 * 互助
 * @param taskId
 * @param inviteType
 * @param inviterPin
 * @returns {Promise<unknown>}
 */
function getJoyBaseInfo(taskId = '', inviteType = '', inviterPin = '') {
  //await $.wait(20)
  return new Promise(resolve => {
    $.post(taskPostClientActionUrl(`body={"taskId":"${taskId}","inviteType":"${inviteType}","inviterPin":"${inviterPin}","linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&_t=1625480372020&appid=activities_platform`, `joyBaseInfo`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          $.joyBaseInfo = data.data
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        $.log(`resolve start`)
        resolve(data);
        $.log(`resolve end`)
      }
    })
  })
}

function apDoTask(taskId, taskType, itemId = '', appid = 'activities_platform') {
  //await $.wait(20)
  return new Promise(resolve => {
    $.post(taskPostClientActionUrl(`body={"taskType":"${taskType}","taskId":${taskId},"channel":4,"linkId":"LsQNxL7iWDlXUs6cFl-AAg","itemId":"${itemId}"}&appid=${appid}`, `apDoTask`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function apTaskDetail(taskId, taskType) {
  //await $.wait(20)
  return new Promise(resolve => {
    $.post(taskPostClientActionUrl(`functionId=apTaskDetail&body={"taskType":"${taskType}","taskId":${taskId},"itemId":"https://pro.m.jd.com/jdlite/active/oTtXBgN2Toq1KfdLXUKKivNKVgA/index.html","linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&appid=activities_platform`, `apTaskDetail`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (!data.success) {
            $.taskDetailList = []
          } else {
            $.taskDetailList = data.data.taskItemList;
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        if (!data.success) {
          resolve([]);
        } else {
          resolve(data.data.taskItemList);
        }
      }
    })
  })
}

function apTaskDrawAward(taskId, taskType) {
  //await $.wait(20)
  return new Promise(resolve => {
    $.post(taskPostClientActionUrl(`body={"taskType":"${taskType}","taskId":${taskId},"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&appid=activities_platform`, `apTaskDrawAward`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          $.log("领取奖励")
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function taskPostClientActionUrl(body, functionId) {
  return {
    url: `https://api.m.jd.com/client.action?${functionId ? `functionId=${functionId}` : ``}`,
    body: body,
    headers: {
      'User-Agent': 'jdltapp;iPhone;3.5.6;14.6;eac3e15e91fd380664fc7c788e8ab6a07805646d;network/4g;ADID/8F6CAEEA-5BF7-4F7E-86C3-A641C19CA832;hasUPPay/0;pushNoticeIsOpen/0;lang/zh_CN;model/iPhone13,2;addressid/1995295948;hasOCPay/0;appBuild/1070;supportBestPay/0;pv/41.26;apprpd/;ref/JDLTSubMainPageViewController;psq/2;ads/;psn/eac3e15e91fd380664fc7c788e8ab6a07805646d|112;jdv/0|kong|t_500509960_|jingfen|bb9c79e4c4174521873879a27a707da4|1625071927291|1625071930;adk/;app_device/IOS;pap/JA2020_3112531|3.5.6|IOS 14.6;Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Host': 'api.m.jd.com',
      'Origin': 'https://joypark.jd.com',
      'Referer': 'https://joypark.jd.com/?activityId=LsQNxL7iWDlXUs6cFl-AAg&lng=113.387899&lat=22.512678&sid=4d76080a9da10fbb31f5cd43396ed6cw&un_area=19_1657_52093_0',
      'Cookie': cookie,
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
