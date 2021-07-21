/**
 * 财富岛热气球挂后台
 * export CFD_LOOP_DELAY=20000  // 捡气球间隔时间，单位毫秒
 */

import { format } from 'date-fns'
import axios from 'axios'
import USER_AGENT, {
  TotalBean,
  requireConfig,
  wait,
  getRandomNumberByRange,
} from './TS_USER_AGENTS'

const CryptoJS = require('crypto-js')
const crypto = require('crypto')
const fs = require('fs')
const notify = require('./sendNotify')

let appId: number = 10028,
  fingerprint: string | number,
  token: string,
  enCryptMethodJD: any
let cookie: string = '',
  res: any = ''
process.env.CFD_LOOP_DELAY
  ? console.log('设置延迟:', parseInt(process.env.CFD_LOOP_DELAY))
  : console.log('设置延迟:10000~25000随机')

let UserName: string, index: number
!(async () => {
  await requestAlgo()
  let cookiesArr: any = await requireConfig()

  while (1) {
    for (let i = 0; i < cookiesArr.length; i++) {
      cookie = cookiesArr[i]
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      index = i + 1
      let { isLogin, nickName }: any = await TotalBean(cookie)
      if (!isLogin) {
        notify.sendNotify(
          __filename.split('/').pop(),
          `cookie已失效\n京东账号${index}：${nickName || UserName}`
        )
        continue
      }
      console.log(`\n开始【京东账号${index}】${nickName || UserName}\n`)
      try {
        res = await speedUp(
          '_cfd_t,bizCode,dwEnv,ptag,source,strBuildIndex,strZone'
        )
        if (res.iRet !== 0) {
          console.log('手动建造4个房子')
          continue
        }
        console.log('今日热气球:', res.dwTodaySpeedPeople, '/', 20)
        let shell: any = await speedUp(
          '_cfd_t,bizCode,dwEnv,ptag,source,strZone'
        )
        if (shell.Data.hasOwnProperty('NormShell')) {
          for (let s of shell.Data.NormShell) {
            for (let j = 0; j < s.dwNum; j++) {
              res = await speedUp(
                '_cfd_t,bizCode,dwEnv,dwType,ptag,source,strZone',
                s.dwType
              )
              if (res.iRet !== 0) {
                console.log(res)
                break
              }
              console.log('捡贝壳:', res.Data.strFirstDesc)
              await wait(500)
            }
          }
        }
      } catch (e) {
        console.log(e)
      }
    }
    let t: number = process.env.CFD_LOOP_DELAY
      ? parseInt(process.env.CFD_LOOP_DELAY)
      : getRandomNumberByRange(1000 * 10, 1000 * 30)
    await wait(t)
  }
})()

function speedUp(stk: string, dwType?: number) {
  return new Promise(async (resolve, reject) => {
    let url: string = `https://m.jingxi.com/jxbfd/user/SpeedUp?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=&strBuildIndex=food&_ste=1&_=${Date.now()}&sceneval=2&_stk=${encodeURIComponent(
      stk
    )}`
    if (stk === '_cfd_t,bizCode,dwEnv,ptag,source,strZone')
      url = `https://m.jingxi.com/jxbfd/story/queryshell?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=&_stk=_cfd_t%2CbizCode%2CdwEnv%2Cptag%2Csource%2CstrZone&_ste=1&_=${Date.now()}&sceneval=2`
    if (stk === '_cfd_t,bizCode,dwEnv,dwType,ptag,source,strZone')
      url = `https://m.jingxi.com/jxbfd/story/pickshell?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=&dwType=${dwType}&_stk=_cfd_t%2CbizCode%2CdwEnv%2CdwType%2Cptag%2Csource%2CstrZone&_ste=1&_=${Date.now()}&sceneval=2`
    url += '&h5st=' + decrypt(stk, url)
    try {
      let { data } = await axios.get(url, {
        headers: {
          Host: 'm.jingxi.com',
          Referer: 'https://st.jingxi.com/',
          'User-Agent': USER_AGENT,
          Cookie: cookie,
        },
      })
      resolve(data)
    } catch (e) {
      reject(502)
    }
  })
}

async function requestAlgo() {
  fingerprint = await generateFp()
  return new Promise(async (resolve) => {
    let { data } = await axios.post(
      'https://cactus.jd.com/request_algo?g_ty=ajax',
      {
        version: '1.0',
        fp: fingerprint,
        appId: appId,
        timestamp: Date.now(),
        platform: 'web',
        expandParams: '',
      },
      {
        headers: {
          Authority: 'cactus.jd.com',
          Pragma: 'no-cache',
          'Cache-Control': 'no-cache',
          Accept: 'application/json',
          'User-Agent': USER_AGENT,
          'Content-Type': 'application/json',
          Origin: 'https://st.jingxi.com',
          'Sec-Fetch-Site': 'cross-site',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Dest': 'empty',
          Referer: 'https://st.jingxi.com/',
          'Accept-Language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7',
        },
      }
    )
    if (data['status'] === 200) {
      token = data.data.result.tk
      let enCryptMethodJDString = data.data.result.algo
      if (enCryptMethodJDString)
        enCryptMethodJD = new Function(`return ${enCryptMethodJDString}`)()
    } else {
      console.log(`fp: ${fingerprint}`)
      console.log('request_algo 签名参数API请求失败:')
    }
    resolve(200)
  })
}

function decrypt(stk: string, url: string) {
  const timestamp = format(new Date(), 'yyyyMMddhhmmssSSS')
  let hash1: string
  if (fingerprint && token && enCryptMethodJD) {
    hash1 = enCryptMethodJD(
      token,
      fingerprint.toString(),
      timestamp.toString(),
      appId.toString(),
      CryptoJS
    ).toString(CryptoJS.enc.Hex)
  } else {
    const random = '5gkjB6SpmC9s'
    token = `tk01wcdf61cb3a8nYUtHcmhSUFFCfddDPRvKvYaMjHkxo6Aj7dhzO+GXGFa9nPXfcgT+mULoF1b1YIS1ghvSlbwhE0Xc`
    fingerprint = 9686767825751161
    // $.fingerprint = 7811850938414161;
    const str = `${token}${fingerprint}${timestamp}${appId}${random}`
    hash1 = CryptoJS.SHA512(str, token).toString(CryptoJS.enc.Hex)
  }
  let st: string = ''
  stk.split(',').map((item, index) => {
    st += `${item}:${getQueryString(url, item)}${
      index === stk.split(',').length - 1 ? '' : '&'
    }`
  })
  const hash2 = CryptoJS.HmacSHA256(st, hash1.toString()).toString(
    CryptoJS.enc.Hex
  )
  return encodeURIComponent(
    [
      ''.concat(timestamp.toString()),
      ''.concat(fingerprint.toString()),
      ''.concat(appId.toString()),
      ''.concat(token),
      ''.concat(hash2),
    ].join(';')
  )
}

function generateFp() {
  let e = '0123456789'
  let a = 13
  let i = ''
  for (; a--; ) i += e[(Math.random() * e.length) | 0]
  return (i + Date.now()).slice(0, 16)
}

function getQueryString(url: string, name: string) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let r = url.split('?')[1].match(reg)
  if (r != null) return unescape(r[2])
  return ''
}
