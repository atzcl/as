/*
粉丝互动
类似于京东抽奖机，各个店铺的粉丝互动活动。
有看到新活动可以私信我添加活动ID。 GitHub@i-chenzhe
新手写脚本，难免有bug，能用且用。

更新地址：https://raw.githubusercontent.com/monk-coder/dust/dust/i-chenzhe/z_fanslove.js
============Quantumultx===============
[task_local]
#粉丝互动
3 10 * * * https://raw.githubusercontent.com/monk-coder/dust/dust/i-chenzhe/z_fanslove.js, tag=粉丝互动,  enabled=true
[rewrite_local]
^https://lzkjdz\-isv\.isvjcloud\.com\/wxFansInterActionActivity\/activityContent url script-response-body https://raw.githubusercontent.com/monk-coder/dust/dust/i-chenzhe/jd_getFanslove.js
================Loon==============
[Script]
cron "3 10 * * *" script-path=https://raw.githubusercontent.com/monk-coder/dust/dust/i-chenzhe/z_fanslove.js,tag=粉丝互动
===============Surge=================
粉丝互动 = type=cron,cronexp="3 10 * * *",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/monk-coder/dust/dust/i-chenzhe/z_fanslove.js
============小火箭=========
粉丝互动 = type=cron,script-path=https://raw.githubusercontent.com/monk-coder/dust/dust/i-chenzhe/z_fanslove.js, cronexpr="3 10 * * *", timeout=3600, enable=true
*/

const $ = new Env('粉丝互动')
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : ''
const notify = $.isNode() ? require('./sendNotify') : ''
let cookiesArr = [],
  cookie = '',
  originCookie = '',
  message = '',
  allNotify = {}
let helpAuthor = false //为作者助力的开关
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false')
    console.log = () => {}
} else {
  let cookiesData = $.getdata('CookiesJD') || '[]'
  cookiesData = JSON.parse(cookiesData)
  cookiesArr = cookiesData.map((item) => item.cookie)
  cookiesArr.reverse()
  cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')])
  cookiesArr.reverse()
  cookiesArr = cookiesArr.filter((item) => !!item)
}
$.log(
  '脚本版本 v0.3\n更新时间:2021-03-09 15:55\n仓库：https://www.github.com/i-chenzhe/qx'
)
var _0xodG = 'jsjiami.com.v6',
  _0x1861 = [
    _0xodG,
    'w5TCnGPClsOrOA==',
    'wpjDqWwG',
    'wq8xw4vCn8OowpRbw7PCjMOqcA==',
    'eEsFw6HCmjY=',
    'YsO9dcKww6dmdULDkQ==',
    'w5cLPsK+Iw==',
    'JMOSw7hRwoUKMsO4',
    'w5EPIsKpIypmFA==',
    'HyZow5A8Mw==',
    'F8K/w44mw4MHw6Eqw4jDvMOrw43Cow==',
    'wpdpWVfCrsKSwrLDj8OQw6pLw5w5wpQYwqrCvMOeN8Omw5LCvMKJw41Pw4zCosKIwpPCqsK+R8O5VBQlw41tw73ChcK2wpTCiGF6T1MOWF7DvsOiw4Qu',
    'Q2B8w7bCshx7fMK9Mg8gfcKX',
    'wpDCoXJswqk3fcOwDWpja8OSwo1FDsOU',
    'AkXCoQ==',
    'wolrWGjChA==',
    'w6dWN2vCtA==',
    'SSzDuHbCmw==',
    'wqHDk34iVg==',
    'w4LCqTU=',
    'wpfDqCzCgSI=',
    'w7LCtzDCusOJImZySsKUDi1EdTAnGQ3DiRbDsmHDmhEHAyfDnMKpwobCjH41RhHDul10IWvCssKKwpEQwpbCr8K/',
    'wrTCs3B0w4Y=',
    'BXYEw6BMw7A=',
    'AhJww7VJw6Y=',
    'w610wqlrw7fDusKCNQfDscOUDcOmw4o9w7ImwoHCljRPJMOXMn/DqMO3JcOMwrVFw6TDukx0I8OJasKSwoBrXcOrw6RaVW/ChcK2EgfDrU82eMOIY1XDjsOPJh18ScOmw7J4FcKMFDElZcOlAGxLw77CtsObPlc6wo5tw6oxLAogw4gXw4Bww6zDvcKVI8KNfsKrwp8edcOIwqnCiCoCwpUXwqTDr8KZO8K/wqvCq8KFTT7ChsKCSsO+VyLDqFAnwpfCrzZ8w7wHw58pdghUBiwtw53Ch03Dh8Osw5nDjipgIMKEOz1gDkkgKMKvdWF+Zxx5w7fCv8Kkw4LDqMO6w4o6RsOvwp7DpsOhw64dw5EDSsOjUMKkXQt6wqjCtsOtwoMvw7nDvcO/BwEAGEfDpMO/wo0Aw6pxw7hZwqElw5wqw55Xw49QGTl7Hgt3w7dtw4MQFkwNKW0SJcOqw5HCsMOEw41fw4TCrMOBw4nDssOqQ8Olw7Z7fxPCv2bCmx52DxPCgQHDjVxywqttwpTDpCjCp8Oaw7Z2w4dmw40FH8KVJcKewobCg8Ogw5RkwrNyw4HDuTs=',
    'w6h7w7zDvRk=',
    'w5FjVMKS',
    'TBLDuw==',
    'w5vDs8K8',
    'HkvCtMOQw4I=',
    'w4zCnG/CtsO3AWxl',
    'wr3Cs3bDmcO7PwXCksKk',
    'wqUawqrClBnDtMOCNg==',
    'wpfDhcON',
    'wqYmw4vChsOtw4cAwqXCpMO+JC5LUMKvOhLDnRA6woXDvcOowpHCq28AIh3Dn8K4WQJjHsKqAStVKD4LworClcOVaMKrwpEDNsKQwql2KMKQw44zw57Dlw==',
    'wqk2w7Ykw77Cp8KHJFvDscOeRQ==',
    'Rw08',
    'woQWwovCn8OOwpVAw6TCoMKhfDYRS8O2ZhzClhYHw4LDscOqwp3DtSEdQy/CnMO9BEM+GsOsJyZXMDJLw5fDssKBZcOr',
    'OTkJw6Jhw4xrAytMwosww7Uz',
    'OcOkdGDDiDsawrDCsX/CqUfDmcOtVGHDhQ==',
    'wp91w5DDiWQ=',
    'wqRzIHXCgw==',
    'w4xObsO1w4PDtF3DhsOEwo8=',
    'w6HDvMOKw7RR',
    'wqgnwqfCuSU=',
    'wo7CghBjXA==',
    'HkXCtcOX',
    'M2kdwqA6',
    'woh8w5HDhG0=',
    'wrwpw7Rvw70=',
    'Gw18w4EC',
    'wr/CrQhXS2TDrg==',
    'w4vClnDDvsO6JWZ3RsOe',
    'G8Kww43CsCRBw6rDnMKXw4U=',
    'w5VpX8KSBSFJU2jChD5De0dWw7o1wp8ndcOQw6cQWMO/Gj7DmCbCpsKGR8OcNgIiDnpLwpDCsMK6E2TDisK3T8OaHg4tw7/DoWoBDHrCusOew5TDnMOoYw==',
    'wqU3w5rChsKzwpxDw6PCs8Or',
    'wp7CpGHDvcOkbwnCrMOxw7XCuz47OMK7esKxDBDCthzDo0EwwpDDjsK9K8OpwpbChTUFwoPCmnwZPRrDvcKbYgTDo1YXCsKWW1/DgXDDgMKXDXlnw69ZwqjDm8OMwpHDhkNBwqPCsMKFw6UGJ8OuwrhCwqhHw6XDih5yDVTDkcOgS8KewoFmwpMlwpLCu8O/w4otdVF5wpDDuhXCvcOkVsK/w6kzbklyM8KUwq1qAB/DpcOKPGjCpVFow4sva0fDi8K6wr7CvghmCiDDljdmwqTCvDbCmi/ChcK2w4kWJcKKIcKAw6PCicOaw44cw7EMZAbDs0gLw7vCncKKUsOeIcKswqNhw704KjjDpsKIw77DjiBjOVPDll1JaXImJcOIS8OvwrXCj8OswqXDt2h1w70ISXDCjsKCwqjCqVZ1V8KjwogQw68hTMOrIMKoXMK+Ix9Rw7NIwrfDiVQ5w4fDi8Krw4wjCyphasOVPsKECMKQHDLDqcO9WMKSTz8HanDCv8ObwrvCsMOMwrDCkWfDvkIGbGDCpxLCisOfQUzDlgtJHifCmDTDhMOOG3AjwogSw6ctw60leVJWMMOhGsOcw5ZPJDh4BsONwpdHX8KKMcOlw4Mgw4XCrzlGfhM4w6zDuMO6w6PCgTLCgGrDvMKEwrrCq8K3wpHCsWA5Yn/Ciwwhw7TDgkd6w6rClcKSwojCn8Kjw5N9wqpxwoPDqRRacMOEw57Dm8OZw5NtbB/DnsOywpY0wq/DnAkSw5pQRsKNwrvDtU7DlsKSwpo1C8KZI8Oew6UQcFVPIFdnw6zCv8O2woUlw6HCgsKjwqnCmVjCn27CoMOY',
    'w7LCjcKuw4wrMxFIwpzCmDgaworCuA==',
    'wpPCumnDvcK4dATCmcO/w7bCtC9lLcK1K8Ot',
    'woNhccOZQsKqMiUZw4IIFw==',
    'woFKb8O2woHDoEPDjMOXw5djVcOww7gfwovCgnTCpQzDphw=',
    'ZSrDrFDClQ==',
    'w4NkXcOEwrw=',
    'wpPCrVnDo8ON',
    'wqTCgjhxTw==',
    'VWc2',
    'w6XDtsOJw7NC',
    'wpjDiMOgOjo=',
    'woTCq3d1w7E=',
    'F1AkwpJGw5vCocK/QW8=',
    'CRHDpyha',
    'TAfDt8KQAcOLWsOtbsKjCHBLXl/ClEfDisKXwojDlljDmsOJ',
    'wp1jw4rDjWoRwr7CrFUbYXrCunLDg8KWw4/DjsKbZ0Eiw4fDg8OwT8Kmw5PCggVIZ8KFHcOvccOQw5Z2PsOUKWHDr3fCoA==',
    'wrDDi1M6w5jDqFQCw6p2wqxteMK6',
    'woDDsmsCw5/Cpgt/w6N9wrJib8K0ejLDvMKtwoloUTwLwoYfFsKQwoNaIcO+dg==',
    'w5PClmHCo8K0K2V1WcOe',
    'w4fDlMOfw5Z9',
    'D3l1eCo=',
    'wrQ6wpLClcOw',
    'w5bDrMKrw4jCjsOvw4HDlgErB0LCscKgfsO1ScOgw5HDqsKCwrkuwqfDs1gOwphNw7rDjDTCvA==',
    'G3/CksOWw4g=',
    'bi56w7FowrMDw5XCkcOSbcOlKcKkLcOQw5bDpzrCvMK8MQ7Cn8OGwowhw5BTwq9Ow7YXBQDDo8K1Q8KawpJxEAQbwpEdVHh2ScOLwoPDucOfUVBjRcOowpvChsKpw4xdwoQdXwU=',
    'RQDDqDVHCcKNw5/CtMO5ZcKy',
    'w4nCpsOXw5sDGQ==',
    'bsOfZcKnacO1w7xOw74lZcKULwbCqcK9wpUHwrxvT8OG',
    'w53DuMK6w5TCl8K3w4nDsgArBwjDssK0J8KxEMO1wozCtMOEw7oww6nDr1EfwoFBw6fDg37CrxLCpcO8wpTCkB7Dvl3Cgn8AGzwMw60hUzh8w6XDsgHChGPDtGvCqCZnUF9RPFnCuBDDqSV2w6gfwq52wrdmfsO2DMKxQsKBwoNtMcO8TRkVMGdDKQFcQWrCqsO9woZZw4EhA2wzfcOue8KGwpvDuMK4bMKtwoxuMcKSw59FdsOBwrPCuh/Dh8KNQcKaAkHCmF1MPVrDlhXCssKww70cCFTDtcKOSgFHAMKVwpQiwoBPw7TCsMOmw5N/NhcPw6bChcOJWwHDg8OxJcKEPzhrw77Cj8K9E1PCm8OFR0HCnG0swq4Oa1xXwq/DgcKSwq/CuQ8pw6/Do8OnZ1xwwoPCjAzDsUfCpWkMPMOdFzXChEDCl8Kgwq5TwoXCgyfDpGB3w4PCicKMw4M1f8O/w4pSdMOMwpReAMO7wonCj8KpwqsOc8OKATvCr8KCVytlMDxlw4J+wrnDvcK8woUae3J9wp0cw5TCgMO2wqzDkcOcw43DvAbDpwJ+ahPClsOSwqwhAldyfcOGL39GdGTCmMO4NzANwojCnV3CqzbCnjHDg8Onw5lMwq3DtnrCrD0qw5tqK8Kbw4LDvRLCocKcFsOhc8OmwqtjSypHEw4vA8Kiw4UGwpfDpsOZSF4Ew7tWwoDDqSk0wrZrw43CtcKzTkoGwr7CvAnDkmFhDcKow4bCrlrCuAhVwrfDilE6C8O+VWnDj29Yw5ZLwoRLYkPClR3DqhMmwqzDhTPDisKNTcKzG8Oxw4HDiRU=',
    'wobDgR7Chjg=',
    'wqBCOw==',
    'wpdpWVfCrsKSwrLDj8OQw6pLw5wmwogAwq/Dq8KTO8OkwpDDsMKPw4AEw4TCt8OIwoHCpcKlWMOzFUItw5xmw6bDjsKrwojDmw==',
    'MMOxag==',
    'woZKSAzChMOKw6zDncKI',
    'wr4zw43ChcO7',
    'wrLDhg/Cqg==',
    'wpB2w5TDhnca',
    'E8O0w4Jqwqk8GsOuIA==',
    'wplRXQ==',
    'wp3CoVdmw6c=',
    'woTDqXg3w57Drg==',
    'w4wTNsK0LQ==',
    'Y8KHwqYE',
    'w5bDi8Oqw65uZsKJFA==',
    'wrkBwrXCgQTChcKIYMO1w4fClSPDncKFwoUBwodjwqRYb8OJw4DCqiTDj11tw70LLRwIA1Fww4XDmsOOw6XDhxxHw5TDgSTCjcK4wrEdwrDCo8Ojw6U=',
    'A0/Dq8OCw5fCp8ObwpM0FMO/wrXCuQ==',
    'H8OYw6xcwowUGsKzZ8OewrsSacK7OcK4w4zCl8OeciYuEALCsGTCtDcLU8OLwrXCvMOmNUI5E8OATVtIw5p0bDsbO8OALAHCkWfDg8OSCcOlwqnChMKUwrgCw7XDpcKIe8Kfw68zwrFbwo45wrvDlVTChWFYZQbCo33DnFMMw5bDsSphVDXClgtMd8OxdC/DvkTCgl3DkQfCp8OiwrMHwrhiD8OUw74pRcOCInbCqMK3GF7DlnXCl3TDssOGw6dAwrTDqMO9w6/CgGw=',
    'w5FHTVHCnA==',
    'wqV7ezLCvQ==',
    'wr4Aw6V4w4k=',
    'w5zDucK+w5TDisOtw4zDix4h',
    'JDRQ',
    'fcOmYMKcw7tz',
    'C8KLwqfDl8OHTDM=',
    'woLCqF1fw4o=',
    'wp3Cs0zDosOzPQ4=',
    'ASx7w7YhJVU=',
    'w6zChMO3w6U=',
    'HMK/w6LCpls=',
    'NsOWw6JU',
    'wpbCoXPDqMOdOgbCkw==',
    'w5vDs8K8w6HClcO+',
    'wpXCoVLDqcOi',
    'J8Oca8KxZcO0',
    'woTCoXLDvsOx',
    'wrRWN3fCgw==',
    'wrrDiBw=',
    'wp1jw5PCj25cwrXCvBIXYDg=',
    'B8Khw4HCtHgLwqnCksKWwp5yQm3DiXrDu8OLVsOw',
    'XnI4w47Dv1JsNMKYEFUlJcKKw4Ynwqo=',
    'wpzCvn5swqh2dcO8HWM=',
    'w5bDsFTDkkbCvGwlw6NYRMOXMsKDw4NuTSjCvi3DvlgzwrgldMOow5Jhw4bCv8Ktw60=',
    'NMO6fGDClCAXwoXCv3zCplbCh8O4WjfCmVokH8OOw4pow7lsw73DkS4ZRjAjw4BgO04Mw63CnMO/Rh5kIm7CmsKnJMKwaMOMwpPDmcK6TXcoJcOlw5vCmMKjW23CrATCoh7CqsKZIVYDCsOjwqXCsVgUEcOPJgbDtlt+aDfDl1gzwpfCm8OzwrEHDcOxwpzCrcORXwzDilUtMcO2FVAHEhAMwopuUsOwLMKoQCrCn8O2MVrDo8OnXkrDjgsXAsK5CxjDo8OuPsKWawBVwowjw6bCsxTDv8OaHMKFcMKbSsK0M8OgA8OScMK2wq8ZcMOjw7MZw7LCjnNXw47DviXDscOCb8ORE8OtDsK6wqTDk8Omw6ICY8OwKMOSw4EZw4BSwp1pc2JNODrDlDxRw5PCgWZgEsKGw6bDvE9/WsKPw6TCs3R8SVLCicOcNMKzwoQHJjDDgVcbR8K+JEPCtm0jwpfCnxnClMO5wrbCvcKmKx3ComIeKW/Cq8OQVcK6w4HDmkclwrnClX7DnFnDgVRZUcKCwoHCrFQFUcK6w6ZJw53Cg8Obw7kSw6U=',
    '44OB5o6l56e744Og6K6A5Ye36IyQ5Y6Z5Li05Lq+6Lae5Y615Lqtwo/DhATCiCTCoj3nm7bmjYPkv4rnl7EPw5JgesOcHeeahuS7meS5uuesm+WIjuiPqOWNlA==',
    'H292Wy/CiMOxw7TCh1vCr8OLwo3DvBTCm8KcPRjDjhgjwpPDpArDlhbDi8KxBMKAw5sSM8O6PsOdBcOyfUzChBE=',
    'w4ZCChnDmMORwrHDh8OA',
    'w4oPP8K+Jz9K',
    '5p+a54Oj5Ye15pWd6I2D',
    'w4x/QA==',
    'w4lKZsOg',
    'ShfDikrCsA==',
    'woFoLULCiw==',
    'QDl4GsONP8KOwp/CnRk=',
    'wr81wq0=',
    'wrrDqcO+ARvCv8KiQMKZ',
    'UhPDs2DCsQ==',
    'wrR9bjrCo8Opw6TDicKD',
    'HMKow4Evw4M7',
    'wo8Rw6vCqcOXwrlOw7jCtw==',
    'Ak/CqMOEw5PCpg==',
    'wrvCpw4=',
    'w5zkuLnluK3pkZvnsorkua/kuY3libA=',
    'w5DDpcKuwqXDr217e8Kk',
    'w41pw4bDmj8Z',
    'w53ClsOmw7YEPA8A',
    'wpw1w7RSw4s=',
    'wqpGO27Cgg==',
    'w5zDr1zCpxU=',
    'cnkgw5DCng==',
    'EMKdwp/Dm8OPQTg=',
    'w7/Dj8KZwpHDqEh3bA==',
    'fcOmYA==',
    'wpENw4xOEULDn+W/g+WltOOAhOS6vuS6iui3muWPpw==',
    'bHs0w4zCnRNlNA==',
    'w5HCgMKAdHjDkcOpGMOBwrw=',
    '44O45o2W56Sl44Gjw4/Ds0s7w6Zi5bSr5aS55pWD',
    '5Lm65Lq76LWd5Yy8',
    'wr/DiR/CrhA=',
    'wqLCqH5uw4t2dMOw',
    'wq3orp3phoHmlb3nmL3lvI3ojpjljqbChGDDh8O+EA3DjjF+w4YMwoEgwroqZ8Ovwphoe8Ktw6XDs8OYw6bDlFbCrgvCicO0wqHDhMKmNcOqES7DgcOWXMOEw64M',
    'HmhMRDjDlw==',
    'BH5sTxLDncKqwrLCg0c=',
    'w5/Dr0XCoQ==',
    'OFFzfTHDt3nDnQ==',
    'wqEow7tvw6s=',
    'wqlgw5/Dk00TwrLCvQ==',
    'ZOivnemEi+aUk+ebnOW+m+iNguWMrzNVw7PCscK9wo4=',
    'w69uw6vDiwA=',
    'SRh3CsOi',
    'wqbDhgnCuA0=',
    'wpRnw47DkXBIw7DDt10EZnvCvS/DhsKcw43CjcKAbxY1woTDgMO0V8Kzwo7CgBRVfsKeXw==',
    'w5BWUcO7bQ==',
    'wp/DhhHChR4=',
    'd8OETsKSw4E=',
    'w7DDtUPDv0g=',
    'w4RnQ8OAwoI=',
    'bsOJYMKtO8KwwqhBw7V/LMOVHBTCqcOvw4ERwoVqFcKFAGo3eQ0CHMO7',
    'w7ZCwr/Dphg=',
    'GyRzw4vCoBd6H8KfEVFzesKEw4Rpw7rCtBtDHcOmw5Y/w59abyjCqikPw4DCq8O8w4fDn8KiZwzDrA==',
    'w5vDuW5vw6BlScO8CCQ4PcKVw5xDD8OKwolow5ZaGWNQwqsgVX/DmMOtMkhzBCfDssKKYQFVQmbCl8KISQ==',
    'bi56w7FowrMDw5XCnMOYb8KhP8OscsOYw5zCv3fCusKiaA7CmMKEwoE1w4Yawq1Iw7UXFhfDi8Kx',
    'wrDDlloYYQ==',
    'wqfCpxpH',
    'GUxmQTk=',
    'Yglkw7Nu',
    'FcKRw5TCsGo=',
    'wo3DhX8N',
    'w7dCwogDTwA=',
    'JzBQw4s=',
    'w6BPw7zDogI1',
    'HlJ6Zgs=',
    'JVYkw4xMw7A=',
    'wqXCvmg=',
    'wr3DkMOkLxA=',
    'P0dl',
    'UwnDvcKOEMOC',
    'FG7Cp8OXw4Y=',
    'w4VtU8KH',
    'cMOqc8KQw40=',
    'RD1/Cg==',
    'JBlGw4RH',
    'w4HDncOuw7I=',
    'HMO5fGjCig==',
    'wpXCvnpy',
    '5LqV5LiU6LW35Y2J',
    'UTl3EA==',
    '5Luo6LGzWg==',
    'KzBXw6V3w4xIXAdyw5Uzwrx7',
    'I8OWw7ddwoc=',
    'dcOabcKrw7w=',
    'woTDgXgfTsKHw5g=',
    '5Lq95LqV6LSh5Yyu',
    'B1nCiMOMw4PCqw==',
    'O8Obb8KwSMOvw7pEw71h',
    'wqpUKA==',
    'wpJyw5fDhA==',
    'PsKuw6ggw5E=',
    'csOoc8K6w6E=',
    'w6TCisOk',
    'wosL5aS66Lagw4/CteWOruWZj8KIw4o=',
    'FMKiw4Et',
    'MiY8w70rw7UbwobDiMOUNcOzfMKiNg==',
    'woJGfATChMOew4zDlcKFw6nCu3YPXsKjw6rDpsOowrsRLcKLwpxNw6pUw4BjFsKNw7HDsSjCvVs=',
    '5bSk57mo5a+35oub6Leb5aWN55qI5LuE5Yi55Lim',
    '6I+O5Yy45reo5Yic5Y2q5pWY5aWn6LSh',
    'AsKkw5wj',
    'wrkzw5bCgg==',
    'wrzCum1kw7U=',
    'HE3Cr8Ovw4I=',
    'w4the8OZ',
    'BChmw6E=',
    'FcKBwrQ=',
    'wrYXwq8Kwrk=',
    'w73DicKd',
    'w7XDtk/DtW0=',
    'wqnDult0CsKbw77CmGE=',
    'w63Ci8Omw7YtJDQEwrPCo2Y=',
    'w5nCkHDCmsO3LGY=',
    'dMOnY8KNw6BseQ==',
    'w5JvZQ==',
    'QR7DqMKVF8O4GcOicg==',
    'wp3Di8OELR7ClMK1V8K9w5cTC2E=',
    'wqklw6tlw6HDgMKDJho=',
    'IVs1w41iw43CmMK1RH8j',
    'w4pMFHHCncOQecKqwpI=',
    'wqbDlRLCsQ0Bb1DDqsOFw7IBX8KaQg==',
    'w5HDkcO8w7c=',
    'bWMiw43Chg==',
    'w6xGwo8Q',
    'IjJQw4Vyw6t2SAc=',
    'w67ChMOtw7cGMhQAwonCt28ew5I=',
    'w7pEwpInVAbCk8Kqw5g=',
    'wo9vRF3CuMO7w77Cj8ODw792woU7',
    'wrdVJnfCj8OjGWvCtcOVw7PCiXXDtg==',
    'WcOeTMK/w6A=',
    'w6HCknLCnMO/',
    'w6YpGMKSDxw=',
    'H30kw5fCt08=',
    'aTbDqWI=',
    'w7zDscKAwpvDiA==',
    'LcKjw57Cj0k=',
    'wq8xw4vCmcOswrRBw6zCqg==',
    'N8OZw7NHwocBLcO9PsKFw64=',
    'wqnDultYF8K8w7bCl2k=',
    'wrNgw7LDtW4=',
    'w5nCkHDCvMOrA2d6QA==',
    'wovDmMODJDfCtMKtV8K4w4IeCnHCnQ==',
    'w7/Di8KQw4LCjg==',
    'w4JGwpArXQ==',
    'wpA2wpXCrj7Duw==',
    'M8OUw6JawpIxFcO6PQ==',
    'G1/Cr8OH',
    'X8KKwqHDlcOffC90w413wpJT',
    'wqQ7wqMf',
    'wqI9w5g=',
    '5byN5YuT56ey5YiWw4Q=',
    'wpbCuG9zw7ded8OzBA==',
    'w4FKZcO2wqLDukfDisOkwot7R8OK',
    'wrAWwrXCngXDtsOJKcO3',
    'wrY0wq8ZwpNlw5crwofCsXA=',
    'RC1BBMOm',
    'Fnh2RC7Du8Kwwr3Cig==',
    'wo/DhWUfY8KPw4vCncOkXsOswrh9',
    'wonDpWsdw57DlUo2w6A=',
    'wo3DqHoAw4vDpXIxw6Nywrw=',
    'QR7DqMK5CsOfEcOteg==',
    'w4HDvEHCvhjDvAk6KsOic0AQUMK5',
    'GwLDvy5cNsKKw43Cog==',
    'w6tVwo8eXjzCncKxw5pxQcOiwp1kZgI=',
    'w6BPc8K5Yw0=',
    'N8O8csKww608',
    'wprDicOeMSDCssKtVMKE',
    'VQjDtcKe',
    'wqpOw6DDpAEJEMOTKhlrQw==',
    'B8Ksw4Y8',
    'NcKowoHDssOx',
    'A8KEw4kPw5Q=',
    'w5vDr0M=',
    'wpXCo3TDhMO6Mg8=',
    'dTJhw7FVw6hBwp8=',
    'woPmtoPliKflta7nu6jnu5vmnrA=',
    'wr/DoWl6FsKhw5nCkHpIbsOKwpAJRzRJwqBZw5bDlS9vasKBHVHCmMOoaU7DoWfCtMKhazU=',
    'w7/CncOFw6UkLisLwqvCs3Eqw5TDvcK2w64WwpIfKX7Cs2xpa3HCmMKfGTdsdcKwbSPDk0TDlEE=',
    'wobCrMKnwp3Cm8K0w5zClhRyFV/CtcK8dcKyQsO+w4vCssKMw6E=',
    'wqHDnz3CqgYhRVHDrMOFw5QoTsKLTnvDgkY/I8Kfw5DDtcO4w5Uxw7IDIMOmAMKgw7EwLcO6wqZzFxk9',
    'RzfDlMKwIA==',
    'wqLDlgLCoS4=',
    'ZsOxQcK4w6dyVUrDnMKMLsOowq7DrAnCvMOgAGJjw43CkxA3wpVWOAlWSsOgZg==',
    'w5FVSMO8bw==',
    'wp44wroSwq0=',
    'wovDq0dIAQ==',
    'w4ZpJWPCqg==',
    'w5zDm3LClTk=',
    'F8KHw6cCw7I=',
    'w4TDv8KLwpTDnw==',
    'w69jwqMTVA==',
    'w5xsw6PDhAA=',
    'w5R0dMK0fg==',
    'wosuwociwqU=',
    'QR7DqMKTE8OYA8O9VMKxGw==',
    'w6psNG3Cu8O6',
    'dMOHw79bw50=',
    'w5LCq8Oxw48w',
    'wpB8w50=',
    'HlZkZhHDsX3DnsOS',
    'CgDDuTJL',
    'S20iw4vCvwY=',
    'MThXw4E=',
    'ajVp',
    '5b6I5aSu5ouk6KOIag==',
    'w4TDtMK0w5TCqcOtw43Dhw==',
    'wpHnmIrku5PliaU=',
    'GMKtw7PCpWVCw4/Dk8KKw44ubiDDl3fCusOGeMO+wp48PExDw6DClgDDn8KVesK8w5rDiVTDhcKZ',
    'wpHDtVHDl0vDog==',
    'GFd/aw==',
    'wqUUwrLCmkbDrMOOKMO2',
    'wo/DjWUFXMKIw5jCnMOxUMO1wqNs',
    'w6vDiEXCqxE=',
    'wrbCqx1aWH/DqcKrwq92wqk=',
    'w67DrFpyHMOv',
    'w4LDm8O7w7NVQcKBHcKf',
    'wpzDkWII',
    'w5ALJcK5',
    'wrzDuFxwSsKQw6LCkXlqc8OkwpcO',
    'w5LDgGzCnS4=',
    'wpHCsnV1w7Z/fMOxKGl3ccOD',
    'w4XDr1vCrzrDgAUxFMOuVFw=',
    'w5LCo8Ouw6sm',
    'VwXDmsKbC8OCPsOqacKwVFhbXFzCmEXDpMKBwpjCkU3DnMOQCkNUw4DCvXfCgTBpwrHCh8OCMhfChMO1wqg=',
    'wpRdTgzCnMOEw7HDgsK4w6jDtA==',
    'wrXCg1TDksOdEA==',
    'bsOLdMK9YsK9',
    'w61Jw6bDqgQUB8OFIA==',
    'wrvDslpSHA==',
    'w69GwpUPCCnCkcKnw7x1YMOi',
    'X2E/w5fCoBptNcK9E0E/NA==',
    'N2kcwrhsCQDDojJVwrrCjg==',
    'w4lwXsOERsK1Lw==',
    'wqM/woUfwoM=',
    'w5fDp0bCrQ7Dhw8x',
    'w5ZPR8O6QQ==',
    'Uj9iF8O1OcKOwo/CsgTDkA==',
    'wokFw4tVw5rDjQ==',
    'BgjDqcKTAcKM',
    'woEZJ8K4DzwS',
    'CQrDvghK',
    'AHprXw==',
    'YDNgw6how6FJwp7CvsOHc8OhOQ==',
    'wqc7wrkAw4BPw6krwpnCoQ==',
    'w65XwqoNVgHCgQ==',
    'w7NxR8OcUQ==',
    'w4hhYcOGH8KPMzASw64=',
    'w6TDlsK2wpPDi0Bu',
    'UivDt1fClw==',
    'wpLCg1DDosO1',
    'ZSRRw4Nkwp8=',
    'ImsbwrwtAQrDoB4=',
    'VxzDtcKO',
    'Byh8w757E1UDw7zCqTQ=',
    'wqzDmkBpOQ==',
    'EXJsQi/DmsK7wr/CplHCu8OLw5c=',
    'A3pxQGnDoMK7wrbCjFDCqg==',
    'w43Cg0jCusO0I30=',
    'wq1FOWLCiA==',
    'w5PDt0zDs3Y=',
    'w5nCkHDCusOvI31lZsOfAg==',
    'wpbCiz1sZ1I=',
    'w4/DkX4FS8Od',
    'w4TDu0HCoA==',
    'woDCunJo',
    'w4PDoVfDlRnCmGglw4lYX8KIN8Ke',
    'XSpBCMOT',
    'Byh8w754BlUaw5bCqCVROcOc',
    'wqPDlzfCogU7eA==',
    'wrrDhUs4w6U=',
    'w4hhYcOGHcKbPiUjw6QZWmDDtQ==',
    'w7zChMOww68JMhcVwrDCuEoFw5HDpsKTw6gLwqc=',
    'wr8/wqQMwoB0',
    'wojDusOtFAY=',
    'WGslw5fCpRt8KMK3GAk=',
    'wqnDhUstw6XDmA==',
    'wr1SwpMNX1U=',
    'TH04w5o=',
    'wrfDhcKVwo/DlkZ0QMKyWg==',
    'w7zChMOww698GgcRwpzCuXYbw5jDpw==',
    'A3pxQB/DncKrwqvCilDCh8OLw4XDvnbCmMKLZw==',
    'w69Fw6fDtRkzIMOH',
    'w4XDr1vCr0rDog8wLMOXS0kBUMKKw6I=',
    'JThKw4Nzw4p9Sittw4Uvwrw=',
    'VBzDr8KRUsO8EsOhacKFSnhbTWPCmA==',
    'wrJXA2TCh8OeGg==',
    'w6bDhMKXwqPDhA==',
    'w4DDv8KQwpTDtA==',
    'wpIZwp40wr1Y',
    'w53Cik3CkcON',
    'MCFIw4N0',
    'woTCs3Rsw4x5f8O6PUk=',
    'w4TDqEvDjmbCsWs+w5x4',
    'woDCoXPDpsKjGQXCmcOtw4rCuTpjZMODJg==',
    'CkvCssOC',
    'N2kcwrhoBQHDowVkwqTCm8O4w7PDmVs=',
    'TWkiw5XDpTVtJcK9E0EhL8OI',
    'HcKPwqfDlQ==',
    'wqZEO2LCmMO+AGLCiQ==',
    'w5bDv8Kvw4vClcOFw47DhAc=',
    'HgDDvyA=',
    'ZcOodMKywr1SdEXDmsKM',
    'w61Jw6bDjBg7Bg==',
    'wozDp2sT',
    'w4PDvcKow4/DksOew4XDjwEqDQ==',
    'wpFfTgQ=',
    'w69GwpUPDjrCkMKuw5Z6dg==',
    'wrfDhA/CiAc8albDvw==',
    'w7XDh8KOwps=',
    'Uj9iPcOsPsKcwp/CnA==',
    'cjt9w6oow4hIwp7CvsOJdMO7',
    'wrc7wr4K',
    'w5MLP8KmdBpdH8O5T8Ocw6UEDQ==',
    'w5hhZsOM',
    'w7zChMOww697DgsCwrE=',
    'LMOfdcK1',
    'JsOWw6Vew5ErEsO7PA==',
    'ajVpw4Rpw7s=',
    'N1AkwpJmw5vCocK/QW8=',
    'w4MYLcK6CTM=',
    'Fg7DrA==',
    'w58hK8K6Ng==',
    'AxnDpxBC',
    'wqDDvE5/HcKgw6M=',
    'wovDvn1DOg==',
    'woXDi2w=',
    'w5hbElvCnMOZdsKlwow=',
    'w6HDh8KIwonDgw==',
    'w7NOElrCvg==',
    'dDNECsOg',
    'wox4WQrCvsOHw7LCi8OYw78=',
    'w5Zve8OD',
    'w4B9w4fDizM=',
    'IFQkw54=',
    '6Kyf5rOE5q285bmK44Ku',
    'Vz1iHw==',
    'w48LP8KCMTZ/AsOheMOWw7gUBw==',
    'wrbCkCZHYg==',
    'HhPDqjZhFA==',
    'XWklw58=',
    'KlQ9w5o=',
    'ThzDscKf',
    'Ew/DryRWMMKC',
    'w4JBBFfCig==',
    'w57DrkDDm1c=',
    'wpV9w57DhHs=',
    'G8KLwrLDmg==',
    'KmYLwrYn',
    'KsObYMK6',
    'wrPCqR1S',
    'wrE/wqsFwrppw6w=',
    'wro0wq4Owow=',
    'w6XCgMOww7crOgc=',
    'wpbDj8OZLTPCnMKm',
    'woHDqHsXw5Q=',
    'Gn5xWD3DlcK7',
    '5oK75ZS75LmW5aad772k6I+l5b6bBQ==',
    'wrfDhA/CggY0Yw==',
    'w5RDZMO1wqDDtFzDig==',
    'w7DDjXzCmzTDqw==',
    'YlQ0w4xqw4HCvMK3TTcyw7lkCcO8cMKlwoLCv0fDjsO9',
    'wpjCr2c=',
    'wo90Qxo=',
    'A8KDw7jCr3E=',
    'O8ObYsKmY8O0w55Ew7U=',
    'w5lpLWLCvQ==',
    'RCRXHcO3OcKVwpjCuA/CgMO2XcKsw5suQMK7wq/Cnh8pwrNgw4rDsQ==',
    'wqtIKA==',
    'Yjt6w6A=',
    'HyZo',
    '55aP5oic44Cb',
    'aTDDpXTCnyg=',
    'wofDjWgHYcKBw5DCnQ==',
    'wpXDg8OJNTPClsKm',
    'wpvCtHw=',
    'wqtIKEjCmMOF',
    'wqVaw5HDgFo=',
    'w6vCkMOww7AlMAcXw7DCsWYfw7rDsMKPw6gWwrQ=',
    'H0XCtcOSw4w=',
    'wpRkA3XCpg==',
    'wrJUKn/Co8OTUw==',
    'BSxhw7ErM3kK',
    'bsOKbsK/Y8OuwrM=',
    'w4vCh3bCusO3LWB6Vg==',
    'SWkjw43Ctg==',
    'wprDo2wHw4DDqA==',
    'wox4TlXCuMOcw43CicOf',
    'N1Azw41gw4DCnsK9Rg==',
    'w4LDq0vCthjDmzo8Ng==',
    'jsjzylqdiGtamVi.cItom.lv6DfXSH==',
  ]
;(function (_0x7489ff, _0x3ea78a, _0x1b625a) {
  var _0x1dabf5 = function (
    _0xff3787,
    _0x22a586,
    _0x1a33f3,
    _0xb8caa0,
    _0x3b1f57
  ) {
    ;(_0x22a586 = _0x22a586 >> 0x8), (_0x3b1f57 = 'po')
    var _0x59a24c = 'shift',
      _0x4d4d65 = 'push'
    if (_0x22a586 < _0xff3787) {
      while (--_0xff3787) {
        _0xb8caa0 = _0x7489ff[_0x59a24c]()
        if (_0x22a586 === _0xff3787) {
          _0x22a586 = _0xb8caa0
          _0x1a33f3 = _0x7489ff[_0x3b1f57 + 'p']()
        } else if (
          _0x22a586 &&
          _0x1a33f3['replace'](/[zylqdGtVItlDfXSH=]/g, '') === _0x22a586
        ) {
          _0x7489ff[_0x4d4d65](_0xb8caa0)
        }
      }
      _0x7489ff[_0x4d4d65](_0x7489ff[_0x59a24c]())
    }
    return 0x77249
  }
  return (_0x1dabf5(++_0x3ea78a, _0x1b625a) >> _0x3ea78a) ^ _0x1b625a
})(_0x1861, 0x7c, 0x7c00)
var _0xfff9 = function (_0x54a205, _0x6edf5a) {
  _0x54a205 = ~~'0x'['concat'](_0x54a205)
  var _0x280da1 = _0x1861[_0x54a205]
  if (_0xfff9['zmSTBn'] === undefined) {
    ;(function () {
      var _0x2fc8ca =
        typeof window !== 'undefined'
          ? window
          : typeof process === 'object' &&
            typeof require === 'function' &&
            typeof global === 'object'
          ? global
          : this
      var _0x5eb623 =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
      _0x2fc8ca['atob'] ||
        (_0x2fc8ca['atob'] = function (_0x1d0ee0) {
          var _0x27b964 = String(_0x1d0ee0)['replace'](/=+$/, '')
          for (
            var _0x4f1696 = 0x0,
              _0x2bd491,
              _0x5d6d38,
              _0x4f2a19 = 0x0,
              _0x5e2cc8 = '';
            (_0x5d6d38 = _0x27b964['charAt'](_0x4f2a19++));
            ~_0x5d6d38 &&
            ((_0x2bd491 =
              _0x4f1696 % 0x4 ? _0x2bd491 * 0x40 + _0x5d6d38 : _0x5d6d38),
            _0x4f1696++ % 0x4)
              ? (_0x5e2cc8 += String['fromCharCode'](
                  0xff & (_0x2bd491 >> ((-0x2 * _0x4f1696) & 0x6))
                ))
              : 0x0
          ) {
            _0x5d6d38 = _0x5eb623['indexOf'](_0x5d6d38)
          }
          return _0x5e2cc8
        })
    })()
    var _0x4d0cc6 = function (_0x4276ae, _0x6edf5a) {
      var _0x42a2fa = [],
        _0x3b3278 = 0x0,
        _0x192a59,
        _0x46c643 = '',
        _0x1e2015 = ''
      _0x4276ae = atob(_0x4276ae)
      for (
        var _0x3cfa3b = 0x0, _0x218457 = _0x4276ae['length'];
        _0x3cfa3b < _0x218457;
        _0x3cfa3b++
      ) {
        _0x1e2015 +=
          '%' +
          ('00' + _0x4276ae['charCodeAt'](_0x3cfa3b)['toString'](0x10))[
            'slice'
          ](-0x2)
      }
      _0x4276ae = decodeURIComponent(_0x1e2015)
      for (var _0x3d288b = 0x0; _0x3d288b < 0x100; _0x3d288b++) {
        _0x42a2fa[_0x3d288b] = _0x3d288b
      }
      for (_0x3d288b = 0x0; _0x3d288b < 0x100; _0x3d288b++) {
        _0x3b3278 =
          (_0x3b3278 +
            _0x42a2fa[_0x3d288b] +
            _0x6edf5a['charCodeAt'](_0x3d288b % _0x6edf5a['length'])) %
          0x100
        _0x192a59 = _0x42a2fa[_0x3d288b]
        _0x42a2fa[_0x3d288b] = _0x42a2fa[_0x3b3278]
        _0x42a2fa[_0x3b3278] = _0x192a59
      }
      _0x3d288b = 0x0
      _0x3b3278 = 0x0
      for (var _0x1a81ab = 0x0; _0x1a81ab < _0x4276ae['length']; _0x1a81ab++) {
        _0x3d288b = (_0x3d288b + 0x1) % 0x100
        _0x3b3278 = (_0x3b3278 + _0x42a2fa[_0x3d288b]) % 0x100
        _0x192a59 = _0x42a2fa[_0x3d288b]
        _0x42a2fa[_0x3d288b] = _0x42a2fa[_0x3b3278]
        _0x42a2fa[_0x3b3278] = _0x192a59
        _0x46c643 += String['fromCharCode'](
          _0x4276ae['charCodeAt'](_0x1a81ab) ^
            _0x42a2fa[(_0x42a2fa[_0x3d288b] + _0x42a2fa[_0x3b3278]) % 0x100]
        )
      }
      return _0x46c643
    }
    _0xfff9['pCAyJd'] = _0x4d0cc6
    _0xfff9['RbIiDH'] = {}
    _0xfff9['zmSTBn'] = !![]
  }
  var _0x3078b0 = _0xfff9['RbIiDH'][_0x54a205]
  if (_0x3078b0 === undefined) {
    if (_0xfff9['YcMFfi'] === undefined) {
      _0xfff9['YcMFfi'] = !![]
    }
    _0x280da1 = _0xfff9['pCAyJd'](_0x280da1, _0x6edf5a)
    _0xfff9['RbIiDH'][_0x54a205] = _0x280da1
  } else {
    _0x280da1 = _0x3078b0
  }
  return _0x280da1
}
!(async () => {
  var _0x2735de = {
    lVCVF: _0xfff9('0', 'BZUJ'),
    IajNv: 'application/x-www-form-urlencoded',
    fMIKH: _0xfff9('1', 'J$Ct'),
    hxSGz: _0xfff9('2', '#)]j'),
    GugAg: _0xfff9('3', 'AEOi'),
    CXSOD: _0xfff9('4', 'lvI9'),
    cLHEl: _0xfff9('5', 'Xp68'),
    YrQtN: 'application/json',
    VTJLf: _0xfff9('6', 'an[X'),
    FObOa: _0xfff9('7', 'AlWf'),
    gHbnG: function (_0x469197) {
      return _0x469197()
    },
    NPsfg: function (_0x354f0d, _0x244e95) {
      return _0x354f0d > _0x244e95
    },
    TskXX: function (_0x181804, _0x5f41d7) {
      return _0x181804(_0x5f41d7)
    },
    KqqnM: function (_0x5ba678, _0x2acd62) {
      return _0x5ba678 + _0x2acd62
    },
    dSjru: function (_0x2d369c, _0x1262f0) {
      return _0x2d369c !== _0x1262f0
    },
    fPENL: function (_0x3fbffa, _0x4e2b84) {
      return _0x3fbffa < _0x4e2b84
    },
    nXyqA: _0xfff9('8', 'lt!%'),
    FzNqB: function (_0x5a595a, _0x3841d7) {
      return _0x5a595a === _0x3841d7
    },
    Bgaxn: function (_0x161238, _0x43763e) {
      return _0x161238 > _0x43763e
    },
    qaahg: _0xfff9('9', 'jqZh'),
    NcGhf: _0xfff9('a', '3GC9'),
  }
  if (!cookiesArr[0x0]) {
    $[_0xfff9('b', '9)F5')](
      $[_0xfff9('c', 'e5b7')],
      _0x2735de[_0xfff9('d', '1KRL')],
      _0x2735de['FObOa'],
      { 'open-url': _0x2735de[_0xfff9('e', 'j(RL')] }
    )
    return
  }
  await _0x2735de['gHbnG'](getACT_ID)
  $[_0xfff9('f', 'g7q)')] = ![]
  $['bean'] = 0x0
  console[_0xfff9('10', '3GC9')](
    '共有' + $[_0xfff9('11', 'h0wm')]['length'] + '个店铺粉丝互动'
  )
  if (
    _0x2735de[_0xfff9('12', '1KRL')](
      $[_0xfff9('13', 'lt!%')][_0xfff9('14', 'n7jh')],
      0x0
    )
  ) {
    for (
      let _0x1a0a30 = 0x0;
      _0x1a0a30 < $[_0xfff9('15', 'mF9u')][_0xfff9('16', '5r%e')];
      _0x1a0a30++
    ) {
      console[_0xfff9('17', 'hY&d')](
        '开始第\x20' + (_0x1a0a30 + 0x1) + _0xfff9('18', 'BZUJ')
      )
      $['ACT_ID'] = $[_0xfff9('19', '[CHV')][_0x1a0a30][_0xfff9('1a', '56OG')]
      for (let _0xa58173 = 0x0; _0xa58173 < cookiesArr['length']; _0xa58173++) {
        if (cookiesArr[_0xa58173]) {
          cookie = cookiesArr[_0xa58173]
          originCookie = cookiesArr[_0xa58173]
          $[_0xfff9('1b', '*VX*')] = _0x2735de[_0xfff9('1c', '2RW5')](
            decodeURIComponent,
            cookie[_0xfff9('1d', 'j(RL')](/pt_pin=(.+?);/) &&
              cookie[_0xfff9('1e', '2W9m')](/pt_pin=(.+?);/)[0x1]
          )
          $['index'] = _0x2735de[_0xfff9('1f', '#)]j')](_0xa58173, 0x1)
          $[_0xfff9('20', '%KTG')] = !![]
          $[_0xfff9('21', '[CHV')] = ''
          await checkCookie()
          console[_0xfff9('22', 'JmR&')](
            _0xfff9('23', 'o0oz') +
              $['index'] +
              '】' +
              ($['nickName'] || $[_0xfff9('24', '#)]j')]) +
              _0xfff9('25', 'h0wm')
          )
          if (!$['isLogin']) {
            $['msg'](
              $['name'],
              _0xfff9('26', 'eBa0'),
              _0xfff9('27', 'Eatb') +
                $[_0xfff9('28', 'Eatb')] +
                '\x20' +
                ($['nickName'] || $[_0xfff9('29', 'AEOi')]) +
                _0xfff9('2a', 'jqZh'),
              { 'open-url': _0x2735de['FObOa'] }
            )
            if ($[_0xfff9('2b', 'AlWf')]()) {
              await notify[_0xfff9('2c', 'AlWf')](
                $[_0xfff9('2d', '2W9m')] +
                  'cookie已失效\x20-\x20' +
                  $[_0xfff9('2e', 'f*YU')],
                '京东账号' +
                  $[_0xfff9('2f', '2RW5')] +
                  '\x20' +
                  $[_0xfff9('30', 'BZUJ')] +
                  _0xfff9('31', '5r%e')
              )
            }
            continue
          }
          if (helpAuthor) {
            function _0x5399eb() {
              var _0x158ff1 = {
                cDyNv: 'https://api.r2ray.com/jd.bargain/index',
              }
              return new Promise((_0x218e2d) => {
                $['get'](
                  { url: _0x158ff1[_0xfff9('32', '56OG')] },
                  (_0x3eedd1, _0x51bc13, _0x3b0145) => {
                    try {
                      if (_0x3b0145) {
                        $[_0xfff9('33', 'g7q)')] =
                          JSON[_0xfff9('34', 'Eatb')](_0x3b0145)
                      }
                    } catch (_0x427eaa) {
                      console[_0xfff9('22', 'JmR&')](_0x427eaa)
                    } finally {
                      _0x218e2d()
                    }
                  }
                )
              })
            }
            function _0x41174b(_0x3360bb, _0x1c1134) {
              let _0xedb951 = {
                url: _0xfff9('35', 'BZUJ'),
                headers: {
                  Host: _0x2735de[_0xfff9('36', 'WTmA')],
                  'Content-Type': _0x2735de[_0xfff9('37', 'Eatb')],
                  Origin: _0x2735de[_0xfff9('38', 'JmR&')],
                  'Accept-Encoding': _0x2735de['hxSGz'],
                  Cookie: cookie,
                  Connection: _0x2735de[_0xfff9('39', 'lvI9')],
                  Accept: _0x2735de['CXSOD'],
                  'User-Agent': _0x2735de[_0xfff9('3a', 'e5b7')],
                  Referer:
                    'https://h5.m.jd.com/babelDiy/Zeus/4ZK4ZpvoSreRB92RRo8bpJAQNoTq/index.html?serveId=wxe30973feca923229&actId=' +
                    _0x3360bb +
                    _0xfff9('3b', 'AWac'),
                  'Accept-Language': _0xfff9('3c', '56OG'),
                },
                body:
                  'functionId=cutPriceByUser&body={\x22activityId\x22:\x22' +
                  _0x3360bb +
                  _0xfff9('3d', '#)]j') +
                  _0x1c1134 +
                  _0xfff9('3e', 'AEOi'),
              }
              return new Promise((_0x2db4fd) => {
                $['post'](_0xedb951, (_0x1a649e, _0x5133fd, _0xde7b9d) => {
                  if (_0xde7b9d) {
                    $['zRes'] = JSON['parse'](_0xde7b9d)
                    _0x2db4fd()
                  }
                })
              })
            }
            function _0xab5498(_0x667510, _0x4b7ec8) {
              let _0x167ff6 = {
                url: _0xfff9('3f', '7r0t'),
                headers: { 'Content-Type': _0x2735de[_0xfff9('40', '&up0')] },
                body: JSON['stringify']({
                  actID: _0x667510,
                  actsID: _0x4b7ec8,
                  done: 0x1,
                }),
              }
              return new Promise((_0x170036) => {
                var _0x2a31ac = {
                  tnpNF: function (_0x5d4099) {
                    return _0x5d4099()
                  },
                }
                $[_0xfff9('41', 'hY&d')](
                  _0x167ff6,
                  (_0x49256a, _0x2f6d72, _0x2dd54d) => {
                    _0x2a31ac[_0xfff9('42', 'f*YU')](_0x170036)
                  }
                )
              })
            }
            await _0x5399eb()
            if (
              _0x2735de[_0xfff9('43', '7r0t')](
                $[_0xfff9('44', 'J$Ct')][_0xfff9('45', '&up0')][
                  _0xfff9('46', 'o0oz')
                ],
                0x0
              )
            ) {
              for (
                let _0xa58173 = 0x0;
                _0x2735de['fPENL'](
                  _0xa58173,
                  $[_0xfff9('33', 'g7q)')][_0xfff9('47', 'UV%i')][
                    _0xfff9('48', '56OG')
                  ]
                );
                _0xa58173++
              ) {
                var _0x5dfd36 = _0x2735de['nXyqA'][_0xfff9('49', 'f*YU')]('|'),
                  _0x497ddc = 0x0
                while (!![]) {
                  switch (_0x5dfd36[_0x497ddc++]) {
                    case '0':
                      actsID =
                        $['zData']['data'][_0xa58173][_0xfff9('4a', 'm4%[')]
                      continue
                    case '1':
                      if (
                        $[_0xfff9('4b', 'AEOi')] &&
                        _0x2735de[_0xfff9('4c', 'h0wm')](
                          $[_0xfff9('4d', 'f*YU')][_0xfff9('4e', 'Apw5')],
                          0x4
                        )
                      ) {
                        await _0xab5498(actID, actsID)
                      }
                      continue
                    case '2':
                      await _0x41174b(actID, actsID)
                      continue
                    case '3':
                      actID =
                        $[_0xfff9('4f', '5r%e')][_0xfff9('50', '9)F5')][
                          _0xa58173
                        ][_0xfff9('51', 'JmR&')]
                      continue
                    case '4':
                      await $[_0xfff9('52', 'g7q)')](0x5dc)
                      continue
                  }
                  break
                }
              }
            }
          }
          await _0x2735de[_0xfff9('53', 'UV%i')](fansLove)
        }
      }
    }
  }
  for (const _0x259565 in allNotify) {
    if (allNotify[_0x259565]['hasOwnProperty'](_0xfff9('54', 'rJTp'))) {
      if (
        _0x2735de[_0xfff9('55', 'Xp68')](
          allNotify[_0x259565][_0xfff9('56', 'AEOi')],
          0xa
        )
      ) {
        message +=
          _0xfff9('57', '#)]j') +
          _0x259565 +
          '\x20\x0a恭喜中奖，共获得' +
          allNotify[_0x259565][_0xfff9('58', 'g7q)')] +
          _0xfff9('59', 'm4%[')
      }
    }
    if (
      allNotify[_0x259565][_0xfff9('5a', 'UV%i')](
        _0x2735de[_0xfff9('5b', 'Lb@2')]
      )
    ) {
      if (
        _0x2735de[_0xfff9('5c', 'JmR&')](
          allNotify[_0x259565][_0xfff9('5d', '&up0')],
          ''
        )
      ) {
        message +=
          _0xfff9('5e', 'JmR&') +
          _0x259565 +
          '\x20\x0a' +
          allNotify[_0x259565]['message'] +
          '\x0a'
      }
    }
  }
  if ($['sendNotify']) {
    if ($[_0xfff9('5f', '5r%e')]()) {
      await notify[_0xfff9('60', 'AWac')]('' + $['name'], '' + message)
    } else {
      $[_0xfff9('61', 'j(RL')](
        $[_0xfff9('62', 'BZUJ')],
        _0x2735de[_0xfff9('63', 'n7jh')]`${message}`
      )
    }
  }
})()
  [_0xfff9('64', 'JmR&')]((_0x432c14) => {
    $[_0xfff9('65', '*VX*')](
      '',
      '❌\x20' + $['name'] + _0xfff9('66', 'e5b7') + _0x432c14 + '!',
      ''
    )
  })
  ['finally'](() => {
    $[_0xfff9('67', 'n7jh')]()
  })
async function fansLove() {
  var _0x2130fb = {
    Kavxp: function (_0x13d27b) {
      return _0x13d27b()
    },
    rgiLe: function (_0x29ed95) {
      return _0x29ed95()
    },
    vLKiw: function (_0xf3886) {
      return _0xf3886()
    },
    eMeaM: '获取活动参数成功。',
    BvkKB: function (_0x2485de, _0x38d61a) {
      return _0x2485de + _0x38d61a
    },
    TkssU: _0xfff9('68', '7r0t'),
    HWKfi: function (_0x4ec385, _0x37fc3b, _0x270c34) {
      return _0x4ec385(_0x37fc3b, _0x270c34)
    },
    YavOf: _0xfff9('69', 'lt!%'),
    mWzan: function (_0x56f8e1, _0x4743d3) {
      return _0x56f8e1(_0x4743d3)
    },
    OsHTm: function (_0x2f6b01, _0x53ccbc) {
      return _0x2f6b01 === _0x53ccbc
    },
    NdgsM: function (_0x54ab99, _0x4d2d32) {
      return _0x54ab99 + _0x4d2d32
    },
    wqWze: function (_0x199252, _0x8283e0) {
      return _0x199252 >= _0x8283e0
    },
    nudYe: function (_0x2e9e4a, _0x11bd61, _0x200514) {
      return _0x2e9e4a(_0x11bd61, _0x200514)
    },
    LFRFY: function (_0x313f06, _0x217a99) {
      return _0x313f06(_0x217a99)
    },
    sIfGc: _0xfff9('6a', 'Eatb'),
    ofJby: _0xfff9('6b', '%KTG'),
  }
  $[_0xfff9('6c', 'n7jh')] = ![]
  await grantToken()
  await $[_0xfff9('6d', 'mF9u')](0xc8)
  await _0x2130fb[_0xfff9('6e', 'AEOi')](getActCookie)
  await $['wait'](0xc8)
  await _0x2130fb[_0xfff9('6f', '5r%e')](getActInfo)
  await $[_0xfff9('70', 'WTmA')](0xc8)
  await getMyPing()
  await $[_0xfff9('71', '8kS2')](0xc8)
  await _0x2130fb['vLKiw'](getUserInfo)
  await $['wait'](0xc8)
  await getActContent(![])
  if ($['actorInfo']) {
    $[_0xfff9('72', '%KTG')](_0x2130fb[_0xfff9('73', '3GC9')])
    $[_0xfff9('74', '[CHV')](
      '当前积分\x20' +
        _0x2130fb[_0xfff9('75', 'lvI9')](
          $[_0xfff9('76', '92($')]['fansLoveValue'],
          $['actorInfo'][_0xfff9('77', '*VX*')]
        ) +
        '\x20'
    )
    if (
      $[_0xfff9('78', 'V7e(')][_0xfff9('79', 'JmR&')] >
      Date[_0xfff9('7a', 'WTmA')]()
    ) {
      if (
        _0x2130fb['BvkKB'](
          $[_0xfff9('7b', 'Apw5')][_0xfff9('7c', 'h0wm')],
          $[_0xfff9('7d', '2RW5')][_0xfff9('7e', 'm4%[')]
        ) <= $[_0xfff9('7f', '4Na(')][_0xfff9('80', 'Eatb')]
      ) {
        if (!$[_0xfff9('81', 'rJTp')]) {
          var _0x3216c4 = _0x2130fb[_0xfff9('82', '#)]j')]['split']('|'),
            _0x876bed = 0x0
          while (!![]) {
            switch (_0x3216c4[_0x876bed++]) {
              case '0':
                await $[_0xfff9('83', 'o0oz')](0x3e8)
                continue
              case '1':
                if (
                  _0x2130fb['BvkKB'](
                    $[_0xfff9('84', 'UV%i')][_0xfff9('85', '*VX*')],
                    $['actorInfo']['energyValue']
                  ) >= $[_0xfff9('86', 'o0oz')][_0xfff9('87', 'D(Mg')] &&
                  $[_0xfff9('7b', 'Apw5')][_0xfff9('88', 'j(RL')] === ![]
                ) {
                  await _0x2130fb[_0xfff9('89', 'JmR&')](
                    doTask,
                    _0x2130fb[_0xfff9('8a', 'V7e(')],
                    'activityId=' +
                      $[_0xfff9('8b', 'jqZh')] +
                      _0xfff9('8c', '#)]j') +
                      $[_0xfff9('84', 'UV%i')][_0xfff9('8d', '1KRL')] +
                      '&drawType=02'
                  )
                  await $['wait'](0x3e8)
                }
                continue
              case '2':
                await _0x2130fb[_0xfff9('8e', '[CHV')](getActContent, !![])
                continue
              case '3':
                if (
                  _0x2130fb[_0xfff9('8f', 'J$Ct')](
                    $['actorInfo']['fansLoveValue'],
                    $[_0xfff9('90', 'mF9u')][_0xfff9('91', 'Lb@2')]
                  ) >= $[_0xfff9('92', '92($')]['prizeScoreOne'] &&
                  _0x2130fb[_0xfff9('93', 'BZUJ')](
                    $[_0xfff9('94', 'V7e(')][_0xfff9('95', 'h0wm')],
                    ![]
                  )
                ) {
                  await _0x2130fb[_0xfff9('96', 'bble')](
                    doTask,
                    _0x2130fb[_0xfff9('97', 'o0oz')],
                    'activityId=' +
                      $[_0xfff9('98', 'an[X')] +
                      '&uuid=' +
                      $[_0xfff9('99', 'Lb@2')][_0xfff9('9a', '5r%e')] +
                      _0xfff9('9b', '%KTG')
                  )
                  await $[_0xfff9('9c', '3GC9')](0x3e8)
                }
                continue
              case '4':
                await $[_0xfff9('52', 'g7q)')](0x3e8)
                continue
              case '5':
                console[_0xfff9('9d', 'mF9u')](
                  _0xfff9('9e', 'Xp68') +
                    _0x2130fb['NdgsM'](
                      $[_0xfff9('9f', 'AEOi')][_0xfff9('a0', 'e5b7')],
                      $[_0xfff9('a1', 'an[X')][_0xfff9('a2', '3GC9')]
                    ) +
                    '\x20'
                )
                continue
              case '6':
                if (
                  _0x2130fb[_0xfff9('a3', 'g7q)')](
                    _0x2130fb['NdgsM'](
                      $[_0xfff9('a4', 'AlWf')][_0xfff9('a5', '&up0')],
                      $[_0xfff9('a6', 'eBa0')][_0xfff9('a7', 'eBa0')]
                    ),
                    $[_0xfff9('a8', 'Apw5')][_0xfff9('a9', '2W9m')]
                  ) &&
                  $[_0xfff9('aa', 'lQU^')][_0xfff9('ab', 'o0oz')] === ![]
                ) {
                  await _0x2130fb['nudYe'](
                    doTask,
                    'wxFansInterActionActivity/startDraw',
                    'activityId=' +
                      $[_0xfff9('ac', '9)F5')] +
                      _0xfff9('ad', 'JmR&') +
                      $[_0xfff9('ae', 'h0wm')][_0xfff9('af', 'Apw5')] +
                      _0xfff9('b0', '56OG')
                  )
                  await $[_0xfff9('b1', 'n7jh')](0x3e8)
                }
                continue
              case '7':
                await _0x2130fb[_0xfff9('b2', '%KTG')](getActContent, ![])
                continue
            }
            break
          }
        }
      } else {
        $[_0xfff9('74', '[CHV')](_0x2130fb[_0xfff9('b3', 'n7jh')])
      }
    } else {
      $[_0xfff9('b4', 'lvI9')](
        $[_0xfff9('b5', 'p0zm')][_0xfff9('b6', '7r0t')] + _0xfff9('b7', 'rJTp')
      )
    }
  } else {
    $[_0xfff9('9d', 'mF9u')](_0x2130fb['ofJby'])
  }
}
function getActContent(_0x351113 = ![]) {
  var _0x1ec1cf = {
    gJHJE: function (_0xa28976, _0x5d2c23, _0x229e48) {
      return _0xa28976(_0x5d2c23, _0x229e48)
    },
    tqyjF: function (_0x2258a6, _0x24b598) {
      return _0x2258a6 === _0x24b598
    },
    mUZQD: function (_0xeda3f9, _0x19fe18) {
      return _0xeda3f9 !== _0x19fe18
    },
    MbpyY: function (_0x19fef9, _0x5f4c9f) {
      return _0x19fef9 === _0x5f4c9f
    },
    CrhSy: 'wxFansInterActionActivity/doAddGoodsTask',
    mFEQX: _0xfff9('b8', '92($'),
    RDoVN: 'wxFansInterActionActivity/doRemindTask',
    RFIea: function (_0x98fe3a, _0x53f1ed) {
      return _0x98fe3a < _0x53f1ed
    },
    UYqny: 'wxFansInterActionActivity/doGetCouponTask',
    tDEwo: function (_0x5571c6, _0x4a5ee0, _0x53f006) {
      return _0x5571c6(_0x4a5ee0, _0x53f006)
    },
    vedoc: _0xfff9('b9', '*VX*'),
    PFqAv: _0xfff9('ba', 'bble'),
    uxSRT: function (_0x234744, _0x2c8439, _0x20e728) {
      return _0x234744(_0x2c8439, _0x20e728)
    },
    XtMIQ: _0xfff9('bb', 'Eatb'),
    ZNrKz: function (_0x569edb, _0x122735) {
      return _0x569edb(_0x122735)
    },
  }
  return new Promise((_0x91e572) => {
    var _0x399ac1 = {
      ZFmol: function (_0x4c6b2b, _0x144a75, _0x47b187) {
        return _0x1ec1cf[_0xfff9('bc', 'Apw5')](_0x4c6b2b, _0x144a75, _0x47b187)
      },
      Dpivz: function (_0x272d9e, _0x3b1a2a) {
        return _0x1ec1cf[_0xfff9('bd', 'Eatb')](_0x272d9e, _0x3b1a2a)
      },
      HMBeY: _0xfff9('be', 'JmR&'),
      cNDYS: function (_0x222407, _0x56050f) {
        return _0x1ec1cf[_0xfff9('bf', 'WTmA')](_0x222407, _0x56050f)
      },
      peOtw: function (_0x58524e, _0x3354e9) {
        return _0x1ec1cf[_0xfff9('c0', '3GC9')](_0x58524e, _0x3354e9)
      },
      NhwQA: function (_0x4ce20a, _0x43d561, _0x1efca3) {
        return _0x4ce20a(_0x43d561, _0x1efca3)
      },
      jOUWj: _0x1ec1cf[_0xfff9('c1', '92($')],
      CpPoR: function (_0x47b17d, _0x1c0c52) {
        return _0x47b17d !== _0x1c0c52
      },
      OqUqz: function (_0x1d3d78, _0x2857d5) {
        return _0x1d3d78 < _0x2857d5
      },
      fCPoa: _0x1ec1cf[_0xfff9('c2', '4Na(')],
      dCorA: function (_0x2908b0, _0x1984ae) {
        return _0x1ec1cf[_0xfff9('c3', '2W9m')](_0x2908b0, _0x1984ae)
      },
      jbvob: function (_0x326ce2, _0x3fc0fc, _0x24f9e9) {
        return _0x1ec1cf[_0xfff9('c4', 'n7jh')](_0x326ce2, _0x3fc0fc, _0x24f9e9)
      },
      dwhMY: _0x1ec1cf['RDoVN'],
      nvWvP: function (_0x4c65c5, _0x25fa29) {
        return _0x4c65c5 !== _0x25fa29
      },
      RCTJI: function (_0x227fe7, _0x43699d) {
        return _0x1ec1cf['RFIea'](_0x227fe7, _0x43699d)
      },
      sPGJT: _0x1ec1cf[_0xfff9('c5', '[CHV')],
      wbmYb: function (_0x1b4bb2, _0x44146c, _0x309971) {
        return _0x1ec1cf[_0xfff9('c6', 'o0oz')](_0x1b4bb2, _0x44146c, _0x309971)
      },
      QYjnR: _0x1ec1cf['vedoc'],
      eyIBT: _0x1ec1cf[_0xfff9('c7', '56OG')],
    }
    $['post'](
      _0x1ec1cf[_0xfff9('c8', '9)F5')](
        taskPostUrl,
        _0x1ec1cf[_0xfff9('c9', '3GC9')],
        _0xfff9('ca', 'Apw5') +
          $[_0xfff9('cb', '4Na(')] +
          _0xfff9('cc', 'Lb@2') +
          _0x1ec1cf[_0xfff9('cd', '*VX*')](encodeURIComponent, $['secretPin'])
      ),
      async (_0x2d4365, _0x5b53f4, _0x117946) => {
        try {
          if (_0x2d4365) {
            console[_0xfff9('ce', 'BZUJ')](
              '' + JSON[_0xfff9('cf', 'f*YU')](_0x2d4365)
            )
          } else {
            if (safeGet(_0x117946)) {
              _0x117946 = JSON[_0xfff9('d0', 'lQU^')](_0x117946)
              if (_0x117946[_0xfff9('d1', '#)]j')] === ![]) {
                $[_0xfff9('d2', 'UV%i')] = !![]
                console['log']('京东说‘本活动与你无缘，请关注其他活动。’')
                return
              }
              if (_0x351113) {
                console[_0xfff9('d3', '7r0t')](
                  _0xfff9('d4', '*VX*') +
                    $['actInfo'][_0xfff9('d5', 'bble')] +
                    _0xfff9('d6', '2W9m')
                )
                await _0x399ac1['ZFmol'](
                  doTask,
                  _0xfff9('d7', 'J$Ct'),
                  'activityId=' +
                    $['ACT_ID'] +
                    _0xfff9('d8', 'lvI9') +
                    $['actorInfo'][_0xfff9('d9', 'f*YU')]
                )
                await $['wait'](0x1f4)
                if (
                  $['task1Sign'] &&
                  _0x399ac1['Dpivz'](
                    $[_0xfff9('da', 'an[X')][_0xfff9('db', '&up0')],
                    0x0
                  )
                ) {
                  await _0x399ac1[_0xfff9('dc', '2W9m')](
                    doTask,
                    _0x399ac1['HMBeY'],
                    _0xfff9('dd', 'hY&d') +
                      $['ACT_ID'] +
                      _0xfff9('de', '92($') +
                      $[_0xfff9('df', 'rJTp')][_0xfff9('e0', '&up0')]
                  )
                  await $[_0xfff9('e1', 'jqZh')](0x1f4)
                }
                if (
                  $[_0xfff9('e2', '92($')] &&
                  _0x399ac1[_0xfff9('e3', '2W9m')](
                    $['task2BrowGoods'][_0xfff9('e4', 'AEOi')],
                    $['task2BrowGoods']['upLimit']
                  )
                ) {
                  for (let _0x22e8bc of $['task2BrowGoods'][
                    _0xfff9('e5', '2W9m')
                  ]) {
                    if (_0x22e8bc['finished'] === ![]) {
                      await _0x399ac1[_0xfff9('e6', '*VX*')](
                        doTask,
                        _0xfff9('e7', 'Apw5'),
                        _0xfff9('e8', 'lt!%') +
                          $[_0xfff9('e9', 'p0zm')] +
                          _0xfff9('ea', 'AWac') +
                          $[_0xfff9('eb', '56OG')]['uuid'] +
                          '&skuId=' +
                          _0x22e8bc[_0xfff9('ec', '92($')]
                      )
                    }
                    await $[_0xfff9('52', 'g7q)')](0x1f4)
                  }
                }
                if (
                  $['task3AddCart'] &&
                  $[_0xfff9('ed', 'o0oz')][_0xfff9('ee', '#)]j')] !==
                    $[_0xfff9('ef', 's[op')][_0xfff9('f0', 'WTmA')]
                ) {
                  for (let _0x413651 of $['task3AddCart']['taskGoodList']) {
                    if (
                      _0x399ac1[_0xfff9('f1', '3GC9')](
                        _0x413651[_0xfff9('f2', '2W9m')],
                        ![]
                      )
                    ) {
                      await _0x399ac1['NhwQA'](
                        doTask,
                        _0x399ac1[_0xfff9('f3', 'WTmA')],
                        _0xfff9('f4', 'g7q)') +
                          $[_0xfff9('f5', '2RW5')] +
                          _0xfff9('f6', 'Apw5') +
                          $['actorInfo']['uuid'] +
                          _0xfff9('f7', 'jqZh') +
                          _0x413651[_0xfff9('f8', 'lQU^')]
                      )
                    }
                    await $[_0xfff9('f9', 'AlWf')](0x1f4)
                  }
                }
                if (
                  $['task4Share'] &&
                  _0x399ac1['CpPoR'](
                    $['task4Share'][_0xfff9('fa', '7r0t')],
                    $[_0xfff9('fb', '3GC9')][_0xfff9('fc', 'o0oz')]
                  )
                ) {
                  for (
                    let _0x58231a = 0x0;
                    _0x399ac1[_0xfff9('fd', 'WTmA')](
                      _0x58231a,
                      $[_0xfff9('fe', 'WTmA')][_0xfff9('ff', '[CHV')]
                    );
                    _0x58231a++
                  ) {
                    await _0x399ac1[_0xfff9('100', '1KRL')](
                      doTask,
                      _0x399ac1[_0xfff9('101', 'p0zm')],
                      'activityId=' +
                        $['ACT_ID'] +
                        _0xfff9('102', 'UV%i') +
                        $[_0xfff9('103', 's[op')][_0xfff9('8d', '1KRL')]
                    )
                    await $[_0xfff9('104', 'Apw5')](0x1f4)
                  }
                }
                if (
                  $[_0xfff9('105', '8kS2')] &&
                  _0x399ac1[_0xfff9('106', '92($')](
                    $['task5Remind'][_0xfff9('107', 'AlWf')],
                    $[_0xfff9('108', 'AlWf')][_0xfff9('109', 'V7e(')]
                  )
                ) {
                  await _0x399ac1[_0xfff9('10a', 'j(RL')](
                    doTask,
                    _0x399ac1[_0xfff9('10b', 'lvI9')],
                    _0xfff9('10c', 'V7e(') +
                      $[_0xfff9('10d', 'hY&d')] +
                      _0xfff9('10e', '&up0') +
                      $['actorInfo'][_0xfff9('10f', '2W9m')]
                  )
                  await $[_0xfff9('110', 'AEOi')](0x1f4)
                }
                if (
                  $[_0xfff9('111', 'lvI9')] &&
                  _0x399ac1[_0xfff9('112', 'g7q)')](
                    $[_0xfff9('113', '8kS2')]['finishedCount'],
                    $['task6GetCoupon'][_0xfff9('114', 'Eatb')]
                  )
                ) {
                  for (
                    let _0x325e98 = 0x0;
                    _0x399ac1[_0xfff9('115', 'eBa0')](
                      _0x325e98,
                      $[_0xfff9('116', 'WTmA')][_0xfff9('117', '*VX*')][
                        _0xfff9('118', '3GC9')
                      ]
                    );
                    _0x325e98++
                  ) {
                    await doTask(
                      _0x399ac1[_0xfff9('119', 'h0wm')],
                      _0xfff9('11a', '#)]j') +
                        $[_0xfff9('11b', 'eBa0')] +
                        _0xfff9('11c', 'o0oz') +
                        $['actorInfo'][_0xfff9('11d', '#)]j')] +
                        _0xfff9('11e', '[CHV') +
                        $[_0xfff9('11f', '*VX*')][_0xfff9('120', 'AlWf')][
                          _0x325e98
                        ][_0xfff9('121', '56OG')]
                    )
                    await $['wait'](0x1f4)
                  }
                }
                if (
                  $[_0xfff9('122', '2W9m')] &&
                  $['task7MeetPlaceVo'][_0xfff9('123', 'UV%i')] !==
                    $[_0xfff9('124', 'Apw5')][_0xfff9('125', 'j(RL')]
                ) {
                  await _0x399ac1[_0xfff9('126', '[CHV')](
                    doTask,
                    _0x399ac1[_0xfff9('127', '[CHV')],
                    'activityId=' +
                      $[_0xfff9('128', '3GC9')] +
                      _0xfff9('ad', 'JmR&') +
                      $[_0xfff9('ae', 'h0wm')]['uuid']
                  )
                }
              } else {
                var _0x246bc6 =
                    _0x399ac1[_0xfff9('129', 'V7e(')][_0xfff9('12a', 'UV%i')](
                      '|'
                    ),
                  _0x464033 = 0x0
                while (!![]) {
                  switch (_0x246bc6[_0x464033++]) {
                    case '0':
                      $[_0xfff9('12b', 'AEOi')] =
                        _0x117946['data'][_0xfff9('12c', 'lvI9')]
                      continue
                    case '1':
                      $[_0xfff9('12d', 'p0zm')] =
                        _0x117946[_0xfff9('12e', '5r%e')][
                          _0xfff9('12f', 's[op')
                        ]
                      continue
                    case '2':
                      $[_0xfff9('130', '#)]j')] =
                        _0x117946[_0xfff9('131', '%KTG')]['task6GetCoupon']
                      continue
                    case '3':
                      $[_0xfff9('132', 'j(RL')] =
                        _0x117946['data'][_0xfff9('133', 'bble')]
                      continue
                    case '4':
                      $['task4Share'] =
                        _0x117946[_0xfff9('134', 'lQU^')][
                          _0xfff9('135', 'JmR&')
                        ]
                      continue
                    case '5':
                      $[_0xfff9('136', '56OG')] =
                        _0x117946[_0xfff9('137', 'eBa0')]['actInfo']
                      continue
                    case '6':
                      $[_0xfff9('138', 'bble')] =
                        _0x117946[_0xfff9('139', 'lt!%')][
                          _0xfff9('13a', 'o0oz')
                        ]
                      continue
                    case '7':
                      $[_0xfff9('13b', 'Eatb')] =
                        _0x117946[_0xfff9('13c', '[CHV')][
                          _0xfff9('13d', 'g7q)')
                        ]
                      continue
                    case '8':
                      $[_0xfff9('13e', '7r0t')] =
                        _0x117946[_0xfff9('13f', '3GC9')]['task3AddCart']
                      continue
                    case '9':
                      $[_0xfff9('140', 'jqZh')] =
                        _0x117946[_0xfff9('141', 'WTmA')]['task2BrowGoods']
                      continue
                    case '10':
                      $[_0xfff9('142', '*VX*')] =
                        _0x117946[_0xfff9('143', 'AWac')][
                          _0xfff9('144', 'Lb@2')
                        ]
                      continue
                  }
                  break
                }
              }
            }
          }
        } catch (_0x38dc45) {
          $[_0xfff9('145', '7r0t')](_0x38dc45, _0x5b53f4)
        } finally {
          _0x91e572(_0x117946)
        }
      }
    )
  })
}
function doTask(_0xd70f08, _0x2ecc56) {
  var _0x29f085 = {
    yxlQl: _0xfff9('146', 'm4%['),
    zmfvM: _0xfff9('147', 'jqZh'),
    CgRXB: function (_0x1f8ee7, _0x3cb535, _0x341ddc) {
      return _0x1f8ee7(_0x3cb535, _0x341ddc)
    },
    xKgwp: 'doTask',
  }
  console[_0xfff9('148', 'lQU^')](_0x29f085[_0xfff9('149', 'jqZh')])
  return new Promise((_0x1178fd) => {
    var _0xa6506f = {
      XarhL: _0x29f085[_0xfff9('14a', 'lQU^')],
      GoRtc: _0xfff9('14b', '92($'),
      LWUNE: function (_0x3a7d8d, _0x120033) {
        return _0x3a7d8d !== _0x120033
      },
      aXOtL: _0x29f085['zmfvM'],
      kSfmB: function (_0x4db571) {
        return _0x4db571()
      },
    }
    $['post'](
      _0x29f085[_0xfff9('14c', '92($')](taskPostUrl, _0xd70f08, _0x2ecc56),
      (_0x2cac50, _0x387c4f, _0x4db939) => {
        try {
          if (_0x2cac50) {
            console[_0xfff9('14d', '&up0')](
              '' + JSON[_0xfff9('14e', '4Na(')](_0x2cac50)
            )
          } else {
            if (safeGet(_0x4db939)) {
              _0x4db939 = JSON[_0xfff9('14f', '[CHV')](_0x4db939)
              if (_0x387c4f['headers'][_0xa6506f[_0xfff9('150', '4Na(')]]) {
                cookie =
                  _0x387c4f[_0xa6506f[_0xfff9('151', 'g7q)')]][
                    _0xfff9('152', 'D(Mg')
                  ][_0xfff9('153', 'WTmA')](';') +
                  ';\x20' +
                  originCookie
              }
              if (
                _0xa6506f[_0xfff9('154', '56OG')](
                  _0x4db939[_0xfff9('155', 'm4%[')],
                  null
                ) &&
                _0x4db939['result'] === !![]
              ) {
                console['log'](_0xfff9('156', 'eBa0'))
                if (
                  _0x4db939[_0xfff9('157', 'g7q)')][_0xfff9('158', 'jqZh')](
                    _0xa6506f[_0xfff9('159', 'hY&d')]
                  )
                ) {
                  if (_0x4db939['data'][_0xfff9('15a', 'lQU^')] === !![]) {
                    console['log'](
                      '恭喜中奖，获得:' +
                        _0x4db939[_0xfff9('15b', '#)]j')][
                          _0xfff9('15c', 'm4%[')
                        ]
                    )
                    if (
                      _0x4db939['data'][_0xfff9('15d', 'Apw5')][
                        _0xfff9('15e', 'lQU^')
                      ]('京豆')
                    ) {
                      if (!allNotify[$[_0xfff9('15f', '4Na(')]]) {
                        allNotify[$[_0xfff9('160', 'lvI9')]] = {}
                        if (
                          !allNotify[$[_0xfff9('161', 'BZUJ')]][
                            _0xfff9('162', '%KTG')
                          ]
                        ) {
                          allNotify[$['index']]['bean'] = 0x0
                        }
                      }
                      allNotify[$[_0xfff9('163', 's[op')]][
                        _0xfff9('164', 'AWac')
                      ] +=
                        _0x4db939[_0xfff9('165', 'hY&d')]['drawInfo'][
                          _0xfff9('166', '3GC9')
                        ]
                    } else {
                      $['sendNotify'] = !![]
                      if (!allNotify[$['index']]) {
                        allNotify[$[_0xfff9('167', '3GC9')]] = {}
                        if (!allNotify[$['index']][_0xfff9('168', '*VX*')]) {
                          allNotify[$['index']][_0xfff9('169', 'h0wm')] = ''
                        }
                      }
                      allNotify[$[_0xfff9('16a', 'eBa0')]][
                        _0xfff9('16b', 'AlWf')
                      ] +=
                        _0xfff9('16c', 'Eatb') +
                        _0x4db939['data']['name'] +
                        '\x0a活动店铺' +
                        $[_0xfff9('16d', 'Eatb')][_0xfff9('16e', 'e5b7')] +
                        '\x0a领奖地址:https://lzkjdz-isv.isvjcloud.com/wxFansInterActionActivity/activity/' +
                        $[_0xfff9('10d', 'hY&d')] +
                        '?activityId=' +
                        $[_0xfff9('16f', '2W9m')] +
                        _0xfff9('170', 'm4%[')
                    }
                  }
                }
              }
            }
          }
        } catch (_0x4d5b10) {
          console[_0xfff9('171', 'p0zm')](_0x4d5b10, _0x387c4f)
        } finally {
          _0xa6506f['kSfmB'](_0x1178fd)
        }
      }
    )
  })
}
function getUserInfo() {
  var _0x498449 = {
    YIkaY: function (_0x27b26c, _0x3bc327) {
      return _0x27b26c(_0x3bc327)
    },
    lVMkz: function (_0x50f464, _0x3a9b02) {
      return _0x50f464(_0x3a9b02)
    },
    rFMPO: function (_0x4ec832, _0xc3cdec, _0x5674e9) {
      return _0x4ec832(_0xc3cdec, _0x5674e9)
    },
  }
  return new Promise((_0xc63f21) => {
    let _0xd74659 =
      _0xfff9('172', 'D(Mg') +
      _0x498449[_0xfff9('173', 'J$Ct')](
        encodeURIComponent,
        $[_0xfff9('174', 'AWac')]
      )
    $['post'](
      _0x498449[_0xfff9('175', '4Na(')](
        taskPostUrl,
        _0xfff9('176', 'g7q)'),
        _0xd74659
      ),
      async (_0x15d04b, _0x17a538, _0x38e5e8) => {
        try {
          if (_0x15d04b) {
            console[_0xfff9('177', 'j(RL')]('' + JSON['stringify'](_0x15d04b))
          } else {
            _0x38e5e8 = JSON['parse'](_0x38e5e8)
            if (_0x38e5e8[_0xfff9('178', '7r0t')]) {
              console[_0xfff9('179', '8kS2')](
                _0xfff9('17a', 'e5b7') +
                  _0x38e5e8['data']['nickname'] +
                  '】信息获取成功'
              )
              $[_0xfff9('17b', '1KRL')] =
                _0x38e5e8[_0xfff9('139', 'lt!%')]['id']
              $[_0xfff9('17c', '&up0')] =
                _0x38e5e8[_0xfff9('137', 'eBa0')][_0xfff9('17d', 'h0wm')]
            } else {
              console[_0xfff9('17e', 'AEOi')](_0x38e5e8)
            }
          }
        } catch (_0x3116da) {
          $[_0xfff9('17f', 'j(RL')](_0x3116da, _0x17a538)
        } finally {
          _0x498449[_0xfff9('180', 'BZUJ')](_0xc63f21, _0x38e5e8)
        }
      }
    )
  })
}
function getMyPing() {
  var _0x542cbb = {
    HveHc: function (_0xd746d7) {
      return _0xd746d7()
    },
    qosqk: function (_0xb54aad, _0xd73bf4, _0x5d39fb) {
      return _0xb54aad(_0xd73bf4, _0x5d39fb)
    },
    SCLxL: _0xfff9('181', '*VX*'),
  }
  return new Promise((_0x4d40cd) => {
    var _0x5a0dba = {
      BUuoi: function (_0x401ea2) {
        return _0x542cbb['HveHc'](_0x401ea2)
      },
    }
    $['post'](
      _0x542cbb[_0xfff9('182', '5r%e')](
        taskPostUrl,
        _0x542cbb[_0xfff9('183', 'j(RL')],
        _0xfff9('184', 'j(RL') +
          $[_0xfff9('185', '8kS2')] +
          _0xfff9('186', 'AWac') +
          $['token'] +
          '&fromType=APP'
      ),
      async (_0x1d5f64, _0x173aaa, _0x2b808c) => {
        try {
          if (_0x1d5f64) {
            console[_0xfff9('22', 'JmR&')](
              '' + JSON[_0xfff9('187', 'V7e(')](_0x1d5f64)
            )
          } else {
            _0x2b808c = JSON[_0xfff9('188', '#)]j')](_0x2b808c)
            if (_0x2b808c[_0xfff9('189', 'eBa0')]) {
              $[_0xfff9('18a', 'D(Mg')] =
                _0x2b808c[_0xfff9('12e', '5r%e')][_0xfff9('18b', 'm4%[')]
              cookie = 'AUTH_C_USER=' + $[_0xfff9('18c', '2W9m')] + ';' + cookie
            }
          }
        } catch (_0x141f86) {
          $[_0xfff9('18d', 'V7e(')](_0x141f86, _0x173aaa)
        } finally {
          _0x5a0dba['BUuoi'](_0x4d40cd)
        }
      }
    )
  })
}
function getActInfo() {
  var _0x33fb4c = { bvOAg: 'customer/getSimpleActInfoVo' }
  return new Promise((_0x5c7214) => {
    $[_0xfff9('18e', 'eBa0')](
      taskPostUrl(
        _0x33fb4c['bvOAg'],
        _0xfff9('18f', 'mF9u') + $[_0xfff9('190', '#)]j')]
      ),
      (_0x1ac36d, _0x228c41, _0x4d7c95) => {
        try {
          if (_0x1ac36d) {
            console['log']('' + JSON[_0xfff9('191', 'JmR&')](_0x1ac36d))
          } else {
            _0x4d7c95 = JSON[_0xfff9('192', 'jqZh')](_0x4d7c95)
            if (_0x4d7c95['result']) {
              $[_0xfff9('193', 'Lb@2')] =
                _0x4d7c95['data'][_0xfff9('194', 'jqZh')]
            }
          }
        } catch (_0x2087f3) {
          $[_0xfff9('195', '8kS2')](_0x2087f3, _0x228c41)
        } finally {
          _0x5c7214()
        }
      }
    )
  })
}
function grantTokenKey() {
  var _0x2dda24 = {
    dQnxo: function (_0x128f65, _0x1c0939) {
      return _0x128f65 === _0x1c0939
    },
    vvuOY: _0xfff9('196', 'n7jh'),
    LyWYF: _0xfff9('197', 'D(Mg'),
    UoxpM: 'api.m.jd.com',
    HwuNy: 'application/x-www-form-urlencoded',
    AOWJJ: 'keep-alive',
    ChkhC: _0xfff9('198', '#)]j'),
    fMNCV: _0xfff9('199', 'AEOi'),
  }
  console[_0xfff9('19a', '5r%e')](_0x2dda24[_0xfff9('19b', 'D(Mg')])
  let _0x3f1a07 = {
    url: _0x2dda24[_0xfff9('19c', '4Na(')],
    headers: {
      Host: _0x2dda24[_0xfff9('19d', '1KRL')],
      'Content-Type': _0x2dda24[_0xfff9('19e', '&up0')],
      Accept: _0xfff9('19f', 'eBa0'),
      Connection: _0x2dda24[_0xfff9('1a0', 'Eatb')],
      Cookie: cookie,
      'User-Agent': _0xfff9('1a1', 'V7e('),
      'Accept-Language': _0x2dda24[_0xfff9('1a2', 'AEOi')],
      'Accept-Encoding': _0x2dda24['fMNCV'],
    },
    body:
      'body=%7B%22to%22%3A%22https%3A%5C%2F%5C%2Flzkjdz-isv.isvjcloud.com%5C%2FwxFansInterActionActivity%5C%2Factivity%5C%2F' +
      $[_0xfff9('1a3', 'm4%[')] +
      'c%3FactivityId%3D' +
      $[_0xfff9('1a4', 'UV%i')] +
      _0xfff9('1a5', '2RW5'),
  }
  return new Promise((_0x1c6187) => {
    var _0x54b359 = {
      lnIil: function (_0x33b2c1, _0x310d47) {
        return _0x2dda24[_0xfff9('1a6', '56OG')](_0x33b2c1, _0x310d47)
      },
    }
    $[_0xfff9('1a7', '9)F5')](_0x3f1a07, (_0x15eae3, _0x14b8a7, _0x13a0f7) => {
      try {
        if (_0x15eae3) {
          console[_0xfff9('1a8', 'Apw5')]('' + JSON['stringify'](_0x15eae3))
        } else {
          console[_0xfff9('1a9', 'bble')](_0x14b8a7)
          _0x13a0f7 = JSON[_0xfff9('1aa', '5r%e')](_0x13a0f7)
          if (_0x54b359['lnIil'](_0x13a0f7['code'], '0')) {
            $['tokenKey'] = _0x13a0f7[_0xfff9('1ab', 'V7e(')]
            cookie = cookie + _0xfff9('1ac', 'p0zm') + $[_0xfff9('1ad', 'an[X')]
          }
        }
      } catch (_0x3c7cf5) {
        console[_0xfff9('1ae', 'h0wm')](_0x3c7cf5, _0x14b8a7)
      } finally {
        _0x1c6187()
      }
    })
  })
}
function grantToken() {
  var _0x3c47c6 = {
    hDsTL: function (_0x5c0bb2) {
      return _0x5c0bb2()
    },
    YnILU: _0xfff9('1af', 'mF9u'),
    wmVtn: _0xfff9('1b0', '2RW5'),
    cfjhg: 'application/x-www-form-urlencoded',
    cToxi: _0xfff9('1b1', 'f*YU'),
    BDEhv: _0xfff9('1b2', 'mF9u'),
    yRfHR: _0xfff9('1b3', 'UV%i'),
    YJyPr: _0xfff9('1b4', 'Xp68'),
  }
  let _0x59d884 = {
    url: _0x3c47c6['YnILU'],
    headers: {
      Host: _0x3c47c6['wmVtn'],
      'Content-Type': _0x3c47c6[_0xfff9('1b5', 'BZUJ')],
      Accept: _0x3c47c6[_0xfff9('1b6', 'j(RL')],
      Connection: _0xfff9('1b7', 'e5b7'),
      Cookie: cookie,
      'User-Agent': _0x3c47c6[_0xfff9('1b8', 'rJTp')],
      'Accept-Language': _0x3c47c6[_0xfff9('1b9', 'an[X')],
      'Accept-Encoding': _0x3c47c6[_0xfff9('1ba', 'hY&d')],
    },
    body: 'body=%7B%22url%22%3A%22https%3A%5C%2F%5C%2Flzkjdz-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&build=167541&client=apple&clientVersion=9.4.0&openudid=385f383ec315d8d01c64a09021df04ef9930c99d&sign=b747c2565aca50d1e1dfb3544a9e04c8&st=1613530023543&sv=100',
  }
  return new Promise((_0x5bf6c9) => {
    $[_0xfff9('1bb', '5r%e')](_0x59d884, (_0xb395b7, _0x455bc4, _0x4c985d) => {
      try {
        if (_0xb395b7) {
          console[_0xfff9('d3', '7r0t')]('' + JSON['stringify'](_0xb395b7))
        } else {
          _0x4c985d = JSON[_0xfff9('1bc', 's[op')](_0x4c985d)
          if (_0x4c985d['code'] === '0') {
            $[_0xfff9('1bd', 'BZUJ')] = _0x4c985d[_0xfff9('1be', '2RW5')]
          }
        }
      } catch (_0x19d3a0) {
        console[_0xfff9('74', '[CHV')](_0x19d3a0)
      } finally {
        _0x3c47c6[_0xfff9('1bf', '8kS2')](_0x5bf6c9)
      }
    })
  })
}
function getActCookie() {
  var _0x24a032 = {
    gmYnY: _0xfff9('1c0', 'hY&d'),
    sJQBa: _0xfff9('1c1', 'V7e('),
    NweWj: _0xfff9('1c2', 'J$Ct'),
    wZWOc: _0xfff9('1c3', '9)F5'),
    Bmpsa: _0xfff9('1c4', 'mF9u'),
    yilVC: _0xfff9('1c5', 'p0zm'),
    dOVAR: _0xfff9('1c6', '*VX*'),
    pLzXJ: _0xfff9('1c7', 'p0zm'),
  }
  let _0x2c822d = {
    url:
      'https://lzkjdz-isv.isvjcloud.com/wxFansInterActionActivity/activity/' +
      $['ACT_ID'] +
      _0xfff9('1c8', 'WTmA') +
      $['ACT_ID'] +
      _0xfff9('1c9', 'e5b7'),
    headers: {
      'Content-Type': _0x24a032['NweWj'],
      Accept: _0x24a032['wZWOc'],
      Connection: _0x24a032['Bmpsa'],
      Cookie: '' + cookie,
      'User-Agent': _0x24a032[_0xfff9('1ca', '1KRL')],
      'Accept-Language': _0x24a032[_0xfff9('1cb', 'e5b7')],
      'Accept-Encoding': _0x24a032['pLzXJ'],
    },
  }
  return new Promise((_0x11d62b) => {
    var _0x176935 = {
      FNFoe: _0x24a032[_0xfff9('1cc', 'p0zm')],
      cbJdh: _0x24a032[_0xfff9('1cd', 'hY&d')],
      qcOKh: function (_0x3957ad) {
        return _0x3957ad()
      },
    }
    $['get'](_0x2c822d, (_0x4ab685, _0x591133, _0x57e590) => {
      try {
        if (_0x4ab685) {
          console[_0xfff9('1ce', '#)]j')]('' + JSON['stringify'](_0x4ab685))
        } else {
          cookie = cookie + ';'
          if ($['isNode']())
            for (let _0x4b5405 of _0x591133[_0x176935[_0xfff9('1cf', 'rJTp')]][
              _0x176935[_0xfff9('1d0', 'h0wm')]
            ]) {
              cookie =
                '' + cookie + _0x4b5405[_0xfff9('1d1', 'AEOi')](';')[0x0] + ';'
            }
          else {
            for (let _0x12b548 of _0x591133['headers'][_0xfff9('1d2', 'm4%[')][
              _0xfff9('1d3', 'lQU^')
            ](',')) {
              cookie = '' + cookie + _0x12b548['split'](';')[0x0] + ';'
            }
          }
        }
      } catch (_0xb3f6d6) {
        console[_0xfff9('179', '8kS2')](_0xb3f6d6)
      } finally {
        _0x176935['qcOKh'](_0x11d62b)
      }
    })
  })
}
function taskPostUrl(_0x59c289, _0x415767) {
  var _0x7eddce = {
    ZsbaE: _0xfff9('1d4', 'Apw5'),
    dlPJZ: _0xfff9('1d5', 'BZUJ'),
    xbwSv: _0xfff9('1d6', 'eBa0'),
    nCQrb: 'gzip,\x20deflate,\x20br',
    uUTuo: _0xfff9('1d7', 'eBa0'),
    cIKew: _0xfff9('1d8', 'V7e('),
  }
  return {
    url: 'https://lzkjdz-isv.isvjcloud.com/' + _0x59c289,
    headers: {
      Host: _0x7eddce['ZsbaE'],
      Accept: _0x7eddce[_0xfff9('1d9', 'rJTp')],
      'X-Requested-With': _0x7eddce[_0xfff9('1da', 'AlWf')],
      'Accept-Language': _0xfff9('1db', 'mF9u'),
      'Accept-Encoding': _0x7eddce['nCQrb'],
      'Content-Type': _0xfff9('1dc', 'bble'),
      Origin: _0x7eddce[_0xfff9('1dd', '5r%e')],
      Connection: _0x7eddce['cIKew'],
      Referer:
        _0xfff9('1de', '7r0t') +
        $['ACT_ID'] +
        _0xfff9('1df', 'lQU^') +
        $[_0xfff9('1e0', '*VX*')] +
        _0xfff9('1e1', 'AWac'),
      Cookie: '' + cookie,
      'User-Agent': _0xfff9('1e2', 'bble'),
    },
    body: _0x415767,
  }
}
function getACT_ID() {
  var _0xf7e1cd = {
    PfeMP: '获取活动信息成功',
    sZRgN: function (_0x3d3373, _0x5618e9) {
      return _0x3d3373(_0x5618e9)
    },
  }
  return new Promise(async (_0x2c6abc) => {
    var _0x30645c = {
      jzLzb: _0xf7e1cd[_0xfff9('1e3', 'Eatb')],
      kyzyk: function (_0x1dec44, _0x3d7fc0) {
        return _0xf7e1cd['sZRgN'](_0x1dec44, _0x3d7fc0)
      },
    }
    _0x2c6abc()
    // $[_0xfff9('1e4', 'j(RL')](
    //   { url: _0xfff9('1e5', 'D(Mg') + Date[_0xfff9('1e6', 'Xp68')]() },
    //   (_0x1f9ee2, _0x560eab, _0x5571c7) => {
    //     try {
    //       if (_0x1f9ee2) {
    //         console['log']('' + JSON[_0xfff9('1e7', 'lt!%')](_0x1f9ee2))
    //       } else {
    //         if (_0x5571c7) {
    //           _0x5571c7 = JSON[_0xfff9('1e8', 'mF9u')](_0x5571c7)
    //           if (
    //             _0x5571c7[_0xfff9('1e9', 'Eatb')][_0xfff9('1ea', 'BZUJ')] > 0x0
    //           ) {
    //             $[_0xfff9('1eb', 'Lb@2')] = _0x5571c7[_0xfff9('45', '&up0')]
    //             console[_0xfff9('1ec', 'lt!%')](
    //               _0x30645c[_0xfff9('1ed', 'AEOi')]
    //             )
    //           } else {
    //             $['ACT_IDarr'] = []
    //           }
    //         }
    //       }
    //     } catch (_0x14f8a6) {
    //       $[_0xfff9('1ee', 'eBa0')](_0x14f8a6, _0x560eab)
    //     } finally {
    //       _0x30645c[_0xfff9('1ef', 'jqZh')](_0x2c6abc, _0x5571c7)
    //     }
    //   }
    // )
  })
}
function checkCookie() {
  var _0x54fcad = {
    usFCO: _0xfff9('1f0', 'Lb@2'),
    HexWk: function (_0x18e2c2, _0x2e4a8f) {
      return _0x18e2c2 === _0x2e4a8f
    },
    sjWbP: _0xfff9('1f1', 'rJTp'),
    DykPe: '京东返回了空数据',
    aaRdv: function (_0x42bdf1) {
      return _0x42bdf1()
    },
    PEAWW: _0xfff9('1f2', 'an[X'),
    mVicc: _0xfff9('1f3', '5r%e'),
    vFzrZ: '*/*',
    tzfSf: _0xfff9('1f4', 'Lb@2'),
    fZUrB: _0xfff9('1f5', '4Na('),
    edeqV: 'https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&',
  }
  const _0x3db419 = {
    url: _0x54fcad[_0xfff9('1f6', 'lt!%')],
    headers: {
      Host: _0x54fcad['mVicc'],
      Accept: _0x54fcad[_0xfff9('1f7', '2RW5')],
      Connection: _0xfff9('1f8', 'bble'),
      Cookie: cookie,
      'User-Agent': _0x54fcad['tzfSf'],
      'Accept-Language': _0x54fcad['fZUrB'],
      Referer: _0x54fcad['edeqV'],
      'Accept-Encoding': 'gzip,\x20deflate,\x20br',
    },
  }
  return new Promise((_0x370d38) => {
    $[_0xfff9('1f9', 'UV%i')](_0x3db419, (_0x49804d, _0x4f599f, _0x554854) => {
      try {
        if (_0x49804d) {
          $[_0xfff9('1fa', 'JmR&')](_0x49804d)
        } else {
          if (_0x554854) {
            _0x554854 = JSON['parse'](_0x554854)
            if (
              _0x554854[_0xfff9('1fb', '%KTG')] ===
              _0x54fcad[_0xfff9('1fc', 'AEOi')]
            ) {
              $[_0xfff9('1fd', 'p0zm')] = ![]
              return
            }
            if (
              _0x54fcad['HexWk'](_0x554854[_0xfff9('1fe', '8kS2')], '0') &&
              _0x554854[_0xfff9('1ff', '*VX*')]['hasOwnProperty'](
                _0x54fcad[_0xfff9('200', 'J$Ct')]
              )
            ) {
              $['nickName'] =
                _0x554854[_0xfff9('201', 'Lb@2')]['userInfo'][
                  _0xfff9('202', 'p0zm')
                ]['nickname']
            }
          } else {
            $[_0xfff9('b4', 'lvI9')](_0x54fcad['DykPe'])
          }
        }
      } catch (_0x34b95a) {
        $[_0xfff9('203', 'bble')](_0x34b95a)
      } finally {
        _0x54fcad[_0xfff9('204', 'p0zm')](_0x370d38)
      }
    })
  })
}
function safeGet(_0x159ed0) {
  var _0x450e63 = { sqxzi: _0xfff9('205', 'AWac') }
  try {
    if (
      typeof JSON[_0xfff9('206', 'p0zm')](_0x159ed0) ==
      _0x450e63[_0xfff9('207', 'j(RL')]
    ) {
      return !![]
    }
  } catch (_0x9e253f) {
    console[_0xfff9('17', 'hY&d')](_0x9e253f)
    console[_0xfff9('208', 'Eatb')](
      '京东服务器访问数据为空，请检查自身设备网络情况'
    )
    return ![]
  }
}
_0xodG = 'jsjiami.com.v6'
