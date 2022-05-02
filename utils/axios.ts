import axios from 'axios';

const canRequest = (url) => {
  const [, , host] = url.split('/')

  if (
    ![
      'oapi.dingtalk.com',
      'cdn.jsdelivr.net',
      'lkyl.dianpusoft.cn',
      'raw.githubusercontent.com',
    ].includes(host) &&
    !/\.jd\.com$/.test(host) &&
    !/\.jingxi\.com/.test(host) &&
    !/\.isvjcloud\.com/.test(host)
  ) {
    console.log(host, url)
    throw new Error(`该请求 url 不合法: ${url}`)
  }
}

axios.interceptors.request.use((options) => {
  canRequest(options.url)

  return options
})

export default axios
