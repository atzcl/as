import Windi from 'https://cdn.jsdelivr.net/npm/windicss@3.5.4/index.mjs'
import { HTMLParser } from 'https://cdn.jsdelivr.net/npm/windicss@3.5.4/utils/parser/index.mjs'

/**
 * https://windicss.org/integrations/javascript.html
 */
const generateStyles = (html, windiConfig = {}) => {
  // 获取 windi processor
  const processor = new Windi(windiConfig)

  // 解析所有的 classes 并将它们放到一行来简化操作
  const htmlClasses = new HTMLParser(html)
    .parseClasses()
    .map(i => i.result)
    .join(' ')

  // 基于我们传入的 html 生成预检样式
  const preflightSheet = processor.preflight(html)

  // 将 html classes 处理为一个可解释的样式表
  const interpretedSheet = processor.interpret(htmlClasses).styleSheet

  // 构建样式
  const APPEND = false
  const MINIFY = false
  const styles = interpretedSheet.extend(preflightSheet, APPEND).build(MINIFY)

  return styles
}

const injectionStylesId = `injectionStyles_${Math.random()}`
const injectionStyles = (styleContent) => {
  let styleEl = document.getElementById(injectionStylesId)
  if (styleEl)
    document.head.removeChild(styleEl)

  styleEl = document.createElement('style')
  styleEl.type = 'text/css'
  styleEl.id = injectionStylesId
  styleEl.innerHTML = styleContent

  document.head.appendChild(styleEl)
}

injectionStyles(generateStyles(document.body.outerHTML, window.__windicss_config__ || {}))
