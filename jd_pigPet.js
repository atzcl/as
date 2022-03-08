/*
活动入口：京东金融养猪猪
===============Quantumultx===============
[task_local]
#京东金融养猪猪
12 0-23/6 * * * jd_pigPet.js, tag=京东金融养猪猪, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jdyz.png, enabled=true
================Loon==============
[Script]
cron "12 0-23/6 * * *" script-path=jd_pigPet.js, tag=京东金融养猪猪
===============Surge=================
京东金融养猪猪 = type=cron,cronexp="12 0-23/6 * * *",wake-system=1,timeout=3600,script-path=jd_pigPet.js
============小火箭=========
京东金融养猪猪 = type=cron,script-path=jd_pigPet.js, cronexpr="12 0-23/6 * * *", timeout=3600, enable=true
 */

const $ = new Env('金融养猪');
const url = require('url');
let cookiesArr = [], cookie = '', allMessage = '';
const JD_API_HOST = 'https://ms.jr.jd.com/gw/generic/uc/h5/m';
const MISSION_BASE_API = `https://ms.jr.jd.com/gw/generic/mission/h5/m`;
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let shareId = ""
$.shareCodes = ['SicHh8dNV4Jc2uUYClHg7MAdoUJQ3Dik'];
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
  };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

!(async () => {
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      console.log(`\n开始【京东账号${$.index}】${$.UserName}\n`);
      await jdPigPet();
    }
  }
  let res2 = []
  $.shareCodes = [...new Set([...$.shareCodes, ...(res2 || [])])]
  console.log($.shareCodes)
  console.log(`\n======开始大转盘助力======\n`);
  for (let j = 0; j < cookiesArr.length; j++) {
    cookie = cookiesArr[j];
    if ($.shareCodes && $.shareCodes.length) {
      console.log(`\n自己账号内部循环互助\n`);
      for (let item of $.shareCodes) {
        await pigPetLotteryHelpFriend(item)
        await $.wait(1000)
      }
    }
  }
  if (allMessage && new Date().getHours() % 6 === 0) {
    if ($.isNode()) await notify.sendNotify($.name, allMessage);
    $.msg($.name, '', allMessage);
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function jdPigPet() {
  try {
    $.notAddFood = false;
    await pigPetLogin();
    if (!$.hasPig) return
    await pigPetSignIndex();
    await pigPetSign();
    await pigPetOpenBox();
    await pigPetLotteryIndex();
    await pigPetLottery();
    if (process.env.JD_PIGPET_PK && process.env.JD_PIGPET_PK === 'true') {
      await pigPetRank();
    }
    await pigPetMissionList();
    await missions();
    if ($.notAddFood) {
      console.log(`\n猪猪已成熟，跳过喂食`)
    } else {
      await pigPetUserBag();
    }
  } catch (e) {
    $.logErr(e)
  }
}

async function pigPetLottery() {
  if ($.currentCount > 0) {
    for (let i = 0; i < $.currentCount; i++) {
      await pigPetLotteryPlay();
      await $.wait(5000);
    }
  }
}

async function pigPetSign() {
  if (!$.sign) {
    await pigPetSignOne();
  } else {
    console.log(`第${$.no}天已签到\n`)
  }
}

function pigPetSignOne() {
  return new Promise(async resolve => {
    const body = {
      "source": 2,
      "channelLV": "juheye",
      "riskDeviceParam": "{}",
      "no": $.no
    }
    $.post(taskUrl('pigPetSignOne', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            console.log('签到结果', data)
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

//查询背包食物
function pigPetUserBag() {
  return new Promise(async resolve => {
    const body = {"source": 2, "channelLV": "yqs", "riskDeviceParam": "{}", "t": Date.now(), "skuId": "1001003004", "category": "1001"};
    $.post(taskUrl('pigPetUserBag', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                if (data.resultData.resultData && data.resultData.resultData.goods) {
                  console.log(`\n食物名称     数量`);
                  for (let item of data.resultData.resultData.goods) {
                    console.log(`${item.goodsName}      ${item.count}g`);
                  }
                  for (let item of data.resultData.resultData.goods) {
                    if (item.count >= 20) {
                      let num = 50;
                      $.finish = false;
                      $.remain = item.count
                      do {
                        console.log(`10秒后开始喂食${item.goodsName}，当前数量为${$.remain}g`)
                        await $.wait(10000);
                        await pigPetAddFood(item.sku);
                        $.remain = $.remain - 20
                        num--
                      } while (num > 0 && !$.finish && $.remain >= 20)
                    }
                  }
                } else {
                  console.log(`暂无食物`)
                }
              } else {
                console.log(`开宝箱其他情况：${JSON.stringify(data)}`)
              }
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

//喂食
function pigPetAddFood(skuId) {
  return new Promise(async resolve => {
    const body = {
      "source": 2,
      "channelLV": "yqs",
      "riskDeviceParam": "{}",
      "skuId": skuId.toString(),
      "category": "1001",
    }
    $.post(taskUrl('pigPetAddFood', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            console.log(`喂食结果：${data.resultData.resultMsg}`)
            if (data.resultData.resultData && data.resultData.resultCode == 0) {
              item = data.resultData.resultData.cote.pig
              if (item.curLevel = 3 && item.currCount >= item.currLevelCount) {
                console.log(`\n猪猪已经成年了，请及时前往京东金融APP领取奖励\n`)
                $.finish = true
              }
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

function pigPetLogin() {
  return new Promise(async resolve => {
    const body = {
      "shareId": shareId,
      "source": 2,
      "channelLV": "juheye",
      "riskDeviceParam": "{}",
    }
    $.post(taskUrl('pigPetLogin', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                $.hasPig = data.resultData.resultData.hasPig;
                if (!$.hasPig) {
                  console.log(`\n京东账号${$.index} ${$.nickName} 未开启养猪活动,请手动去京东金融APP开启此活动\n`)
                  return
                }
                if (data.resultData.resultData.wished) {
                  if (data.resultData.resultData.wishAward) {
                    allMessage += `京东账号${$.index} ${$.nickName || $.UserName}\n${data.resultData.resultData.wishAward.name}已可兑换${$.index !== cookiesArr.length ? '\n\n' : ''}`
                    console.log(`【京东账号${$.index}】${$.nickName || $.UserName} ${data.resultData.resultData.wishAward.name}已可兑换，请及时去京东金融APP领取`)
                    $.notAddFood = true;
                  }
                }
                console.log(`\n【京东账号${$.index}】${$.nickName || $.UserName} 的邀请码为${data.resultData.resultData.user.shareId}\n`)
              } else {
                console.log(`Login其他情况：${JSON.stringify(data)}`)
              }
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

//开宝箱
function pigPetOpenBox() {
  return new Promise(async resolve => {
    const body = {"source": 2, "channelLV": "yqs", "riskDeviceParam": "{}", "no": 5, "category": "1001", "t": Date.now()}
    $.post(taskUrl('pigPetOpenBox', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                if (data.resultData.resultData && data.resultData.resultData.award) {
                  console.log(`开宝箱获得${data.resultData.resultData.award.content}，数量：${data.resultData.resultData.award.count}\n`);
                } else {
                  console.log(`开宝箱暂无奖励\n`)
                }
                await $.wait(2000);
                await pigPetOpenBox();
              } else if (data.resultData.resultCode === 420) {
                console.log(`开宝箱失败:${data.resultData.resultMsg}\n`)
              } else {
                console.log(`开宝箱其他情况：${JSON.stringify(data)}\n`)
              }
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

//查询大转盘的次数
function pigPetLotteryIndex() {
  $.currentCount = 0;
  return new Promise(async resolve => {
    const body = {
      "source": 2,
      "channelLV": "juheye",
      "riskDeviceParam": "{}"
    }
    $.post(taskUrl('pigPetLotteryIndex', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // console.log(data)
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                if (data.resultData.resultData) {
                  console.log(`当前大转盘剩余免费抽奖次数：${data.resultData.resultData.currentCount}\n`);
                  console.log(`您的大转盘助力码为：${data.resultData.resultData.helpId}\n`);
                  $.shareCodes.push(data.resultData.resultData.helpId)
                  $.currentCount = data.resultData.resultData.currentCount;
                }
              } else {
                console.log(`查询大转盘的次数：${JSON.stringify(data)}`)
              }
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

//查询排行榜好友
function pigPetRank() {
  return new Promise(async resolve => {
    const body = {
      "type": 1,
      "page": 1,
      "source": 2,
      "channelLV": "juheye",
      "riskDeviceParam": "{}"
    }
    $.post(taskUrl('pigPetRank', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} pigPetRank API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            n = 0
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0 && n < 5) {
                $.friends = data.resultData.resultData.friends
                for (let i = 0; i < $.friends.length; i++) {
                  if ($.friends[i].status === 1) {
                    $.friendId = $.friends[i].uid
                    $.name = $.friends[i].nickName
                    if (!['zero205', 'xfa05'].includes($.name)) { //放过孩子吧TT
                      console.log(`去抢夺【${$.friends[i].nickName}】的食物`)
                      await $.wait(2000)
                      await pigPetFriendIndex($.friendId)
                    }
                  }
                }
              } else {
                console.log(`查询排行榜失败：${JSON.stringify(data)}`)
              }
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

function pigPetFriendIndex(friendId) {
  return new Promise(async resolve => {
    const body = {
      "friendId": friendId,
      "source": 2,
      "channelLV": "juheye",
      "riskDeviceParam": "{}"
    }
    $.post(taskUrl('pigPetFriendIndex', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} pigPetFriendIndex API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                await pigPetRobFood($.friendId)
                await $.wait(3000)
              } else {
                console.log(`进入好友猪窝失败：${JSON.stringify(data)}`)
              }
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

//抢夺食物
async function pigPetRobFood(friendId) {
  return new Promise(async resolve => {
    const body = {
      "source": 2,
      "friendId": friendId,
      "channelLV": "juheye",
      "riskDeviceParam": "{}"
    }
    $.post(taskUrl('pigPetRobFood', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                if (data.resultData.resultData.robFoodCount > 0) {
                  console.log(`抢夺成功，获得${data.resultData.resultData.robFoodCount}g${data.resultData.resultData.robFoodName}\n`);
                  n++
                } else {
                  console.log(`抢夺失败，损失${data.resultData.resultData.robFoodCount}g${data.resultData.resultData.robFoodName}\n`);
                }
              } else {
                console.log(`抢夺失败：${JSON.stringify(data)}\n`)
              }
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

//查询签到情况
function pigPetSignIndex() {
  $.sign = true;
  return new Promise(async resolve => {
    const body = {
      "source": 2,
      "channelLV": "juheye",
      "riskDeviceParam": "{}"
    }
    $.post(taskUrl('pigPetSignIndex', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // console.log(data)
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                if (data.resultData.resultData) {
                  $.sign = data.resultData.resultData.sign;
                  $.no = data.resultData.resultData.today;
                }
              } else {
                console.log(`查询签到情况异常：${JSON.stringify(data)}`)
              }
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

//抽奖
function pigPetLotteryPlay() {
  return new Promise(async resolve => {
    const body = {
      "source": 2,
      "channelLV": "juheye",
      "riskDeviceParam": "{}",
      "validation": "",
      "type": 0
    }
    $.post(taskUrl('pigPetLotteryPlay', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                if (data.resultData.resultData) {
                  if (data.resultData.resultData.award) {
                    console.log(`大转盘抽奖获得：${data.resultData.resultData.award.name} * ${data.resultData.resultData.award.count}\n`);
                  } else {
                    console.log(`大转盘抽奖结果：没抽中，再接再励哦～\n`)
                  }
                  $.currentCount = data.resultData.resultData.currentCount;//抽奖后剩余的抽奖次数
                }
              } else {
                console.log(`其他情况：${JSON.stringify(data)}`)
              }
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

function pigPetLotteryHelpFriend(helpId) {
  return new Promise(async resolve => {
    const body = {
      "source": 2,
      "helpId": helpId,
      "channelLV": "juheye",
      "riskDeviceParam": "{}"
    }
    $.post(taskUrl('pigPetLotteryHelpFriend', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                if (data.resultData.resultData.opResult == 0) {
                  console.log(`大转盘助力结果：助力成功\n`);
                } else if (data.resultData.resultData.opResult == 461) {
                  console.log(`大转盘助力结果：助力失败，已经助力过了\n`);
                } else {
                  console.log(`大转盘助力结果：助力失败`);
                }
              }
            } else {
              console.log(`${JSON.stringify(data)}\n`)
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

async function missions() {
  for (let item of $.missions) {
    if (item.status === 4) {
      console.log(`\n${item.missionName}任务已做完,开始领取奖励`)
      await pigPetDoMission(item.mid);
      await $.wait(1000)
    } else if (item.status === 5) {
      console.log(`\n${item.missionName}已领取`)
    } else if (item.status === 3) {
      console.log(`\n${item.missionName}未完成`)
      if (item.mid === 'CPD01') {
        await pigPetDoMission(item.mid);
      } else {
        await pigPetDoMission(item.mid);
        await $.wait(1000)
        let parse
        if (item.url) {
          parse = url.parse(item.url, true, true)
        } else {
          parse = {}
        }
        if (parse.query && parse.query.readTime) {
          await queryMissionReceiveAfterStatus(parse.query.missionId);
          await $.wait(parse.query.readTime * 1000)
          await finishReadMission(parse.query.missionId, parse.query.readTime);
        } else if (parse.query && parse.query.juid) {
          await getJumpInfo(parse.query.juid)
          await $.wait(4000)
        }
      }
    }
  }
}

//领取做完任务的奖品
function pigPetDoMission(mid) {
  return new Promise(async resolve => {
    const body = {
      "source": 2,
      "channelLV": "",
      "riskDeviceParam": "{}",
      mid
    }
    $.post(taskUrl('pigPetDoMission', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                if (data.resultData.resultData) {
                  if (data.resultData.resultData.award) {
                    console.log(`奖励${data.resultData.resultData.award.name},数量:${data.resultData.resultData.award.count}`)
                  }
                }
              } else {
                console.log(`其他情况：${JSON.stringify(data)}`)
              }
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

//查询任务列表
function pigPetMissionList() {
  return new Promise(async resolve => {
    const body = {
      "source": 2,
      "channelLV": "",
      "riskDeviceParam": "{}",
    }
    $.post(taskUrl('pigPetMissionList', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // console.log(data)
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                if (data.resultData.resultData) {
                  $.missions = data.resultData.resultData.missions;//抽奖后剩余的抽奖次数
                }
              } else {
                console.log(`其他情况：${JSON.stringify(data)}`)
              }
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

function getJumpInfo(juid) {
  return new Promise(async resolve => {
    const body = {"juid": juid}
    const options = {
      "url": `${MISSION_BASE_API}/getJumpInfo?reqData=${escape(JSON.stringify(body))}`,
      "headers": {
        'Host': 'ms.jr.jd.com',
        'Origin': 'https://active.jd.com',
        'Connection': 'keep-alive',
        'Accept': 'application/json',
        "Cookie": cookie,
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        'Accept-Language': 'zh-cn',
        'Referer': 'https://u1.jr.jd.com/uc-fe-wxgrowing/cloudpig/index/',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            console.log('getJumpInfo', data)
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

function queryMissionReceiveAfterStatus(missionId) {
  return new Promise(resolve => {
    const body = {"missionId": missionId};
    const options = {
      "url": `${MISSION_BASE_API}/queryMissionReceiveAfterStatus?reqData=${escape(JSON.stringify(body))}`,
      "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Connection": "keep-alive",
        "Host": "ms.jr.jd.com",
        "Cookie": cookie,
        "Origin": "https://jdjoy.jd.com",
        "Referer": "https://jdjoy.jd.com/",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            console.log('queryMissionReceiveAfterStatus', data)
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

//做完浏览任务发送信息API
function finishReadMission(missionId, readTime) {
  return new Promise(async resolve => {
    const body = {"missionId": missionId, "readTime": readTime * 1};
    const options = {
      "url": `${MISSION_BASE_API}/finishReadMission?reqData=${escape(JSON.stringify(body))}`,
      "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Connection": "keep-alive",
        "Host": "ms.jr.jd.com",
        "Cookie": cookie,
        "Origin": "https://jdjoy.jd.com",
        "Referer": "https://jdjoy.jd.com/",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            console.log('finishReadMission', data)
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

function taskUrl(function_id, body) {
  return {
    url: `${JD_API_HOST}/${function_id}?_=${Date.now()}`,
    body: `reqData=${encodeURIComponent(JSON.stringify(body))}`,
    headers: {
      'Accept': `*/*`,
      'Origin': `https://u.jr.jd.com`,
      'Accept-Encoding': `gzip, deflate, br`,
      'Cookie': cookie,
      'Content-Type': `application/x-www-form-urlencoded;charset=UTF-8`,
      'Host': `ms.jr.jd.com`,
      'Connection': `keep-alive`,
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Referer': `https://u.jr.jd.com/`,
      'Accept-Language': `zh-cn`
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
