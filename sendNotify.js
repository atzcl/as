/*
 * @Author:  LXK9301 https://github.com/LXK9301
 * @Date: 2020-08-19 16:12:40
 * @Last Modified by: LXK9301
 * @Last Modified time: 2021-1-7 17:52:54
 */
const querystring = require('querystring')
const $ = new Env()
// =======================================微信server酱通知设置区域===========================================
//此处填你申请的SCKEY.
//(环境变量名 PUSH_KEY)
let SCKEY = ''

// =======================================QQ酷推通知设置区域===========================================
//此处填你申请的SKEY(具体详见文档 https://cp.xuthus.cc/)
//(环境变量名 QQ_SKEY)
let QQ_SKEY = ''
//此处填写私聊或群组推送，默认私聊(send[私聊]、group[群聊]、wx[个微]、ww[企微]、email[邮件])
let QQ_MODE = 'send'

// =======================================Bark App通知设置区域===========================================
//此处填你BarkAPP的信息(IP/设备码，例如：https://api.day.app/XXXXXXXX)
let BARK_PUSH = ''
//BARK app推送铃声,铃声列表去APP查看复制填写
let BARK_SOUND = ''

// =======================================telegram机器人通知设置区域===========================================
//此处填你telegram bot 的Token，例如：1077xxx4424:AAFjv0FcqxxxxxxgEMGfi22B4yh15R5uw
//(环境变量名 TG_BOT_TOKEN)
let TG_BOT_TOKEN = ''
//此处填你接收通知消息的telegram用户的id，例如：129xxx206
//(环境变量名 TG_USER_ID)
let TG_USER_ID = ''

// =======================================钉钉机器人通知设置区域===========================================
//此处填你钉钉 bot 的webhook，例如：5a544165465465645d0f31dca676e7bd07415asdasd
//(环境变量名 DD_BOT_TOKEN)
let DD_BOT_TOKEN = ''
//密钥，机器人安全设置页面，加签一栏下面显示的SEC开头的字符串
let DD_BOT_SECRET = ''

// =======================================企业微信机器人通知设置区域===========================================
//此处填你企业微信机器人的 webhook(详见文档 https://work.weixin.qq.com/api/doc/90000/90136/91770)，例如：693a91f6-7xxx-4bc4-97a0-0ec2sifa5aaa
//(环境变量名 QYWX_KEY)
let QYWX_KEY = ''

// =======================================企业微信应用消息通知设置区域===========================================
//此处填你企业微信应用消息的值(详见文档 https://work.weixin.qq.com/api/doc/90000/90135/90236)
//依次填入 corpid,corpsecret,touser,agentid,消息类型
//注意用,号隔开(英文输入法的逗号)，例如：wwcff56746d9adwers,B-791548lnzXBE6_BWfxdf3kSTMJr9vFEPKAbh6WERQ,mingcheng,1000001,2COXgjH2UIfERF2zxrtUOKgQ9XklUqMdGSWLBoW_lSDAdafat
//可选推送消息类型:
// - 卡片消息: 0 (数字零)
// - 文字消息: 1 (数字一)
// - 图文消息: 素材库图片id, 可查看此教程(http://note.youdao.com/s/HMiudGkb)
//(环境变量名 QYWX_AM)
let QYWX_AM = ''

// =======================================iGot聚合推送通知设置区域===========================================
//此处填您iGot的信息(推送key，例如：https://push.hellyw.com/XXXXXXXX)
let IGOT_PUSH_KEY = ''

// =======================================push+设置区域=======================================
//官方文档：http://www.pushplus.plus/
//PUSH_PLUS_TOKEN：微信扫码登录后一对一推送或一对多推送下面的token(您的Token)，不提供PUSH_PLUS_USER则默认为一对一推送
//PUSH_PLUS_USER： 一对多推送的“群组编码”（一对多推送下面->您的群组(如无则新建)->群组编码，如果您是创建群组人。也需点击“查看二维码”扫描绑定，否则不能接受群组消息推送）
let PUSH_PLUS_TOKEN = ''
let PUSH_PLUS_USER = ''

//==========================云端环境变量的判断与接收=========================
if (process.env.PUSH_KEY) {
  SCKEY = process.env.PUSH_KEY
}

if (process.env.QQ_SKEY) {
  QQ_SKEY = process.env.QQ_SKEY
}

if (process.env.QQ_MODE) {
  QQ_MODE = process.env.QQ_MODE
}

if (process.env.BARK_PUSH) {
  if (
    process.env.BARK_PUSH.indexOf('https') > -1 ||
    process.env.BARK_PUSH.indexOf('http') > -1
  ) {
    //兼容BARK自建用户
    BARK_PUSH = process.env.BARK_PUSH
  } else {
    BARK_PUSH = `https://api.day.app/${process.env.BARK_PUSH}`
  }
  if (process.env.BARK_SOUND) {
    BARK_SOUND = process.env.BARK_SOUND
  }
} else {
  if (
    BARK_PUSH &&
    BARK_PUSH.indexOf('https') === -1 &&
    BARK_PUSH.indexOf('http') === -1
  ) {
    //兼容BARK本地用户只填写设备码的情况
    BARK_PUSH = `https://api.day.app/${BARK_PUSH}`
  }
}
if (process.env.TG_BOT_TOKEN) {
  TG_BOT_TOKEN = process.env.TG_BOT_TOKEN
}
if (process.env.TG_USER_ID) {
  TG_USER_ID = process.env.TG_USER_ID
}

if (process.env.DD_BOT_TOKEN) {
  DD_BOT_TOKEN = process.env.DD_BOT_TOKEN
  if (process.env.DD_BOT_SECRET) {
    DD_BOT_SECRET = process.env.DD_BOT_SECRET
  }
}

if (process.env.QYWX_KEY) {
  QYWX_KEY = process.env.QYWX_KEY
}

if (process.env.QYWX_AM) {
  QYWX_AM = process.env.QYWX_AM
}

if (process.env.IGOT_PUSH_KEY) {
  IGOT_PUSH_KEY = process.env.IGOT_PUSH_KEY
}

if (process.env.PUSH_PLUS_TOKEN) {
  PUSH_PLUS_TOKEN = process.env.PUSH_PLUS_TOKEN
}
if (process.env.PUSH_PLUS_USER) {
  PUSH_PLUS_USER = process.env.PUSH_PLUS_USER
}
//==========================云端环境变量的判断与接收=========================

async function sendNotify(text, desp, params = {}) {
  //提供6种通知
  desp += `\n【通知】：\n618动物联萌将取消18点前自动释放技能\n请自行计算伤害，手动使用技能\n\n本仓库备份地址：\nhttps://gitee.com/asd920/Auto-jd`
  await Promise.all([
    serverNotify(text, desp), //微信server酱
    pushPlusNotify(text, desp), //pushplus(推送加)
  ])
  //由于上述两种微信通知需点击进去才能查看到详情，故text(标题内容)携带了账号序号以及昵称信息，方便不点击也可知道是哪个京东哪个活动
  text = text.match(/.*?(?=\s?-)/g) ? text.match(/.*?(?=\s?-)/g)[0] : text
  await Promise.all([
    BarkNotify(text, desp, params), //iOS Bark APP
    tgBotNotify(text, desp), //telegram 机器人
    ddBotNotify(text, desp), //钉钉机器人
    qywxBotNotify(text, desp), //企业微信机器人
    qywxamNotify(text, desp), //企业微信应用消息推送
    iGotNotify(text, desp, params), //iGot
    //CoolPush(text, desp)//QQ酷推
  ])
}

function serverNotify(text, desp, timeout = 2100) {
  return new Promise((resolve) => {
    if (SCKEY) {
      //微信server酱推送通知一个\n不会换行，需要两个\n才能换行，故做此替换
      desp = desp.replace(/[\n\r]/g, '\n\n')
      const options = {
        url: SCKEY.includes('SCT')
          ? `https://sctapi.ftqq.com/${SCKEY}.send`
          : `https://sc.ftqq.com/${SCKEY}.send`,
        body: `text=${text}&desp=${desp}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
      setTimeout(() => {
        $.post(options, (err, resp, data) => {
          try {
            if (err) {
              console.log('发送通知调用API失败！！\n')
              console.log(err)
            } else {
              data = JSON.parse(data)
              //server酱和Server酱·Turbo版的返回json格式不太一样
              if (data.errno === 0 || data.data.errno === 0) {
                console.log('server酱发送通知消息成功\n')
              } else if (data.errno === 1024) {
                // 一分钟内发送相同的内容会触发
                console.log(`server酱发送通知消息异常: ${data.errmsg}\n`)
              } else {
                console.log(`server酱发送通知消息异常\n${JSON.stringify(data)}`)
              }
            }
          } catch (e) {
            $.logErr(e, resp)
          } finally {
            resolve(data)
          }
        })
      }, timeout)
    } else {
      console.log('您未提供server酱的SCKEY，取消微信推送消息通知\n')
      resolve()
    }
  })
}

function CoolPush(text, desp) {
  return new Promise((resolve) => {
    if (QQ_SKEY) {
      let options = {
        url: `https://push.xuthus.cc/${QQ_MODE}/${QQ_SKEY}`,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      // 已知敏感词
      text = text.replace(/京豆/g, '豆豆')
      desp = desp.replace(/京豆/g, '')
      desp = desp.replace(/🐶/g, '')
      desp = desp.replace(/红包/g, 'H包')

      switch (QQ_MODE) {
        case 'email':
          options.json = {
            t: text,
            c: desp,
          }
          break
        default:
          options.body = `${text}\n\n${desp}`
      }

      let pushMode = function (t) {
        switch (t) {
          case 'send':
            return '个人'
          case 'group':
            return 'QQ群'
          case 'wx':
            return '微信'
          case 'ww':
            return '企业微信'
          case 'email':
            return '邮件'
          default:
            return '未知方式'
        }
      }

      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log(`发送${pushMode(QQ_MODE)}通知调用API失败！！\n`)
            console.log(err)
          } else {
            data = JSON.parse(data)
            if (data.code === 200) {
              console.log(`酷推发送${pushMode(QQ_MODE)}通知消息成功\n`)
            } else if (data.code === 400) {
              console.log(
                `QQ酷推(Cool Push)发送${pushMode(QQ_MODE)}推送失败：${
                  data.msg
                }\n`
              )
            } else if (data.code === 503) {
              console.log(`QQ酷推出错，${data.message}：${data.data}\n`)
            } else {
              console.log(`酷推推送异常: ${JSON.stringify(data)}`)
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve(data)
        }
      })
    } else {
      console.log('您未提供酷推的SKEY，取消QQ推送消息通知\n')
      resolve()
    }
  })
}

function BarkNotify(text, desp, params = {}) {
  return new Promise((resolve) => {
    if (BARK_PUSH) {
      const options = {
        url: `${BARK_PUSH}/${encodeURIComponent(text)}/${encodeURIComponent(
          desp
        )}?sound=${BARK_SOUND}&${querystring.stringify(params)}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
      $.get(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('Bark APP发送通知调用API失败！！\n')
            console.log(err)
          } else {
            data = JSON.parse(data)
            if (data.code === 200) {
              console.log('Bark APP发送通知消息成功\n')
            } else {
              console.log(`${data.message}\n`)
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve()
        }
      })
    } else {
      console.log('您未提供Bark的APP推送BARK_PUSH，取消Bark推送消息通知\n')
      resolve()
    }
  })
}

function tgBotNotify(text, desp) {
  return new Promise((resolve) => {
    if (TG_BOT_TOKEN && TG_USER_ID) {
      const options = {
        url: `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`,
        body: `chat_id=${TG_USER_ID}&text=${text}\n\n${desp}&disable_web_page_preview=true`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
      if (process.env.TG_PROXY_HOST && process.env.TG_PROXY_PORT) {
        const tunnel = require('tunnel')
        const agent = {
          https: tunnel.httpsOverHttp({
            proxy: {
              host: process.env.TG_PROXY_HOST,
              port: process.env.TG_PROXY_PORT * 1,
            },
          }),
        }
        Object.assign(options, { agent })
      }
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('telegram发送通知消息失败！！\n')
            console.log(err)
          } else {
            data = JSON.parse(data)
            if (data.ok) {
              console.log('Telegram发送通知消息完成。\n')
            } else if (data.error_code === 400) {
              console.log('请主动给bot发送一条消息并检查接收用户ID是否正确。\n')
            } else if (data.error_code === 401) {
              console.log('Telegram bot token 填写错误。\n')
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve(data)
        }
      })
    } else {
      console.log(
        '您未提供telegram机器人推送所需的TG_BOT_TOKEN和TG_USER_ID，取消telegram推送消息通知\n'
      )
      resolve()
    }
  })
}
function ddBotNotify(text, desp) {
  return new Promise((resolve) => {
    const options = {
      url: `https://oapi.dingtalk.com/robot/send?access_token=${DD_BOT_TOKEN}`,
      json: {
        msgtype: 'text',
        text: {
          content: ` ${text}\n\n${desp}`,
        },
      },
      headers: {
        'Content-Type': 'application/json',
      },
    }
    if (DD_BOT_TOKEN && DD_BOT_SECRET) {
      const crypto = require('crypto')
      const dateNow = Date.now()
      const hmac = crypto.createHmac('sha256', DD_BOT_SECRET)
      hmac.update(`${dateNow}\n${DD_BOT_SECRET}`)
      const result = encodeURIComponent(hmac.digest('base64'))
      options.url = `${options.url}&timestamp=${dateNow}&sign=${result}`
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('钉钉发送通知消息失败！！\n')
            console.log(err)
          } else {
            data = JSON.parse(data)
            if (data.errcode === 0) {
              console.log('钉钉发送通知消息完成。\n')
            } else {
              console.log(`${data.errmsg}\n`)
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve(data)
        }
      })
    } else if (DD_BOT_TOKEN) {
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('钉钉发送通知消息失败！！\n')
            console.log(err)
          } else {
            data = JSON.parse(data)
            if (data.errcode === 0) {
              console.log('钉钉发送通知消息完成。\n')
            } else {
              console.log(`${data.errmsg}\n`)
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve(data)
        }
      })
    } else {
      console.log(
        '您未提供钉钉机器人推送所需的DD_BOT_TOKEN或者DD_BOT_SECRET，取消钉钉推送消息通知\n'
      )
      resolve()
    }
  })
}

function qywxBotNotify(text, desp) {
  return new Promise((resolve) => {
    const options = {
      url: `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${QYWX_KEY}`,
      json: {
        msgtype: 'text',
        text: {
          content: ` ${text}\n\n${desp}`,
        },
      },
      headers: {
        'Content-Type': 'application/json',
      },
    }
    if (QYWX_KEY) {
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('企业微信发送通知消息失败！！\n')
            console.log(err)
          } else {
            data = JSON.parse(data)
            if (data.errcode === 0) {
              console.log('企业微信发送通知消息完成。\n')
            } else {
              console.log(`${data.errmsg}\n`)
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve(data)
        }
      })
    } else {
      console.log(
        '您未提供企业微信机器人推送所需的QYWX_KEY，取消企业微信推送消息通知\n'
      )
      resolve()
    }
  })
}

function ChangeUserId(desp) {
  const QYWX_AM_AY = QYWX_AM.split(',')
  if (QYWX_AM_AY[2]) {
    const userIdTmp = QYWX_AM_AY[2].split('|')
    let userId = ''
    for (let i = 0; i < userIdTmp.length; i++) {
      const count = '账号' + (i + 1)
      const count2 = '签到号 ' + (i + 1)
      if (desp.match(count) || desp.match(count2)) {
        userId = userIdTmp[i]
      }
    }
    if (!userId) userId = QYWX_AM_AY[2]
    return userId
  } else {
    return '@all'
  }
}

function qywxamNotify(text, desp) {
  return new Promise((resolve) => {
    if (QYWX_AM) {
      const QYWX_AM_AY = QYWX_AM.split(',')
      const options_accesstoken = {
        url: `https://qyapi.weixin.qq.com/cgi-bin/gettoken`,
        json: {
          corpid: `${QYWX_AM_AY[0]}`,
          corpsecret: `${QYWX_AM_AY[1]}`,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
      $.post(options_accesstoken, (err, resp, data) => {
        html = desp.replace(/\n/g, '<br/>')
        var json = JSON.parse(data)
        accesstoken = json.access_token
        let options

        switch (QYWX_AM_AY[4]) {
          case '0':
            options = {
              msgtype: 'textcard',
              textcard: {
                title: `${text}`,
                description: `${desp}`,
                url: '127.0.0.1',
                btntxt: '更多',
              },
            }
            break

          case '1':
            options = {
              msgtype: 'text',
              text: {
                content: `${text}\n\n${desp}`,
              },
            }
            break

          default:
            options = {
              msgtype: 'mpnews',
              mpnews: {
                articles: [
                  {
                    title: `${text}`,
                    thumb_media_id: `${QYWX_AM_AY[4]}`,
                    author: `智能助手`,
                    content_source_url: ``,
                    content: `${html}`,
                    digest: `${desp}`,
                  },
                ],
              },
            }
        }
        options = {
          url: `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${accesstoken}`,
          json: {
            touser: `${ChangeUserId(desp)}`,
            agentid: `${QYWX_AM_AY[3]}`,
            safe: '0',
            ...options,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        }

        $.post(options, (err, resp, data) => {
          try {
            if (err) {
              console.log(
                '成员ID:' +
                  ChangeUserId(desp) +
                  '企业微信应用消息发送通知消息失败！！\n'
              )
              console.log(err)
            } else {
              data = JSON.parse(data)
              if (data.errcode === 0) {
                console.log(
                  '成员ID:' +
                    ChangeUserId(desp) +
                    '企业微信应用消息发送通知消息完成。\n'
                )
              } else {
                console.log(`${data.errmsg}\n`)
              }
            }
          } catch (e) {
            $.logErr(e, resp)
          } finally {
            resolve(data)
          }
        })
      })
    } else {
      console.log(
        '您未提供企业微信应用消息推送所需的QYWX_AM，取消企业微信应用消息推送消息通知\n'
      )
      resolve()
    }
  })
}

function iGotNotify(text, desp, params = {}) {
  return new Promise((resolve) => {
    if (IGOT_PUSH_KEY) {
      // 校验传入的IGOT_PUSH_KEY是否有效
      const IGOT_PUSH_KEY_REGX = new RegExp('^[a-zA-Z0-9]{24}$')
      if (!IGOT_PUSH_KEY_REGX.test(IGOT_PUSH_KEY)) {
        console.log('您所提供的IGOT_PUSH_KEY无效\n')
        resolve()
        return
      }
      const options = {
        url: `https://push.hellyw.com/${IGOT_PUSH_KEY.toLowerCase()}`,
        body: `title=${text}&content=${desp}&${querystring.stringify(params)}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('发送通知调用API失败！！\n')
            console.log(err)
          } else {
            if (typeof data === 'string') data = JSON.parse(data)
            if (data.ret === 0) {
              console.log('iGot发送通知消息成功\n')
            } else {
              console.log(`iGot发送通知消息失败：${data.errMsg}\n`)
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve(data)
        }
      })
    } else {
      console.log('您未提供iGot的推送IGOT_PUSH_KEY，取消iGot推送消息通知\n')
      resolve()
    }
  })
}

function pushPlusNotify(text, desp) {
  return new Promise((resolve) => {
    if (PUSH_PLUS_TOKEN) {
      desp = desp.replace(/[\n\r]/g, '<br>') // 默认为html, 不支持plaintext
      const body = {
        token: `${PUSH_PLUS_TOKEN}`,
        title: `${text}`,
        content: `${desp}`,
        topic: `${PUSH_PLUS_USER}`,
      }
      const options = {
        url: `http://www.pushplus.plus/send`,
        body: JSON.stringify(body),
        headers: {
          'Content-Type': ' application/json',
        },
      }
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log(
              `push+发送${
                PUSH_PLUS_USER ? '一对多' : '一对一'
              }通知消息失败！！\n`
            )
            console.log(err)
          } else {
            data = JSON.parse(data)
            if (data.code === 200) {
              console.log(
                `push+发送${
                  PUSH_PLUS_USER ? '一对多' : '一对一'
                }通知消息完成。\n`
              )
            } else {
              console.log(
                `push+发送${
                  PUSH_PLUS_USER ? '一对多' : '一对一'
                }通知消息失败：${data.msg}\n`
              )
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve(data)
        }
      })
    } else {
      console.log(
        '您未提供push+推送所需的PUSH_PLUS_TOKEN，取消push+推送消息通知\n'
      )
      resolve()
    }
  })
}

module.exports = {
  sendNotify,
  BARK_PUSH,
}
