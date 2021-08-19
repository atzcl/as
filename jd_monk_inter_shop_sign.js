/*
interCenter渠道店铺签到

脚本修改自“日常劝退”的闭源脚本shop_sign.js，经过其授权

更新地址：https://raw.githubusercontent.com/monk-coder/dust/dust/normal/monk_inter_shop_sign.js
============Quantumultx===============
[task_local]
#interCenter渠道店铺签到
0 0 * * * https://raw.githubusercontent.com/monk-coder/dust/dust/normal/monk_inter_shop_sign.js, tag=interCenter渠道店铺签到,  enabled=true
[rerwite_local]
#interCenter渠道店铺签到
(interact_center_shopSign_getActivityInfo) url script-request-header https://raw.githubusercontent.com/monk-coder/dust/rewrite/m_get_inter_shop_sign.js
[mimt]
hostname = api.m.jd.com
================Loon==============
[Script]
cron "0 0 * * *" script-path=https://raw.githubusercontent.com/monk-coder/dust/dust/normal/monk_inter_shop_sign.js,tag=interCenter渠道店铺签到
===============Surge=================
interCenter渠道店铺签到 = type=cron,cronexp="0 0 * * *",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/monk-coder/dust/dust/normal/monk_inter_shop_sign.js
============小火箭=========
interCenter渠道店铺签到 = type=cron,script-path=https://raw.githubusercontent.com/monk-coder/dust/dust/normal/monk_inter_shop_sign.js, cronexpr="0 0 * * *", timeout=3600, enable=true
*/

const $ = new Env('interCenter渠道店铺签到')
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : ''
const notify = $.isNode() ? require('./sendNotify') : ''
const cp = $.isNode() ? require('child_process') : ''
let cookiesArr = [],
  cookie = '',
  originCookie = '',
  message = '',
  newCookie = ''
let helpAuthor = true //为作者助力的开关
var _0xod5 = 'jsjiami.com.v6',
  _0x4d2a = [
    _0xod5,
    'TyVjw6bDjg==',
    'Y1PClsOpfA==',
    'wpzDp8OULjQ=',
    'w4/CuMOhw6IIMTbCrcOc',
    'wrsYwrbDqsKU',
    'wqEsXsOcwpAbwrE=',
    'wrzCtEM=',
    'wpzCv8Oow5U=',
    'w6bDp8KTN8KT',
    'KXPCiwDDuw==',
    'wp/CoFLCnMKv',
    'H8KzEQgx',
    'w6XCksOdw6sK',
    'w5xLBcKUDcKb',
    'CcOrSAE3',
    'JxhYw4vDiMOcNcK+Jn9r',
    'worCtcOaw4/Dr8OKG8O2',
    'w7fjgYzkuJLkuoTotYHlj6k=',
    'wpDDnMKtfsO8',
    'MFHCnCfDv8OHHUg=',
    'w5nCuMOpO8KkZMOHwqkrw47DlXsjwpfCtOKUrMO06I2G5b2VIuOBpA==',
    'NMKcMy0=',
    '44CIXeS4sOiyuuODnw==',
    'wr3DvsKOecOv',
    'wqrDs8KrbMOc',
    'wqPCvkpGfTQaw45pcA==',
    'w6DCmsOYw5g=',
    'wq04wrE=',
    'w4BLBsKV',
    'wpYlwoFCJQ==',
    'FVTDsMKI',
    'PVnCiy/DmQ==',
    'XMKRw6E1',
    'worCoGrCscKJFg4=',
    'JkTDqcK5',
    'TMKYwozDlsOW',
    'fMKgw5oyCA==',
    '5LqZ5ae/5bet57uK562N5Yq26L6P5Li25ZGE776H',
    'QDkjwrg4',
    'MlzCosOLLWzDs3F8w4LDgcKVwq9Cw7vCnBFvw43Ci8K8w47CkHfDksOOCMO4d0FzFcKGw4rDqsKhXVTCnBE=',
    'C3xQA8O7',
    'b8OKwpnCj8KlwoEhw4fDhWHDuMKgO1Umw40Sw7o=',
    'wqUewqzCosOI',
    'w7zDsmHCusOL',
    'w4LCvcKb',
    'XwQB',
    'FEs/fXk=',
    'JsKlendyw6U8w5nDrcKwLsOUZiLCpWsBw74=',
    'HhrDkGbCug==',
    'GULCjzLCqRw6JB3CiQ7CmxAoEMKswpjDq8ObwpJzX8KOYsK7FcOIwobCksOjUcKWFcOYLsOqeMOzf8OD',
    'wrYuwrjCs8OcwpYxFQ==',
    'wpzDp8OUDgZxwp4swrcy',
    'Un7Diz1G',
    'wpbCnsOCw6LDjg==',
    'w53DpcKbw61S',
    'XhgB',
    'wo3CuXTCvMKMGRbDgMOrw4pHJcOuDcK3w7I=',
    'OwN5w4vDi8KDaMOSJnxnJ1DComPCkS4TWgnCqsOlfAbCgGDCtsOEwonCiBh/woDDpRRBw5w=',
    'w6hhIsKUAQ==',
    'O2sxS1N8w4LCvcKkw5TCqmvCscOiw6HCqnE6wpUswq8ywp97wqPDjlR1cXIcwrIiw4F5w48vw5zCncOS',
    'GXJDAcO2',
    'N2HCnAbDvw==',
    '56665Ymy6K+N6Le+5pSQ77yo',
    'cjB4w4PDtA==',
    'Km3CvAfCmA==',
    'Rk7DsBlh',
    'wrDCtnVSVQ==',
    'wooEd8Omwpg=',
    'L3VOAMOV',
    'wrkAE8K6Lg==',
    'wr4mwqN4Ow==',
    'ImTDj8Kdwo0=',
    'SV/CisOXbg==',
    'wrFdTgZs',
    'J8KJCggh',
    'wrzCqkfCh8KD',
    'QD1Xw4XDlg==',
    'w43DqcKPw55e',
    'JU7Dsw==',
    'JMK6CiUy',
    'wp/CqsO5w5fDtMOAFMOlFsOiOBzCswrCkgw=',
    'Pmoi',
    '6K6d5rGd5bym5bmy776l',
    'PMKww7DCucO6',
    'wo3DpcOSFBU=',
    'w5nCtMOww6ww',
    'ADvDsg==',
    'wojCqHDCsQ==',
    'FgMvwqHCrzfDnltzQ8Kawqk=',
    'wqFtI008asOLCA==',
    'XcK9wqjDmw==',
    'w5hPBcKUB8KEwrxj',
    'OlHCosOHKWTDpHxqw4U=',
    'w7vCiMOQw48AFiPCtsOYR0NFwprCgsKzXmrChw==',
    'fRzDqMKd',
    'wogvw5vDqiZ9wocwwp8qw4nCrMKfacKkUUth',
    'EU/CjxLCtRkNOS/Cjw==',
    'wrTCulBD',
    'S2bDjA1S',
    'wqs7w5/Drww=',
    'eB7DqMK1wpk=',
    'w6HDgMKOw6g=',
    'wonCp2DChMKMFxI=',
    'HG5UJcO4',
    'NcKWNiY=',
    'wrnDl3A=',
    'M8KLIA4NIMKIw4B9woo=',
    'Sm7ClQ==',
    'GcKfbm1m',
    'VcKSw7U8FQ==',
    'wozCqHV1ag==',
    'Lis3wprCjA==',
    'JEQQT3Q=',
    'ZsOcKsKpAcKswp5+wrw=',
    '6Iyr5by544OE',
    'JkLDtMK/wp0pwrTDkQ==',
    '44Oe5Lub6LKb',
    'UBIHwoc=',
    'Q3TCgcOzcksRwro=',
    'A37Dj8KqwqU=',
    'w7XDiHw=',
    '6I2f5b2v44K+',
    'w7jDh8KnPMKYwpsIw74=',
    'A0TDgsKGwp8=',
    'w69FLsKqDw==',
    'A2nDsg==',
    'NXjDvsK+woE=',
    'euOAvOS5l+S5i+i3veWOig==',
    'IMKaw4vCtMOuSMKNYg==',
    'EsO6wqxwe8KvLgbCisKzw6nDkFTDjx/il7PCtOiMuOW9hA7jgpc=',
    '44O5w5jkuILosb7jgpA=',
    'wrkGwq3DoMK9',
    'wqTColRH',
    'w7V0w6k=',
    '6Iy55b2s44Kl',
    '44O55LmU6LOo',
    'wo9dw7subTbCrEw=',
    'w7rCgsOFw5g=',
    '6Iyy5by244Oq',
    'W0XDiD1YSsO7w6I=',
    '44Cj56aY5Ymg',
    'ZBpF',
    'woHDgsKxf8OA',
    'wr8uw7zDgA==',
    'RMKxw5kxDg==',
    'wrUlwrpCDg==',
    'fBpxw6bDrcKPWsK5',
    'w5hUw57Din8=',
    'O1UjQXI=',
    'wqYnwrvDoMKp',
    'ElnDqMKxwpsvwr/lvqflupbvvLo=',
    'T2nChsOgbgRQw6EXw5PCuggRw50uw68cwoZ3w6xYBi0qAcO2dyUXwp4le8OPPmrCixfDoMO+wrvCoMOuEsOXcMOhwo0lw7A=',
    'wrjCnkNeTA==',
    'QHjChg==',
    'wqE7wqbCu8OQwocZBcOJwrYlUsKiA8O4wpw=',
    'GMKKFAs5',
    'wpRlAEIg',
    'UMOQwrbCh8Kh',
    'CAfDt2fCvg==',
    'wrjCr1BSQGFBwohueTLCqsKxUhwYwqvCkzDDrEnCqsKlLltzNsKqwoLCmcO6wq1qJhrDocK5w4QEwoE7QmbDoMKU',
    'd8OeM8K/DcKDwpZ5wqE4UMO/GcKMAmY=',
    'JzHDk8Kvw4c=',
    'wrM/wqTCvsOXwoMRF8OZ',
    'w7rCi8K2wqbDjg==',
    'w4bDicK8w4pd',
    'VlTDkTJ8',
    'wrgKw7bDixU=',
    'IcK4eFNb',
    'wpjCl8OdTA==',
    'woXDnMOCFx0=',
    'wqZtUAdi',
    'wrHCosOgw4jDlQ==',
    'HyDDp17CtcKnw4DCtyU=',
    'wo5GRAc=',
    'w4p5CcKgBw==',
    'w6nDjsKd',
    '6K+F5rKy5b6O5bmo772B',
    'wqQzwp5mLw==',
    'wprDncKtfg==',
    'AsKpHgQS',
    'LRfDgWjCksKEw4jCoy4=',
    'wrg9wos=',
    'I8KAw48=',
    'w4JFDMK1EMKE',
    'w5dzwpQ=',
    'AXpBOsKSw5g2elI5',
    'PsKNJjMbacOUwo57wp9wYcOrw4LCtAQLHMO7wprCp2HDlDXCpn/CkQxYw6TCs8OAfsKIw5B5LsOmCVnCjBvDn00Fw7IZaxw/RGfCoMOQ',
    'fV7CucOJNmPDhHxTw4TCmcOJw71Bw7zCrQFzw4vClMKBw67CkyQ=',
    'KEbCpMOHMWrDuWNa',
    'XsOlAsK5JQ==',
    'CWx9A8Oa',
    'Z8Klw4UU',
    'TA4+wrzCrjHDmEkSVcKewqrCmCZmADJQAg==',
    'wrwYw7fDnA==',
    'TBMuwrjCqTHDmFZ8UsKHwqDClE1GPVQkFsOBWMOLYMKhTm1nw4ofRcKyw4tHwqPDmGvDjjPDrMK4wrYIwoXCvMKrwpMlBUXDn8OpFMOiTVbCpMKfw5jDtTDCgcKowpIGwqYDwqkjTTkZPkjDjcOZw53DimXDsxNow4FmTcKWYx5AwoTDt3IadCbDuntXw5Z0wrlSw7PDr8Oow4rDqCDDu8KbQsKFMgLDmSbDnMOEb3xkw5XDvcOXBQkYKsOyeMKiaz3DmhtORHrDlUXDs8OJNMOyXMOSw7shwq7DgsOdwp3CqMOcCjEuTHlbP8Kww5AMwrXCrRrDmknDsUfDlsOCLmpEOwvCtDp3wqPDpMKQG8O6YcOgw6fClVFIcChZLsOdw6htw5MvUcKGwp3DsMOBcUBJw6/CpMOhPUjDmsOKPsOzGMK8wpsuO8KFfk4Jw6DCmCQOw6zChToqHH0HwrJ1wpDCjgEXDUwiSDMBw6XDnwLCvsKKdA==',
    'JsKHw5zCr8OTE8OPKDEeS8KAVj01ZMOxwrsYYsKwAMKzJsKGOsOgw4ogwqIIeFdKIn7CpsKRw51Cw7vDjjHClHbDmn8CYgPDscOoT8Kaw7Vqw5x2X8O9NMOawpjDl3IQw6RPFcO0E1kqYznDm8OjYThz',
    'Xk/Djxdz',
    'wr/Di3XCqMKHw6TDosK6w6kzbsOlw5LCosK+c3EoGcKdHsKXLlYSw6jCjMK7wq9BKQ==',
    'Px3DkQ==',
    'OULCljzCncKGFEhSw5V7wqw/wphtwqnCqw==',
    'DxgjwrDCoSbDklpFWsKPwrTCiWVfPANsVcORQcOATcKJZnRmwp1XBsKiw5JMwpTDo0PDlzLCu8Ow',
    '6YOb6KWv5L605pmw5Lu356Sj56ep5rKe',
    'CcOWShEG',
    'wo7Ch0HCiMKL',
    'Ak3ClTPCtBA=',
    'w6Y4w6nDq8Km',
    'G8Kyw4XCuMO4',
    'w7rClMOmw4kzHDnCuA==',
    'w5pFPsKAEsKTwodET2YZ',
    'wqJyw4w9VA==',
    'woHChFtqUA==',
    'c8O9wrTCj8Kz',
    'Dg4hwqTCow==',
    'w5M/w7/DqsK8wpfChkw=',
    'wrPDlHhcw5Y=',
    'w5XDl8KdK8KW',
    'wonCu1zCn8Ko',
    'PmHCncOAGQ==',
    'AyZdw7XDrA==',
    'JRrDscKiw78=',
    'F8KBFQ4S',
    'wr0yw4bDuEM=',
    'w5bCusOYw5ol',
    'GnBXPg==',
    'SCUDwpo=',
    'w6nCnsOB',
    'PsKNJjMbacOUwo57wp9wYcO0w57CrAFcUcO3wpjDpS/DjjjCt3fCjwhUw7LDvcOBf8KMw4ZiCsOtSETChw3DpUZSw6kaBQ==',
    'OMKWJQ==',
    'w6HCpcK7wrDDlg==',
    'IRcywqbCkw==',
    'KSVow4g=',
    'woDCpmM=',
    'wpDCusOrf8OU',
    'w6nClcO5w6w5',
    'FBk3wrrCtA==',
    'JcKUAjkA',
    'X8KBw7Y7GQ==',
    'wprCkGBqRQ==',
    'CDXDoVY=',
    '6I6F5Y6h5rWd5YmB5L645oO85ouq5YiO',
    'w5jDpE/CkMOzwpDCrcO4wqs=',
    'Tm7CvsO/elcR',
    'wqMYwrrDisKIwo0=',
    'wowNwpPDo8K/',
    'w4/CosKVw7HDkcOgwpXDuRHDoW/ClA==',
    'w4DDnjg=',
    'wq8nX8O4w5QXwrgfHw4=',
    'wrUfw7DDrMKU',
    'w77DnXLCv8KWw7TCqMOvwr9vP8KhwofCqMOycHc=',
    'TkfCgsOTUQ==',
    'O8KQw5DCi8Os',
    'N0HCtcONMQ==',
    'w6TCiCcC',
    'woDCgm/CqMKN',
    '5Lqk5Lmp6L+25ZmM5LiZ56qc5pWE5o6w',
    'wrl7Wx1JwqxOdRAwCQ0/wqXDmMKUQ8KmR8Kfwq10w5YJw78uw53ClWbCssKfwqrClU3DlxQxwqJLY8KTw6zChwHCvcOAwrTCosO8wpjCocK5w5UKTXB2EcOxwrfDsMOIwr/CgMKOwpDDgz3DrcKzw77CuQAzw6sUTArCucOEwosfKMKYw7PDtXVRwr8ow7fDgm9+w4HCt8KSwoUeZMOqVCbDmcK4aVdBw4rCtMO6w4vCm8KlQ8Kpw7cUJcKzwoU7w6V+w5LDrgbCsWjCgWduenbDp14x',
    'wrjDnFZww4g=',
    'SF/ClMOfdA==',
    'wrojw7vCtMOX',
    'w48kw5jDrsK9w4TDhwQ1wqhdDyrCm8K4w6rDtw9BKxnCvmjDpxd/csKwDnBgeSRsM8OQw4rDhsKySMKTFsOuwrU5w612w7/Di3UHwrDDoQTDg8KLTV0=',
    'wpUzLMKRGw==',
    'w7TDoU7Cp8Ou',
    'FW3Cgh3CqA==',
    'w7Rtw4rDnFE=',
    'wrHDqsK9f8O9',
    'wrsQwopaIw==',
    'fsKTwpnDsMOF',
    'wpVFRDlx',
    'wqDDtFVQw50=',
    'wqsuwrjDrcKZ',
    'cG/Cs8Ocdg==',
    'J17CuhvCsA==',
    'esOBJA==',
    'w77CoMKTwrLDlcK9wprlvp/luIfvvpg=',
    'wrtnKmwrag==',
    'woRBw4w1aA==',
    'wpbDh8KNY8Ou',
    'wpxBO2Ep',
    'L8KhEwI/',
    'IsKww4HCssOV',
    'w6luw73Dow==',
    'IxZ/w4jDnQ==',
    'wqfCgHLCmMKV',
    'w73CtcKvwpXDnw==',
    'w7DDlFfCoMOdwr3Cog==',
    'CWLDscKUwoI=',
    'w7fDhMKOw6p4UcOA',
    'R8KDw6kiEsOhaEk=',
    'w7LDvMKSGMKm',
    'wo/DvsKnfcOQ',
    'wro7wo9+BD3CuGc=',
    'wqsgw7vDlQ==',
    'ahRRw7fDlsKIUsKx',
    'wqorWcOjwpcXwrkT',
    'ME7Dt8KwwpM/wr8=',
    'wpNYUhxV',
    'wrIqwrjCs8OWwok=',
    'J8K5THFBw68mw5c=',
    'wrAtb8O4wokTwqY1CBhb',
    'bRLDj8KIwq/Dj8K4wqc=',
    'w4/ClsOlw5MZ',
    'HQ7DnF/Cmg==',
    'Kl/Ds8KswoFmw7XCisOPUMK4ciZ/wq/DnFbCssK1wolaTijDgwgoLsKNRcKZwoY+BH3CiWlLP8Otw6fCj3hnHAfCpMOdw7pnAibCoiHCpw==',
    'wpo5w4rDjA5zwpY=',
    'SjbDulPCosO9',
    'wp/CvXbCucKLHR7DksO7',
    'wrTCsUjCl8K1',
    'w7BJw5vDv2U=',
    'wpEXc8OM',
    'LcOAJsKnE8KPwoVmw6cgV8K2GsOELExbdcOj',
    'F8K9Gwc=',
    'w5HCgmdpUDJUw5vCqMOEKXZAKlolAHVfEcKfwonDhltiw7TDvQUAWxrCjsOHwpzCqMOnw5LDonbCt1MXwrtgWnnCqcKGw60+w53DhlxHcMOxTVrClHApwrbDq8OADMKzY3hEw5V7wpfCrhAlwqzCoV3CkMO3ecOnc3/CqW3CqsKYbjnCvULDmsO/U8K6w5FAwp4aw5fCkyDCgi/DoHRvwpZ6w6zDhUInScKjw4J/w47DuCgvLsKewoPDiMKnB1jCs8Ojw4LClW4WDMOUWMKJfMKEwpHCvnMow4oUC8KqQsOdw6kUAMOYQTXDiMOhwpXDuRDDl8KgH8KmBsOaw4dpQGrCvwTDt8OIXSsxSz0jQsOmwp8PwqQiwqDCuxPChwzCgsOdw79zGsOpIMK3w4cBbsKiw6nDuT43w7PCvw9WbXHDrcKiBHEQwpFOwqRCNsKYQXMyw69adl3CmjfCrl8EXj3DmgI9w6TDh8O/LlTCqAvDkGLCkMOyw4s=',
    'w6bCj8OBw40yT3jDsMOGGxlRw6fCnMK2BHzCm049OBk9Ax/CrjwdXlLDswwNehzDicOlDVbCq2Umwr/CgMKVLEkewojCo8OpcQfDjSzCmMK0BcKJecKIw4JMFcKpYcOrwqzCvXxwwr8wL8KLwpPCmFzDl1g=',
    'ZF7DqcKDwpMuwr/DhMKT',
    'IG/CsBrCqA==',
    'OsKWNQ==',
    'YznDvcKIwrw=',
    'w6nDhmnCvMOf',
    'HEzDosK0wrg=',
    'EQoQwqzCoA==',
    'WMKGwq/DqMOi',
    'EQw0wqfCqw==',
    'LFnCkSjDnsOL',
    'w5Axw6jDisKb',
    'wp/CmcOqbMOH',
    'woHCi8OgV8O2wpI=',
    'OWA8XQ==',
    'wp/DncK7XsOlJ8KP',
    'QgIVwoE=',
    'QjF9w5bDmsKkYcKZ',
    'c8OANQ==',
    'wqDCtU1dZR9zw6g=',
    'QXzCnsOjeA==',
    'wpc9woN+IznCpkh2',
    'w5cxw57DrcKr',
    'PsOBfxsIIA==',
    'w7zCnsODw5gzBjI=',
    'wprChGFx',
    'KXBLIcOWw5wQVxY=',
    'w4nCt8KIwrvDncK6wp4=',
    'w5p0w6HDoF49T8KB',
    'wps1w5LDrAJs',
    'JlrCkz3ClQ==',
    'HxQvwrjCqmTChQ1cUsKew6LCgy9VJQI6TsOGVMKXX8KVMG5/wpdIH8Kzw4QbwoXDtV/DijI=',
    'GVbChMODNQ==',
    'QMO8wrnCiMK+',
    'd8OeM8K/DcKDwpZ5wqE4UMO/C8OSGn9lHMKqVDDDtMOMwohyRjHCgUDCh3zDr04=',
    'wo/CgsOHSMK+w5czw5nDlmXDusKbwo7DoCLDocOg',
    'w7jDl2vCo8OTwrfCrcO+wrBsMMO6wojDt8K9fCk1XcOWVsOTMRZOwrnDg8Kmw6oFPsOawoE=',
    'w6bDhsO5PMKZ',
    'woU8wqzDpsKQ',
    '5Lmj5Lmd6L2b5Zmq5Lqo5Luu5q+856mj5pay5o+o',
    'w6rDkmvCqsOIwrnCrcOkwrB3MQ==',
    'L0rDqcK1woYz',
    'wr4gwpfDrMKi',
    'w41aLcK1Ng==',
    'bsO6wovCp8Kj',
    'w69hwq/ClOKUssOO5bya5L255pe05Yq26Lyz5p6v6YKw556O6K2T5puk5L+d5Y6O6ICj5Z+T5L2o55Sa44OXw6A1w4EFWsKbN8O2w7TDtMKt44Kg6aOF55iPw6nDumwZwovil47Di+Wln+afnOS9seW5rOayqOactuS9l+eVluOCiidFK8OyGzfDvRojcFzjg7Dpo4DnmbPku5Pmlp3lioDkuJfovLrmn5/mtK7mgLPor6jnpaHogoXmiqLDv1zDiMKXwpzilZLCt+aIs+S5guWVmuauneOClGXDrsOVIMOvPMO4Umpiw4TjgK7mkJXov5rmirroh7Lmnojnmpboo57ku5EITsO5CTnilLAP5bql6K+K5pqL5o+O6L266KCc546z5aOZw44bw6TDucO04paew7ETwoonccOfccO/w4rCmEDDt8KlCVDpgZfnvZvmlo/mo6xWw6dwUFMkZcKnIk9DL1fCikfDvcK3w41Vw5LDnsKBfxlDwoTDtGPCl8KmwovChkpUP8Omw7LDnT3Dh8OCTOKWuMOm6Z+I6byJTkvDu3zCryPCsOmCk+e8j+aXtuajtu+8vcOeTMKJOMKJworDpcOlawAzd0k4wpojwr7Crg0xHH1iVsOBwqrChsOJw7/miYoSJgLDvsKCC8KHVcO+bhELwo8fXVwc6K+K6ISt6KGu5p+J5oit44Cfwo7DosOvc0/ilavCreS6nOaEr+mDoumesuWkueWRvueZlOWlkuS/j+ear+mDjee+oeaUu+ajrARgbRUdfsKaDcKpLMO6bw836K2a6IeN6KKp5p+n5oil44OXwp4zwrE=',
    'OMKzenUew6ckw5nDrcK8',
    'ZHLCncO7dFs1wopE',
    'wq4wDsKzIQ==',
    'wopEw7ghayDCo0zChTwew6nCjcKaw4fCiA==',
    'w73DmcKCw7FvTcOdHHlYQsODd8KOIMKLLh/CisKhw4fDnsOmccONEEnCt8OVc37CgA==',
    'H8KsChoE',
    'w4zDll3Ci8OJ',
    'wpp1TBE=',
    'wpMFwoXCjsOr',
    'wqjDiMOWEAY=',
    'w5DDrcKMw75h',
    'K1jDicKzwpY5',
    'CSzDsFQ=',
    'CQ7Dsl7Cmg==',
    'woDCt8OfecOd',
    'wpDDlnN9w44=',
    'GW8vRFk=',
    'ICN6w6vDkQ==',
    'JsKHw5zCr8OTE8OPKDEeS8KAVj01ZMOxwrsY',
    'wpzCsWV6eQ==',
    'wqnDo8OTFyk=',
    'wq3Ck3tdbQ==',
    'fBR0w6PDqA==',
    'woJaw6shdyfCp0s=',
    'wqHDgUFaw6U=',
    'YRtBw77DqsKCUcKt',
    'KzZfw57Dnw==',
    'BmjDtsKXwpnDpMKkw7g=',
    'w4vCi8KZworDhg==',
    'wpHCv8OCXsO5',
    'woTCncOAX8Omwp8=',
    'J8KoBA8A',
    'wpvCoMO4W8OW',
    'BgRow4nDtsOYKsKY',
    'MMOPZBMJ',
    'wpTDk8K9eMOs',
    'VkLDnztP',
    'OF1Mw4NzwrnDkMK75b2I5aWb44Cw5Lm85Lu+6LeZ5Y+V',
    'OsK4e2BL',
    'JV/CniXClRw0NQ==',
    'w5fCrsKKTVoyw4B/w7Q=',
    'YQZuw73DuMKPWg==',
    'w7HDncKz',
    'woLCqGnCtQ==',
    '44GD5oyG56Sl44CUUMOpJ8Obw7LCvOW2qOWmnOaVvQ==',
    'w4dED8KVGg==',
    'Z8KDw6kiFcOuY0M=',
    'G8K/w57CqMOW',
    'wqk4wpjCuMOdwoE=',
    'UMKEw4AVAg==',
    'NS4DwoHCoA==',
    'wo3Cv8Onw5/Dk8OMAcO4GcO0',
    'wrtnKg==',
    '6I2j5b+F44O8',
    'MsKQISAHJsKVw5U=',
    'O03CjwjDlA==',
    'wp7Dl1V9w74=',
    'VBzDlcKYwpA=',
    'YsOrF8K/BQ==',
    'OsOLZA==',
    'GBXDlkXCmg==',
    'w7TCv8OUw4kg',
    'K1PCpMOdOg==',
    'w4s/w4s=',
    'bjHDnsKXwog=',
    'w4VoGMK1BA==',
    'E0DCjA/CrA==',
    'woEqUcOYwpA=',
    'ez9Kw5vDrQ==',
    'ck7CkMO5Vw==',
    'OWAgXgx8w43CoMKNw5I=',
    'A1/Cm8OUCQ==',
    'PMOOwp3ChMOZw5Jzw4LDnW/CscO/BEAzwoRBw7rCrcOTw7rDnj3DtCnChMKlw59APg==',
    'OE3CkS/DhcOPH0N9w50nwrsvw4AdwrnCsG7CgcOKUnLDrnPCtVJyw5TDgXDDoTVow4XDsU0nwp9dwr5Xw4V4dSkK',
    'w7LDtwZXQD4cw6luZD7CpsO5QkxVw7DDmzzDr0jDqsK4GR11KMO8w53DmsKlw6d2PgbDuMKXw44Jw44=',
    'wotyw5nDrcKrwozCuEI+w6UKSCbCi8Kww6PDv0hHKgDCrHLDtmg9PsKyAmJmYh9sb8OCw4DDncK1GsOMB8Ktw7hs',
    'wooQw7zDszI=',
    'wpjCu8Olw4jDuA==',
    'wpcIdcOdwq8=',
    'wo7CtcO6w48=',
    'w5TCgMKZwqw=',
    'w6zDj8KmLMKS',
    'w6nDiGjCuw==',
    'wpUJKMKTOQ==',
    'JBtnw63Diw==',
    'J8O8dQM=',
    'B1vClwPCtw==',
    'Gw3DqsKQ',
    'eMK0w5MUHsONW2E=',
    'w7/CssOww5sp',
    'wo5aw74=',
    'N13CsQ==',
    'wpDCqXZJZQ==',
    'SRrDn8K6wrc=',
    'IcK+RUtY',
    'U8KAw7w8MsOsb1LDg8O8wqfDnx7CnFDCiQ==',
    'PcKHw5rCtsOOTsKJYSA=',
    'K8OCcxUM',
    'w6DDo0PCosOi',
    'E1t8J8On',
    'wqDCtFdW',
    'LVVKJsOz',
    'ScK9wq7DicOF',
    'wow3wqRlIQ==',
    'wqM5woDClMON',
    'wqsWwqnDrg==',
    'woDCrGrCt8KREg==',
    'MsKvNjcQ',
    'wrUFw67DgE8=',
    'w4Mxw5jDvw==',
    'w7XDrcKFLsKR',
    'w7jDj8KgPg==',
    'wq/DvHZHw4U=',
    'JkrDs8K9',
    'OlHCosOdFkk=',
    'wpxVw6E5',
    'D8OLYw==',
    'EVvClcOCCQ==',
    'w51eCsKEF8KF',
    'Gw88',
    '6I2z5b+V44Cq',
    '44Co56Sz5Yua',
    'wobCnnU=',
    'OcKhc2pX',
    'wqbDnXlXw6oFdxjCrlA=',
    'wrozwoFw',
    'T8OhKcKKFA==',
    'wp0NUMORwok=',
    'VcK5wrLDncOUwog=',
    'BnBD',
    'HMOtRC8oAVgrw6M=',
    'wrzCvkpFRzM=',
    '5Lqk5reA5Yidw7QF',
    'PgvDvMKKw6PCoMKlwok=',
    'w61Nw6XDkmc=',
    'NMOAdBUZ',
    'wqYyw4PDm0nChyc=',
    'woTCmHFybjxLw4o=',
    'MlfCmA==',
    'w44+w4jDu8K2',
    'PR5uw5DDtsOYKsKY',
    'dBLDlWbCm8KMWgc+',
    'NkHCsQ==',
    '5Lq65Lqy6LWl5Yyk',
    'M+isq+mEkeaUiuebm+W+teiOluWNsMOEA8KrMsK+w7cUw4/CnEAxE3U7e0PDiR86worCtcOxw7hVw4nDhHkVw5EdN24fwrzCvlvCmX3DqMOgwoJleXw=',
    'f8OdDcK8AMKF',
    'PcKWw4bCu8OuRsKUbj9S',
    'BRnDtMKd',
    'w4Q/w4PDtcKnwpvltJrlpJrmlJXDpx1K',
    '5Lu/5Lmr6LSr5Y2M',
    'O2shS1k=',
    'F1jDosKuwrw9wrfDgA==',
    'CSBcw7nDqQ==',
    'EsOtVj8S',
    'eBRQw6HDug==',
    'woHCgMOJTsOK',
    'wpxlQBBE',
    'GnzCryLDgw==',
    'woLCn8O/QMOW',
    'JTzDsG7Cgw==',
    'wpJFw544Qw==',
    'NifDv0DCsA==',
    'wr07wqjDn8KJ',
    'LVrCtx3DoQ==',
    'w4fClcK4wqrDlQ==',
    'wrM3wpg=',
    'wrdVZS5r',
    'w7rChsK+wo/Djg==',
    'wpnCgnBTaA==',
    'ZcKnw606Mw==',
    'S3LClQ==',
    '5Li35aat5bWS57qo56yO5Yio6Lyt5LuT5ZCh77yI',
    'EjHDqcKbw6E=',
    'QsOTwpHCh8Ks',
    'CmjCmiPCug==',
    'wqdpP1o8',
    'woTCtFxWSw==',
    'BFpqBcOU',
    'wqgtXQ==',
    'I8K3bXZW',
    'DzvDsVI=',
    'PBnDssKJw6o=',
    'wr1vHFEd',
    'wr3Cq2BXUw==',
    'BC1/w7XDiw==',
    'd8OeKsO9CcOOwp1pw6Y0UcK9',
    'wopcw7gIRQ==',
    'TljDvDxx',
    'PMKdMzMYaMKSw7FywoB3KsK9w5XDsFQLT8Kvw4bCvC7Cl2fConDChAhGw6/DvMOCP8KLw5xtBMK4JmnCoC3CrwUew6gZSBoqXgDCpMKdLhnDnMORwoEJei0sUMOcwqJtQEvCh0LClQMxEzZ8VcK1chdyQcKvPkdPwrRYPlHDvhsRSMOlFngIwrYZRgPDoTTCpMKDQ8KxGcOmClh6OMK6DmXCmgDCrTk0w57DmEzDm0vCqA8IbV9ALsOwHMOBKUcMaQIrwrrDi8OBw5LDuzDCiiBBIsOdLcOaw40Lw4FvTsKGwooAwo7Dg8Kxwq7Csy3DjkZQw5/Cg8OoPMKXw6c6FsKKb8KlJhrCpHpNVlrCosOgwoHDnlVRBAErw6/Co0LCsVQ8w4TDsMKQK8OYGRoyw5FLwqDDsyd5w7PCsMOtN8O2wrwswofCh8ODw7vDsRbDncOow6pSw53Dk8O1woYYw7DDmsK9w6kpXcKdw4E0QVJKLMK8w6/CqsK+w5gxdgFRGMOoO8Kvwp3ClMKuwqwYQsK2L8KxMBfCtsKIw5dTByjCgWPDi8Ow',
    'woLChWZpU2cJwoDCgcKBd3cLEF9yTCoJVsKcwpvDsW5ew5HDrVMfOhfCmsOHw7zDn8Otw7jCrwPDtx4Vwod2WkfDhMOWwo8Ew6DDhwEUMMKXPzDCu3sZwrXCocOaEcK+Yi9Twoo2w4vDsxZmw7rDqFjCgMOObcK1dnPCjjvDqcOVCWvCogjCicKlC8O4wpIww5lKwp3ClmzDh1DCs38=',
    'aMKEw4nCpsKdGcOGazdMWMOLFDYld8K0wqccKcOvR8KkLcK1H8O7w5Zuw4U=',
    'bcK7wq/DisO5',
    'wpJhTxdRwqlANGx6BE5iwrjDmMKORcKrR8Omw7Riw7U5wq1hw6/Ckm3CpcOHw7HDuH/ClFFswosRN8KGw4zCiEbCp8Kv',
    'W0IuwrvCvCzDukteAMONw67Dk2ABJxd9SMOHTcKFQsKZKyp9wolGG8K0w55iwonDqUjDhiXCrcK1wrxLw5rDtsO+',
    'BBBEw43DgA==',
    'wqh1w4MKaA==',
    'JWo2WFg=',
    'HDXDp0TCvg==',
    'wpHDq8OHIgJq',
    'w79NOMKiKA==',
    'w7R/w6fDmXQ=',
    'PUrCiTzDnA==',
    'wrcgwpplJw==',
    'JMKUw7nCp8Ok',
    'wrw1w73DnUDCiSB/wrs=',
    'w4DDkcKgw6Fl',
    'wrLCrMOow5DDkQ==',
    'wqMnTsOswpgCwrU=',
    'wrkzwpw=',
    'wp4zw5HDsw57',
    'woZxVxFXwrNK',
    'PFfCosOKPnnDsQ==',
    'wrXCkVR0eQ==',
    'wp7Dl8K9f8OlMMKG',
    'PVvCusOaOn8=',
    'w442w4DDkcKM',
    'P1PCosOP',
    'KXTChMOnHg==',
    'SDMHwp04',
    'McOLfhcVLQ==',
    'w6N0f1VpZMKxEMOe',
    'wonCi2xTWA==',
    'wqzCv8O6',
    'wrI/wrXClMO+',
    'wpYnSQ==',
    'wpvCjMOPTMOnwoQ=',
    'wrXCmUzCocKO',
    'KcKSfnFS',
    'IcKYOzc=',
    'wrUzwrzDu8Kb',
    'wq4iw7vDvWo=',
    'w7t+w6/DpQ==',
    'wp3Cj0ZSRA==',
    'w5MGw4fDh8Ke',
    'woUkw4bDoB9mwoshwpE7w4XCrcK0ZcK9XUZqNMOqDsO/C8KIVMKow4jDp1kawpg1w6J4w5hdXU9QHw==',
    'wr/CgEA=',
    'w6fCnMOdw64C',
    'w47DlsKgB8Ke',
    'wrwfw6rDhy5awpIrwps=',
    'tjusjXiamitp.tUcoehm.v6AzyD==',
  ]
;(function (_0x3900f5, _0x4038c2, _0x34db5f) {
  var _0x3f3a01 = function (
    _0x531e5f,
    _0x1ce8b7,
    _0x1016dd,
    _0x2512fa,
    _0x4d699d
  ) {
    ;(_0x1ce8b7 = _0x1ce8b7 >> 0x8), (_0x4d699d = 'po')
    var _0x24dfa1 = 'shift',
      _0x532513 = 'push'
    if (_0x1ce8b7 < _0x531e5f) {
      while (--_0x531e5f) {
        _0x2512fa = _0x3900f5[_0x24dfa1]()
        if (_0x1ce8b7 === _0x531e5f) {
          _0x1ce8b7 = _0x2512fa
          _0x1016dd = _0x3900f5[_0x4d699d + 'p']()
        } else if (
          _0x1ce8b7 &&
          _0x1016dd['replace'](/[tuXtptUehAzyD=]/g, '') === _0x1ce8b7
        ) {
          _0x3900f5[_0x532513](_0x2512fa)
        }
      }
      _0x3900f5[_0x532513](_0x3900f5[_0x24dfa1]())
    }
    return 0x7d0fe
  }
  return (_0x3f3a01(++_0x4038c2, _0x34db5f) >> _0x4038c2) ^ _0x34db5f
})(_0x4d2a, 0x145, 0x14500)
var _0x10e9 = function (_0x407c7d, _0xceecfd) {
  _0x407c7d = ~~'0x'['concat'](_0x407c7d)
  var _0x4d24f2 = _0x4d2a[_0x407c7d]
  if (_0x10e9['beFrff'] === undefined) {
    ;(function () {
      var _0x4b9c98 =
        typeof window !== 'undefined'
          ? window
          : typeof process === 'object' &&
            typeof require === 'function' &&
            typeof global === 'object'
          ? global
          : this
      var _0x317d64 =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
      _0x4b9c98['atob'] ||
        (_0x4b9c98['atob'] = function (_0xa5cea0) {
          var _0x163649 = String(_0xa5cea0)['replace'](/=+$/, '')
          for (
            var _0x141980 = 0x0,
              _0x4a25cc,
              _0x4317de,
              _0x4a5482 = 0x0,
              _0x13c616 = '';
            (_0x4317de = _0x163649['charAt'](_0x4a5482++));
            ~_0x4317de &&
            ((_0x4a25cc =
              _0x141980 % 0x4 ? _0x4a25cc * 0x40 + _0x4317de : _0x4317de),
            _0x141980++ % 0x4)
              ? (_0x13c616 += String['fromCharCode'](
                  0xff & (_0x4a25cc >> ((-0x2 * _0x141980) & 0x6))
                ))
              : 0x0
          ) {
            _0x4317de = _0x317d64['indexOf'](_0x4317de)
          }
          return _0x13c616
        })
    })()
    var _0x84c9f6 = function (_0x2c85c8, _0xceecfd) {
      var _0x887448 = [],
        _0x26f751 = 0x0,
        _0x41fdd4,
        _0x229624 = '',
        _0x1398da = ''
      _0x2c85c8 = atob(_0x2c85c8)
      for (
        var _0x576a6b = 0x0, _0x44c2dd = _0x2c85c8['length'];
        _0x576a6b < _0x44c2dd;
        _0x576a6b++
      ) {
        _0x1398da +=
          '%' +
          ('00' + _0x2c85c8['charCodeAt'](_0x576a6b)['toString'](0x10))[
            'slice'
          ](-0x2)
      }
      _0x2c85c8 = decodeURIComponent(_0x1398da)
      for (var _0x471e70 = 0x0; _0x471e70 < 0x100; _0x471e70++) {
        _0x887448[_0x471e70] = _0x471e70
      }
      for (_0x471e70 = 0x0; _0x471e70 < 0x100; _0x471e70++) {
        _0x26f751 =
          (_0x26f751 +
            _0x887448[_0x471e70] +
            _0xceecfd['charCodeAt'](_0x471e70 % _0xceecfd['length'])) %
          0x100
        _0x41fdd4 = _0x887448[_0x471e70]
        _0x887448[_0x471e70] = _0x887448[_0x26f751]
        _0x887448[_0x26f751] = _0x41fdd4
      }
      _0x471e70 = 0x0
      _0x26f751 = 0x0
      for (var _0x2af8aa = 0x0; _0x2af8aa < _0x2c85c8['length']; _0x2af8aa++) {
        _0x471e70 = (_0x471e70 + 0x1) % 0x100
        _0x26f751 = (_0x26f751 + _0x887448[_0x471e70]) % 0x100
        _0x41fdd4 = _0x887448[_0x471e70]
        _0x887448[_0x471e70] = _0x887448[_0x26f751]
        _0x887448[_0x26f751] = _0x41fdd4
        _0x229624 += String['fromCharCode'](
          _0x2c85c8['charCodeAt'](_0x2af8aa) ^
            _0x887448[(_0x887448[_0x471e70] + _0x887448[_0x26f751]) % 0x100]
        )
      }
      return _0x229624
    }
    _0x10e9['VFhkTX'] = _0x84c9f6
    _0x10e9['huLAoc'] = {}
    _0x10e9['beFrff'] = !![]
  }
  var _0x500de5 = _0x10e9['huLAoc'][_0x407c7d]
  if (_0x500de5 === undefined) {
    if (_0x10e9['UCXJpY'] === undefined) {
      _0x10e9['UCXJpY'] = !![]
    }
    _0x4d24f2 = _0x10e9['VFhkTX'](_0x4d24f2, _0xceecfd)
    _0x10e9['huLAoc'][_0x407c7d] = _0x4d24f2
  } else {
    _0x4d24f2 = _0x500de5
  }
  return _0x4d24f2
}
if ($[_0x10e9('0', 'NDW*')]()) {
  Object[_0x10e9('1', 'iWHF')](jdCookieNode)[_0x10e9('2', '%f!Q')](
    (_0x19350c) => {
      cookiesArr[_0x10e9('3', 'O!hk')](jdCookieNode[_0x19350c])
    }
  )
  if (
    process['env'][_0x10e9('4', 'nX$u')] &&
    process[_0x10e9('5', 'tI^S')][_0x10e9('6', 'HDIM')] === _0x10e9('7', '1MOl')
  )
    console['log'] = () => {}
} else {
  let cookiesData = $['getdata'](_0x10e9('8', 'D!xA')) || '[]'
  cookiesData = JSON[_0x10e9('9', 'xgs4')](cookiesData)
  cookiesArr = cookiesData['map'](
    (_0x18588c) => _0x18588c[_0x10e9('a', 'v)*g')]
  )
  cookiesArr[_0x10e9('b', 'v144')]()
  cookiesArr[_0x10e9('c', 'HDIM')](
    ...[
      $['getdata'](_0x10e9('d', 'PvYR')),
      $[_0x10e9('e', 'cj(J')](_0x10e9('f', 'WdS1')),
    ]
  )
  cookiesArr['reverse']()
  cookiesArr = cookiesArr[_0x10e9('10', 'x2Q3')]((_0x3a1d30) => !!_0x3a1d30)
}
!(async () => {
  var _0x1e4a6c = {
    zXdPE: function (_0x1439e4, _0x2979d8) {
      return _0x1439e4 !== _0x2979d8
    },
    PgCFj: _0x10e9('11', 'e!B*'),
    rhZNk: 'https://api.r2ray.com/jd.bargain/done',
    hXzXF: function (_0x53388b) {
      return _0x53388b()
    },
    crVCt: function (_0x4c968d) {
      return _0x4c968d()
    },
    EQvwB: _0x10e9('12', '9b!a'),
    btLEY: function (_0x347507, _0x52389f) {
      return _0x347507 === _0x52389f
    },
    hOqAO: _0x10e9('13', 'VwSl'),
    NRDGD: 'dwwXW',
    EndNj: _0x10e9('14', '9EX4'),
    Kjjjx: 'api.m.jd.com',
    sTwPi: _0x10e9('15', 'tI^S'),
    LjAXJ: _0x10e9('16', 'NDW*'),
    qtGbF: _0x10e9('17', '&Xs7'),
    TgspY: _0x10e9('18', 'w!C6'),
    GbiDM: _0x10e9('19', '8@Qm'),
    taVqw: _0x10e9('1a', 'R^[7'),
    tyViA: _0x10e9('1b', '&Xs7'),
    xAReg: 'super',
    eYeUz: _0x10e9('1c', 'vvmK'),
    yGlfk: function (_0x3a6f12, _0x13ff68) {
      return _0x3a6f12 < _0x13ff68
    },
    qQVLh: _0x10e9('1d', '8@Qm'),
    sXVcD: _0x10e9('1e', 'EP(0'),
    ZYPLG: function (_0x4d4142, _0x563ebe) {
      return _0x4d4142 + _0x563ebe
    },
    ULvwv: 'https://bean.m.jd.com/bean/signIndex.action',
    yqHPD: 'BNXIy',
    eupDe: function (_0x4bbc4e, _0x38a314) {
      return _0x4bbc4e === _0x38a314
    },
    MaIdM: 'KoBNZ',
    dVdtx: function (_0x224e63, _0x59d265) {
      return _0x224e63 < _0x59d265
    },
    JiClV: function (_0x3c6de7, _0x2d6b8c) {
      return _0x3c6de7 === _0x2d6b8c
    },
    iCQqf: _0x10e9('1f', '9EX4'),
    YOjYp: _0x10e9('20', 'R^[7'),
    ixgvX: function (_0x2fa062, _0x1b3fd2) {
      return _0x2fa062 === _0x1b3fd2
    },
    DDPnr: 'fPyal',
    jgQxD: function (_0x40968d) {
      return _0x40968d()
    },
    hvtTl: function (_0xda4900, _0xa9ed78) {
      return _0xda4900 === _0xa9ed78
    },
    fPdFf: 'WgIvx',
    ixuEn: 'cBlWq',
    ahpEG: 'https://h5.m.jd.com',
    PRjiw: _0x10e9('21', 'hAv@'),
    QgSRJ: _0x10e9('22', '1MOl'),
    mdiRC: 'CookieJD',
    kXEXa: _0x10e9('23', 'd$hz'),
    LzGwI: _0x10e9('24', 'R&#6'),
    IJCKY: function (_0x2e2208, _0x51cf49) {
      return _0x2e2208 | _0x51cf49
    },
    kihVK: function (_0x12c7ef, _0x1638fe) {
      return _0x12c7ef * _0x1638fe
    },
    AHcye: function (_0x9b8b48, _0x55d730) {
      return _0x9b8b48 == _0x55d730
    },
    TEXqV: function (_0x52ebcf, _0x490052) {
      return _0x52ebcf & _0x490052
    },
    TbRHY: function (_0x2e44ce) {
      return _0x2e44ce()
    },
    SNSYR: '【提示】请先获取京东账号一cookie\x0a直接使用NobyDa的京东签到获取',
    rFRIA: function (_0x1bfab6, _0x2f04c2) {
      return _0x1bfab6 < _0x2f04c2
    },
    tVkYP: function (_0x49bc2a, _0x3a2a3c) {
      return _0x49bc2a(_0x3a2a3c)
    },
    hUptD: function (_0x10cd61) {
      return _0x10cd61()
    },
    ZWQBQ: function (_0x44a4f2, _0x3c00bf) {
      return _0x44a4f2 === _0x3c00bf
    },
    abbPS: 'VfCer',
    OCFOs: 'CnVqS',
    iflOB: function (_0x1b6d65, _0x1140cb) {
      return _0x1b6d65 !== _0x1140cb
    },
    YPHqk: function (_0xcdfac, _0x4d7fa6, _0x43b8d4) {
      return _0xcdfac(_0x4d7fa6, _0x43b8d4)
    },
    rtcCG: function (_0x47897d, _0x576238) {
      return _0x47897d === _0x576238
    },
    MTbpw: function (_0x10df8a, _0x290115, _0xb6e8c0) {
      return _0x10df8a(_0x290115, _0xb6e8c0)
    },
    ighSC: function (_0x488c22, _0x1d4ee6) {
      return _0x488c22(_0x1d4ee6)
    },
    RxtXi: _0x10e9('25', 'PkMj'),
    GPAtQ: _0x10e9('26', 'zrsV'),
    DNdya: _0x10e9('27', '&Xs7'),
    CdGBY: function (_0x1becfa, _0x196de0) {
      return _0x1becfa + _0x196de0
    },
    FYjYo: function (_0x590856) {
      return _0x590856()
    },
    zIGhd: function (_0x2dc9f5, _0x15388b) {
      return _0x2dc9f5 !== _0x15388b
    },
    wKtLJ: 'siVLJ',
    DLGbk: function (_0x3d3bc0, _0x15b41b) {
      return _0x3d3bc0 !== _0x15b41b
    },
    QdaxF: function (_0x18e37a, _0x59e6ce) {
      return _0x18e37a === _0x59e6ce
    },
    BwmWo: '遇见你是一种福气',
  }
  if (!cookiesArr[0x0]) {
    $['msg'](
      $[_0x10e9('28', 'Jr*$')],
      _0x1e4a6c[_0x10e9('29', 'I3Y2')],
      _0x1e4a6c[_0x10e9('2a', 'nH90')],
      { 'open-url': _0x1e4a6c[_0x10e9('2b', 'PkMj')] }
    )
    return
  }
  if ($[_0x10e9('2c', 'vvmK')]()) {
    cp[_0x10e9('2d', 'cwvT')](
      'cd\x20..\x20&&\x20git\x20remote\x20-v',
      async function (_0x550d82, _0x4dd39e, _0x35f0ec) {
        var _0x5254b2 = {
          tETla: function (_0xcef323) {
            return _0x1e4a6c['crVCt'](_0xcef323)
          },
          tACrA: _0x1e4a6c['EQvwB'],
          wLBkU: function (_0x5ca56e, _0x49a15f) {
            return _0x1e4a6c['btLEY'](_0x5ca56e, _0x49a15f)
          },
          SJOUV: _0x10e9('2e', 'cwvT'),
          KThFB: _0x1e4a6c[_0x10e9('2f', 'NDW*')],
          kBsEf: _0x1e4a6c['NRDGD'],
          DOVmE: _0x1e4a6c[_0x10e9('30', 'f2Xj')],
          yDPNX: _0x1e4a6c[_0x10e9('31', 'iWHF')],
          EhkPi: _0x1e4a6c[_0x10e9('32', '0)l(')],
          sJhIr: _0x10e9('33', 'Ep4D'),
          USbiJ: _0x1e4a6c[_0x10e9('34', 'N%vF')],
          XmMzV: _0x1e4a6c['qtGbF'],
          AKIKr: _0x1e4a6c[_0x10e9('35', 'nH90')],
          vlcem: function (_0x4ad9b0) {
            return _0x4ad9b0()
          },
          yDXmX: _0x1e4a6c[_0x10e9('36', 'HDIM')],
          jwlod: _0x1e4a6c[_0x10e9('37', 'nX$u')],
        }
        if (_0x550d82 === null) {
          if (
            _0x4dd39e[_0x10e9('38', 'R&#6')](
              _0x1e4a6c[_0x10e9('39', 'f2Xj')]
            ) ||
            _0x4dd39e[_0x10e9('3a', 'nX$u')](
              _0x1e4a6c[_0x10e9('3b', '0)l(')]
            ) ||
            _0x4dd39e[_0x10e9('3c', 'JFZQ')](_0x1e4a6c[_0x10e9('3d', 'cj(J')])
          ) {
            for (
              let _0x57d620 = 0x0;
              _0x1e4a6c[_0x10e9('3e', 'NDW*')](
                _0x57d620,
                cookiesArr[_0x10e9('3f', 'NDW*')]
              );
              _0x57d620++
            ) {
              if (
                _0x1e4a6c[_0x10e9('40', 'zrsV')] !==
                _0x1e4a6c[_0x10e9('41', 'NDW*')]
              ) {
                if (cookiesArr[_0x57d620]) {
                  cookie = cookiesArr[_0x57d620]
                  originCookie = cookiesArr[_0x57d620]
                  $[_0x10e9('42', '0)l(')] = decodeURIComponent(
                    cookie[_0x10e9('43', 'v)*g')](/pt_pin=(.+?);/) &&
                      cookie[_0x10e9('44', '%f!Q')](/pt_pin=(.+?);/)[0x1]
                  )
                  $[_0x10e9('45', 's6PX')] = _0x1e4a6c['ZYPLG'](_0x57d620, 0x1)
                  $['isLogin'] = !![]
                  $['nickName'] = ''
                  message = ''
                  console['log'](
                    _0x10e9('46', 'O!hk') +
                      $[_0x10e9('47', 'hAv@')] +
                      '】' +
                      ($['nickName'] || $[_0x10e9('48', 'e!B*')]) +
                      _0x10e9('49', 'nH90')
                  )
                  if (!$[_0x10e9('4a', 'nX$u')]) {
                    $[_0x10e9('4b', 'w!C6')](
                      $[_0x10e9('4c', '1$GV')],
                      _0x10e9('4d', 'hAv@'),
                      '京东账号' +
                        $[_0x10e9('4e', 'EP(0')] +
                        '\x20' +
                        ($['nickName'] || $[_0x10e9('4f', 'mXjz')]) +
                        '\x0a请重新登录获取\x0ahttps://bean.m.jd.com/bean/signIndex.action',
                      { 'open-url': _0x1e4a6c[_0x10e9('50', 'Ep4D')] }
                    )
                    if ($[_0x10e9('51', 'I3Y2')]()) {
                      if (
                        _0x1e4a6c[_0x10e9('52', 'mXjz')](
                          _0x10e9('53', '9b!a'),
                          _0x1e4a6c['yqHPD']
                        )
                      ) {
                        await notify[_0x10e9('54', 'E!2M')](
                          $['name'] +
                            'cookie已失效\x20-\x20' +
                            $[_0x10e9('48', 'e!B*')],
                          '京东账号' +
                            $['index'] +
                            '\x20' +
                            $['UserName'] +
                            '\x0a请重新登录获取cookie'
                        )
                      } else {
                        $[_0x10e9('55', 'lo[U')](
                          _0x10e9('56', 'D!xA') + voo['discount'] + '】京豆'
                        )
                        $['bean'] += voo[_0x10e9('57', 'zrsV')]
                      }
                    }
                    continue
                  }
                  if (helpAuthor) {
                    if (
                      _0x1e4a6c[_0x10e9('58', 'nGeE')](
                        _0x10e9('59', 'f2Xj'),
                        _0x1e4a6c[_0x10e9('5a', '2KtF')]
                      )
                    ) {
                      function _0x18fe12() {
                        return new Promise((_0x66b320) => {
                          var _0x276dfd = {
                            nUTgk: function (_0x211d8e) {
                              return _0x5254b2[_0x10e9('5b', 'tI^S')](_0x211d8e)
                            },
                          }
                          $[_0x10e9('5c', 'v)*g')](
                            { url: _0x5254b2[_0x10e9('5d', 'cwvT')] },
                            (_0x29a07a, _0x5c0f65, _0xc041c5) => {
                              try {
                                if (_0xc041c5) {
                                  $[_0x10e9('5e', 'v144')] =
                                    JSON[_0x10e9('5f', 'VwSl')](_0xc041c5)
                                }
                              } catch (_0xeb72de) {
                                console[_0x10e9('60', 'xgs4')](_0xeb72de)
                              } finally {
                                _0x276dfd['nUTgk'](_0x66b320)
                              }
                            }
                          )
                        })
                      }
                      function _0x3de5c1(_0x2e9126, _0x5894ed) {
                        var _0x18eae8 = {
                          akaOv: function (_0x279299, _0x436fd1) {
                            return _0x5254b2[_0x10e9('61', '2KtF')](
                              _0x279299,
                              _0x436fd1
                            )
                          },
                          wljVs: _0x5254b2[_0x10e9('62', 'EP(0')],
                          wwlTl: function (_0x129b41) {
                            return _0x129b41()
                          },
                        }
                        if (
                          _0x5254b2['wLBkU'](
                            _0x10e9('63', 'e!B*'),
                            _0x5254b2['DOVmE']
                          )
                        ) {
                          console['log']('' + JSON['stringify'](err))
                        } else {
                          let _0x1b6996 = {
                            url: 'https://api.m.jd.com/client.action',
                            headers: {
                              Host: _0x5254b2['yDPNX'],
                              'Content-Type': _0x5254b2[_0x10e9('64', '$2^q')],
                              Origin: _0x5254b2[_0x10e9('65', 'nX$u')],
                              'Accept-Encoding':
                                _0x5254b2[_0x10e9('66', '1MOl')],
                              Cookie: cookie,
                              Connection: _0x10e9('67', 'iWHF'),
                              Accept: _0x5254b2[_0x10e9('68', 'VwSl')],
                              'User-Agent':
                                'jdapp;iPhone;9.4.0;14.3;;network/wifi;ADID/;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone10,3;addressid/;supportBestPay/0;appBuild/167541;jdSupportDarkMode/0;Mozilla/5.0\x20(iPhone;\x20CPU\x20iPhone\x20OS\x2014_3\x20like\x20Mac\x20OS\x20X)\x20AppleWebKit/605.1.15\x20(KHTML,\x20like\x20Gecko)\x20Mobile/15E148;supportJDSHWK/1',
                              Referer:
                                'https://h5.m.jd.com/babelDiy/Zeus/4ZK4ZpvoSreRB92RRo8bpJAQNoTq/index.html?serveId=wxe30973feca923229&actId=' +
                                _0x2e9126 +
                                _0x10e9('69', '9EX4'),
                              'Accept-Language': _0x5254b2['AKIKr'],
                            },
                            body:
                              _0x10e9('6a', 'nGeE') +
                              _0x2e9126 +
                              _0x10e9('6b', 'N%vF') +
                              _0x5894ed +
                              _0x10e9('6c', 'xgs4'),
                          }
                          return new Promise((_0x360ec7) => {
                            var _0x27d653 = {
                              qIEfh: function (_0x5f4657, _0x3e57c8) {
                                return _0x5254b2[_0x10e9('6d', 'x2Q3')](
                                  _0x5f4657,
                                  _0x3e57c8
                                )
                              },
                              RLiSv: _0x10e9('6e', 'E!2M'),
                            }
                            if (
                              _0x5254b2[_0x10e9('6f', '$2^q')] ===
                              _0x5254b2['KThFB']
                            ) {
                              $[_0x10e9('70', 'E!2M')](
                                _0x1b6996,
                                (_0x207827, _0x1b8809, _0x392407) => {
                                  if (_0x392407) {
                                    $[_0x10e9('71', 'cj(J')] =
                                      JSON[_0x10e9('72', 'w!C6')](_0x392407)
                                    _0x360ec7()
                                  }
                                }
                              )
                            } else {
                              $[_0x10e9('73', '&Xs7')](
                                _0x1b6996,
                                (_0x396ccc, _0x429b55, _0xad4f8e) => {
                                  if (_0xad4f8e) {
                                    if (
                                      _0x18eae8[_0x10e9('74', 'd$hz')](
                                        _0x18eae8['wljVs'],
                                        _0x18eae8[_0x10e9('75', '0)l(')]
                                      )
                                    ) {
                                      $[_0x10e9('76', 'v)*g')] =
                                        JSON['parse'](_0xad4f8e)
                                      _0x18eae8[_0x10e9('77', 'e!B*')](
                                        _0x360ec7
                                      )
                                    } else {
                                      Object['keys'](jdCookieNode)['forEach'](
                                        (_0x4d3a8b) => {
                                          cookiesArr[_0x10e9('78', 'WTz5')](
                                            jdCookieNode[_0x4d3a8b]
                                          )
                                        }
                                      )
                                      if (
                                        process['env'][_0x10e9('79', 'mXjz')] &&
                                        _0x27d653[_0x10e9('7a', 'v144')](
                                          process[_0x10e9('7b', 'R&#6')][
                                            'JD_DEBUG'
                                          ],
                                          _0x27d653['RLiSv']
                                        )
                                      )
                                        console[_0x10e9('7c', 'VwSl')] =
                                          () => {}
                                    }
                                  }
                                }
                              )
                            }
                          })
                        }
                      }
                      function _0x4fe57b(_0x25bef2, _0x1e18ec) {
                        if (
                          _0x1e4a6c[_0x10e9('7d', 'HDIM')](
                            _0x1e4a6c[_0x10e9('7e', '2KtF')],
                            _0x1e4a6c[_0x10e9('7e', '2KtF')]
                          )
                        ) {
                          console['log'](e)
                        } else {
                          let _0x22bf21 = {
                            url: _0x1e4a6c[_0x10e9('7f', 'hAv@')],
                            headers: { 'Content-Type': _0x10e9('80', 'mXjz') },
                            body: JSON[_0x10e9('81', 'Ep4D')]({
                              actID: _0x25bef2,
                              actsID: _0x1e18ec,
                              done: 0x1,
                            }),
                          }
                          return new Promise((_0x350226) => {
                            var _0x1c02ce = {
                              GJnlL: function (_0x584881) {
                                return _0x5254b2[_0x10e9('82', 'v)*g')](
                                  _0x584881
                                )
                              },
                              XeHpk: function (_0x41f58c) {
                                return _0x41f58c()
                              },
                            }
                            if (
                              _0x5254b2['wLBkU'](
                                _0x5254b2[_0x10e9('83', '&Xs7')],
                                _0x5254b2[_0x10e9('84', 'PvYR')]
                              )
                            ) {
                              $[_0x10e9('85', 'N%vF')](
                                _0x22bf21,
                                (_0x547eef, _0x406a23, _0x123c0a) => {
                                  _0x1c02ce[_0x10e9('86', 'PvYR')](_0x350226)
                                }
                              )
                            } else {
                              if (data) {
                                $['zRes'] = JSON[_0x10e9('87', 'rKUJ')](data)
                                _0x1c02ce[_0x10e9('88', 'D!xA')](_0x350226)
                              }
                            }
                          })
                        }
                      }
                      await _0x1e4a6c[_0x10e9('89', 'I3Y2')](_0x18fe12)
                      if (
                        $['zData'][_0x10e9('8a', '8@Qm')][
                          _0x10e9('8b', '1$GV')
                        ] !== 0x0
                      ) {
                        for (
                          let _0x57d620 = 0x0;
                          _0x1e4a6c[_0x10e9('8c', 'zrsV')](
                            _0x57d620,
                            $[_0x10e9('8d', 'R^[7')][_0x10e9('8e', 'xgs4')][
                              'length'
                            ]
                          );
                          _0x57d620++
                        ) {
                          if (
                            _0x1e4a6c['JiClV'](
                              _0x1e4a6c['iCQqf'],
                              _0x1e4a6c[_0x10e9('8f', 'w!C6')]
                            )
                          ) {
                            actID =
                              $['zData'][_0x10e9('90', 'w!C6')][_0x57d620][
                                'actID'
                              ]
                            actsID =
                              $[_0x10e9('91', 'f2Xj')][_0x10e9('92', 'vvmK')][
                                _0x57d620
                              ][_0x10e9('93', 'VwSl')]
                            await _0x3de5c1(actID, actsID)
                            await $[_0x10e9('94', 'R&#6')](0x5dc)
                            if (
                              $[_0x10e9('95', 'v)*g')] &&
                              _0x1e4a6c[_0x10e9('96', 'VwSl')](
                                $['Res'][_0x10e9('97', 'EP(0')],
                                0x4
                              )
                            ) {
                              await _0x4fe57b(actID, actsID)
                            }
                          } else {
                            $[_0x10e9('98', '9b!a')](
                              _0x10e9('99', '$2^q') +
                                voo['discount'] +
                                _0x10e9('9a', 'rKUJ')
                            )
                          }
                        }
                      }
                    } else {
                      var _0x298857 = {
                        xKrzl: function (_0x437366) {
                          return _0x1e4a6c['hXzXF'](_0x437366)
                        },
                      }
                      $['post'](opt, (_0x530260, _0x20af58, _0x2631a0) => {
                        _0x298857['xKrzl'](resolve)
                      })
                    }
                  }
                }
              } else {
                $[_0x10e9('9b', 'HDIM')](_0x5254b2[_0x10e9('9c', 'hAv@')])
              }
            }
            await notify[_0x10e9('9d', 'f2Xj')](
              $[_0x10e9('9e', 'D!xA')],
              _0x1e4a6c[_0x10e9('9f', 'tI^S')]
            )
            $['log'](_0x1e4a6c[_0x10e9('a0', '$2^q')])
            return
          }
        }
      }
    )
  }
  for (
    let _0x3ec7a8 = 0x0;
    _0x1e4a6c['rFRIA'](_0x3ec7a8, cookiesArr[_0x10e9('a1', 'rKUJ')]);
    _0x3ec7a8++
  ) {
    await getACT_ID()
    $[_0x10e9('a2', 'PvYR')](
      '共获得' +
        $[_0x10e9('a3', 'v)*g')][_0x10e9('a4', 'N%vF')] +
        _0x10e9('a5', 'v144')
    )
    if (cookiesArr[_0x3ec7a8]) {
      cookie = cookiesArr[_0x3ec7a8]
      originCookie = cookiesArr[_0x3ec7a8]
      $[_0x10e9('a6', 'WTz5')] = _0x1e4a6c[_0x10e9('a7', 'WdS1')](
        decodeURIComponent,
        cookie['match'](/pt_pin=(.+?);/) &&
          cookie['match'](/pt_pin=(.+?);/)[0x1]
      )
      $[_0x10e9('a8', 'v)*g')] = _0x1e4a6c['ZYPLG'](_0x3ec7a8, 0x1)
      $[_0x10e9('a9', 'R^[7')] = !![]
      $[_0x10e9('aa', 'HDIM')] = ''
      console[_0x10e9('ab', 'nGeE')](
        '\x0a*******开始【京东账号' +
          $[_0x10e9('ac', 'xgs4')] +
          '】' +
          ($[_0x10e9('ad', '0)l(')] || $['UserName']) +
          _0x10e9('ae', 'nGeE')
      )
      await _0x1e4a6c['hUptD'](checkCookie)
      if (!$['isLogin']) {
        $[_0x10e9('af', 'VwSl')](
          $['name'],
          '【提示】cookie已失效',
          _0x10e9('b0', 'tI^S') +
            $['index'] +
            '\x20' +
            ($['nickName'] || $['UserName']) +
            _0x10e9('b1', 'rKUJ'),
          { 'open-url': _0x1e4a6c['ULvwv'] }
        )
        if ($[_0x10e9('b2', 'tI^S')]()) {
          await notify[_0x10e9('b3', 'Ep4D')](
            $[_0x10e9('b4', 'WTz5')] + _0x10e9('b5', 'xgs4') + $['UserName'],
            _0x10e9('b6', '0)l(') +
              $[_0x10e9('b7', 'iWHF')] +
              '\x20' +
              $[_0x10e9('b8', 'vvmK')] +
              '\x0a请重新登录获取cookie'
          )
        }
        continue
      }
      if (helpAuthor) {
        if (
          _0x1e4a6c[_0x10e9('b9', '0)l(')](
            _0x1e4a6c['abbPS'],
            _0x1e4a6c[_0x10e9('ba', 'v)*g')]
          )
        ) {
          $['zData'] = JSON[_0x10e9('bb', 'nX$u')](data)
        } else {
          function _0x584a0c() {
            var _0x30c2e9 = {
              IheYX: function (_0x2580ec, _0x16635b) {
                return _0x2580ec !== _0x16635b
              },
              yqVuA: function (_0x5a2f74, _0x537c91) {
                return _0x1e4a6c[_0x10e9('bc', 'NDW*')](_0x5a2f74, _0x537c91)
              },
              Zsjwk: _0x10e9('bd', 'Jr*$'),
              rLuPs: _0x1e4a6c[_0x10e9('be', 'nGeE')],
              sbHQP: 'rnKID',
              iGDui: function (_0x34e711) {
                return _0x1e4a6c[_0x10e9('bf', 'NDW*')](_0x34e711)
              },
              CADZN: _0x1e4a6c['EQvwB'],
            }
            return new Promise((_0x1af22e) => {
              var _0xbf77e0 = {
                TTBPr: function (_0x343d6e, _0x5c9f49) {
                  return _0x30c2e9[_0x10e9('c0', 'cwvT')](_0x343d6e, _0x5c9f49)
                },
                ssbJH: 'WWajh',
                yIpcL: function (_0x2a48c2, _0x4c7fd1) {
                  return _0x30c2e9[_0x10e9('c1', 'R&#6')](_0x2a48c2, _0x4c7fd1)
                },
                XjmzH: _0x30c2e9[_0x10e9('c2', 'cwvT')],
                fQwAR: _0x30c2e9[_0x10e9('c3', '8@Qm')],
                nENOk: _0x30c2e9[_0x10e9('c4', 'nGeE')],
                WakqG: function (_0x4af582) {
                  return _0x30c2e9[_0x10e9('c5', 'cj(J')](_0x4af582)
                },
              }
              $[_0x10e9('c6', 'D!xA')](
                { url: _0x30c2e9[_0x10e9('c7', 'Jr*$')] },
                (_0x5954a1, _0x37b131, _0x11cd33) => {
                  if (
                    _0xbf77e0[_0x10e9('c8', 'cj(J')](
                      _0xbf77e0[_0x10e9('c9', 'HDIM')],
                      _0x10e9('ca', 'mXjz')
                    )
                  ) {
                    $[_0x10e9('cb', '1MOl')](_0x10e9('cc', 'nH90'))
                  } else {
                    try {
                      if (
                        _0xbf77e0[_0x10e9('cd', 'WTz5')](
                          _0xbf77e0[_0x10e9('ce', '9EX4')],
                          _0xbf77e0['fQwAR']
                        )
                      ) {
                        $['done']()
                      } else {
                        if (_0x11cd33) {
                          $[_0x10e9('cf', 'e!B*')] =
                            JSON[_0x10e9('d0', 'lo[U')](_0x11cd33)
                        }
                      }
                    } catch (_0x267377) {
                      if (
                        _0xbf77e0['yIpcL'](
                          _0xbf77e0[_0x10e9('d1', 'HDIM')],
                          _0xbf77e0[_0x10e9('d2', 'PvYR')]
                        )
                      ) {
                        console[_0x10e9('d3', '$2^q')](_0x267377)
                      } else {
                        if (_0x5954a1) {
                          console[_0x10e9('98', '9b!a')](
                            '' + JSON[_0x10e9('81', 'Ep4D')](_0x5954a1)
                          )
                        } else {
                          _0x11cd33 = JSON[_0x10e9('d4', 'hAv@')](_0x11cd33)
                          if (
                            _0x11cd33 &&
                            _0x11cd33[_0x10e9('d5', 'cwvT')] === 0xc8
                          ) {
                            $['log'](_0x11cd33[_0x10e9('4b', 'w!C6')])
                          }
                        }
                      }
                    } finally {
                      _0xbf77e0[_0x10e9('d6', 'WTz5')](_0x1af22e)
                    }
                  }
                }
              )
            })
          }
          function _0x363134(_0x5e73a7, _0x59a954) {
            var _0x512b8f = {
              CAKGj: _0x1e4a6c['ixuEn'],
              RsuLR: function (_0x43f5a8) {
                return _0x1e4a6c[_0x10e9('d7', 'lo[U')](_0x43f5a8)
              },
            }
            if (
              _0x1e4a6c['zXdPE'](_0x10e9('d8', 'HDIM'), _0x10e9('d9', '0)l('))
            ) {
              resolve()
            } else {
              let _0x4e85a5 = {
                url: 'https://api.m.jd.com/client.action',
                headers: {
                  Host: _0x10e9('da', 'tI^S'),
                  'Content-Type': 'application/x-www-form-urlencoded',
                  Origin: _0x1e4a6c[_0x10e9('db', 'R&#6')],
                  'Accept-Encoding': _0x1e4a6c['LjAXJ'],
                  Cookie: cookie,
                  Connection: _0x1e4a6c['PRjiw'],
                  Accept: _0x1e4a6c[_0x10e9('dc', 's6PX')],
                  'User-Agent': _0x10e9('dd', 'zrsV'),
                  Referer:
                    _0x10e9('de', 'HDIM') + _0x5e73a7 + _0x10e9('df', 'Ep4D'),
                  'Accept-Language': _0x1e4a6c[_0x10e9('e0', 'rKUJ')],
                },
                body:
                  _0x10e9('e1', 'Jr*$') +
                  _0x5e73a7 +
                  '\x22,\x22userName\x22:\x22\x22,\x22followShop\x22:1,\x22shopId\x22:' +
                  _0x59a954 +
                  _0x10e9('e2', '9b!a'),
              }
              return new Promise((_0x5a952b) => {
                if (
                  _0x1e4a6c['hvtTl'](_0x10e9('e3', '0)l('), _0x1e4a6c['fPdFf'])
                ) {
                  $['post'](_0x4e85a5, (_0xded42b, _0x3dedfa, _0x5c0f6d) => {
                    if (
                      _0x512b8f[_0x10e9('e4', 'R&#6')] !== _0x10e9('e5', 'iWHF')
                    ) {
                      if (_0x5c0f6d) {
                        $['zRes'] = JSON['parse'](_0x5c0f6d)
                        _0x512b8f['RsuLR'](_0x5a952b)
                      }
                    } else {
                      if (_0x5c0f6d) {
                        $['zData'] = JSON[_0x10e9('e6', 'cwvT')](_0x5c0f6d)
                      }
                    }
                  })
                } else {
                  $[_0x10e9('e7', 'nH90')](e, resp)
                }
              })
            }
          }
          function _0x19cf7e(_0x1f10fa, _0x225306) {
            var _0x13d56e = {
              EpZhr: _0x1e4a6c[_0x10e9('e8', 'EP(0')],
              hyJuI: _0x1e4a6c[_0x10e9('e9', 'WdS1')],
              OamqM: function (_0x3e8f4e, _0x14b2c2) {
                return _0x3e8f4e === _0x14b2c2
              },
              LvakL: _0x1e4a6c['kXEXa'],
              kMUeN: 'IgTTj',
            }
            if (
              _0x1e4a6c['zXdPE'](_0x10e9('ea', 'nGeE'), _0x10e9('eb', 'D!xA'))
            ) {
              _0x1e4a6c[_0x10e9('ec', 'Ep4D')](resolve)
            } else {
              let _0x563371 = {
                url: 'https://api.r2ray.com/jd.bargain/done',
                headers: { 'Content-Type': _0x1e4a6c['LzGwI'] },
                body: JSON[_0x10e9('ed', 'R^[7')]({
                  actID: _0x1f10fa,
                  actsID: _0x225306,
                  done: 0x1,
                }),
              }
              return new Promise((_0x53d91e) => {
                var _0x282258 = {
                  eJpVJ: _0x13d56e[_0x10e9('ee', 'PkMj')],
                  jWKsi: _0x13d56e['hyJuI'],
                }
                if (
                  _0x13d56e['OamqM'](
                    _0x13d56e[_0x10e9('ef', 'E!2M')],
                    _0x13d56e['kMUeN']
                  )
                ) {
                  let _0x22feb5 = $[_0x10e9('f0', '$2^q')]('CookiesJD') || '[]'
                  _0x22feb5 = JSON['parse'](_0x22feb5)
                  cookiesArr = _0x22feb5[_0x10e9('f1', 'D!xA')](
                    (_0x32e313) => _0x32e313[_0x10e9('f2', 'x2Q3')]
                  )
                  cookiesArr[_0x10e9('f3', 'Jr*$')]()
                  cookiesArr['push'](
                    ...[
                      $[_0x10e9('f4', 'VwSl')](
                        _0x282258[_0x10e9('f5', 'N%vF')]
                      ),
                      $[_0x10e9('f6', '%f!Q')](_0x282258['jWKsi']),
                    ]
                  )
                  cookiesArr['reverse']()
                  cookiesArr = cookiesArr[_0x10e9('f7', 'VwSl')](
                    (_0x26e7e7) => !!_0x26e7e7
                  )
                } else {
                  $['post'](_0x563371, (_0x12fbf9, _0x58721f, _0x56be25) => {
                    _0x53d91e()
                  })
                }
              })
            }
          }
          await _0x584a0c()
          if (
            _0x1e4a6c[_0x10e9('f8', 'xgs4')](
              $['zData'][_0x10e9('f9', 'VwSl')]['length'],
              0x0
            )
          ) {
            for (
              let _0x3ec7a8 = 0x0;
              _0x1e4a6c[_0x10e9('fa', 'VwSl')](
                _0x3ec7a8,
                $[_0x10e9('fb', 'O!hk')]['data'][_0x10e9('fc', 'v)*g')]
              );
              _0x3ec7a8++
            ) {
              var _0x860313 = _0x10e9('fd', 'lo[U')['split']('|'),
                _0x36b85e = 0x0
              while (!![]) {
                switch (_0x860313[_0x36b85e++]) {
                  case '0':
                    await _0x1e4a6c[_0x10e9('fe', 'N%vF')](
                      _0x363134,
                      actID,
                      actsID
                    )
                    continue
                  case '1':
                    if (
                      $[_0x10e9('ff', 'E!2M')] &&
                      _0x1e4a6c[_0x10e9('100', 'I3Y2')](
                        $[_0x10e9('101', '$2^q')][_0x10e9('102', 'NDW*')],
                        0x4
                      )
                    ) {
                      await _0x1e4a6c[_0x10e9('103', '1$GV')](
                        _0x19cf7e,
                        actID,
                        actsID
                      )
                    }
                    continue
                  case '2':
                    actsID =
                      $[_0x10e9('104', 'hAv@')][_0x10e9('8a', '8@Qm')][
                        _0x3ec7a8
                      ]['actsID']
                    continue
                  case '3':
                    await $[_0x10e9('105', 'zrsV')](0x5dc)
                    continue
                  case '4':
                    actID =
                      $[_0x10e9('106', '8@Qm')]['data'][_0x3ec7a8][
                        _0x10e9('107', 'R^[7')
                      ]
                    continue
                }
                break
              }
            }
          }
        }
      }
      $[_0x10e9('108', 'WdS1')] = 0x0
      $['ADID'] = await _0x1e4a6c[_0x10e9('109', 'N%vF')](
        getUUID,
        'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        0x1
      )
      $['UUID'] = await _0x1e4a6c[_0x10e9('10a', 'xgs4')](
        getUUID,
        _0x10e9('10b', 'x2Q3')
      )
      $[_0x10e9('10c', '1$GV')] = await _0x1e4a6c[_0x10e9('10d', 'v144')](
        getUUID,
        _0x1e4a6c[_0x10e9('10e', 'w!C6')]
      )
      for (
        let _0x1ca833 = 0x0;
        _0x1ca833 < $[_0x10e9('10f', 'x2Q3')]['length'];
        _0x1ca833++
      ) {
        if (
          _0x1e4a6c[_0x10e9('110', 'nX$u')] !==
          _0x1e4a6c[_0x10e9('111', '1MOl')]
        ) {
          $[_0x10e9('112', 'nH90')] =
            $[_0x10e9('113', 'v144')][_0x1ca833][_0x10e9('114', '8@Qm')]
          $['actEndTime'] = $['ACT_IDarr'][_0x1ca833][_0x10e9('115', '$2^q')]
          $[_0x10e9('116', 'N%vF')](
            '\x0a开始第' + _0x1e4a6c['CdGBY'](_0x1ca833, 0x1) + '个活动'
          )
          await _0x1e4a6c['FYjYo'](interact_shop_sign)
        } else {
          resolve()
        }
      }
      if ($[_0x10e9('117', 'E!2M')] > 0x0) {
        if (
          _0x1e4a6c[_0x10e9('118', 'w!C6')](
            _0x1e4a6c[_0x10e9('119', 'nGeE')],
            _0x10e9('11a', '1$GV')
          )
        ) {
          var _0x357c3d = _0x1e4a6c[_0x10e9('11b', 'zrsV')](
              _0x1e4a6c[_0x10e9('11c', 'v144')](
                Math[_0x10e9('11d', 'EP(0')](),
                0x10
              ),
              0x0
            ),
            _0x190e68 = _0x1e4a6c['AHcye'](c, 'x')
              ? _0x357c3d
              : _0x1e4a6c['IJCKY'](
                  _0x1e4a6c[_0x10e9('11e', 'v)*g')](_0x357c3d, 0x3),
                  0x8
                )
          if (UpperCase) {
            uuid = _0x190e68['toString'](0x24)[_0x10e9('11f', '0)l(')]()
          } else {
            uuid = _0x190e68[_0x10e9('120', 'E!2M')](0x24)
          }
          return uuid
        } else {
          message +=
            _0x10e9('121', 'x2Q3') +
            $[_0x10e9('122', '%f!Q')] +
            '】' +
            ($[_0x10e9('123', 'nGeE')] || $['UserName']) +
            _0x10e9('124', '%f!Q') +
            $[_0x10e9('125', 'zrsV')] +
            _0x10e9('126', '2KtF')
        }
      }
    }
  }
  if (_0x1e4a6c[_0x10e9('127', '%f!Q')](message, '')) {
    if (_0x1e4a6c['QdaxF']('SAbwX', _0x10e9('128', '%f!Q'))) {
      if ($['isNode']()) {
        await notify[_0x10e9('129', 'N%vF')]($[_0x10e9('12a', 'v144')], message)
      } else {
        $[_0x10e9('12b', 'I3Y2')](
          $[_0x10e9('12c', 'EP(0')],
          _0x1e4a6c[_0x10e9('12d', 'D!xA')],
          message
        )
      }
    } else {
      if (data) {
        $[_0x10e9('12e', 'JFZQ')] = JSON['parse'](data)
        _0x1e4a6c['TbRHY'](resolve)
      }
    }
  }
})()
  [_0x10e9('12f', 'nGeE')]((_0x477ac5) => {
    $[_0x10e9('cb', '1MOl')](
      '',
      '❌\x20' +
        $[_0x10e9('130', 'mXjz')] +
        ',\x20失败!\x20原因:\x20' +
        _0x477ac5 +
        '!',
      ''
    )
  })
  [_0x10e9('131', '1$GV')](() => {
    $[_0x10e9('132', 'vvmK')]()
  })
async function interact_shop_sign() {
  var _0x75e5db = {
    XDadE: function (_0x44062e) {
      return _0x44062e()
    },
    rNEQa: function (_0x51ab89, _0x2105a4, _0x151cb7) {
      return _0x51ab89(_0x2105a4, _0x151cb7)
    },
    eUzuq: _0x10e9('133', 'rKUJ'),
    FNzSX: function (_0x437907, _0x275feb) {
      return _0x437907 === _0x275feb
    },
    mRpcq: function (_0x2893e5, _0x3486c6) {
      return _0x2893e5 === _0x3486c6
    },
    kRgEr: _0x10e9('134', 'mXjz'),
    hDKYS: 'QHDMk',
    fCXVG: _0x10e9('135', 'hAv@'),
  }
  await _0x75e5db[_0x10e9('136', 'O!hk')](doTask, _0x10e9('137', 'VwSl'), {
    token: $[_0x10e9('138', 'PvYR')],
    venderId: '',
  })
  if ($[_0x10e9('139', '9EX4')]) {
    if (
      _0x75e5db[_0x10e9('13a', 'I3Y2')] !== _0x75e5db[_0x10e9('13b', '&Xs7')]
    ) {
      $[_0x10e9('13c', 'cj(J')](data[_0x10e9('13d', 'O!hk')])
    } else {
      if (_0x75e5db[_0x10e9('13e', 'iWHF')]($[_0x10e9('13f', 'hAv@')], 0x1)) {
        await _0x75e5db[_0x10e9('140', 'cwvT')](
          doTask,
          _0x10e9('141', 'e!B*'),
          {
            token: $['actID'],
            venderId: $[_0x10e9('142', 'I3Y2')],
            activityId: $[_0x10e9('143', 'nH90')],
            type: 0x38,
            actionType: 0x7,
          }
        )
      } else {
        if (
          _0x75e5db[_0x10e9('144', 's6PX')](
            _0x75e5db['kRgEr'],
            _0x75e5db[_0x10e9('145', 'E!2M')]
          )
        ) {
          $['get'](opt, (_0x60778d, _0x229a95, _0x10eebd) => {
            _0x75e5db[_0x10e9('146', 'PkMj')](resolve)
          })
        } else {
          $[_0x10e9('147', 'O!hk')](_0x75e5db['fCXVG'])
        }
      }
    }
  }
}
function doTask(_0x1746d1, _0x2e1096) {
  var _0x185317 = {
    ZAGPC: _0x10e9('148', '1$GV'),
    ybKGV: _0x10e9('149', '0)l('),
    ZGgKu: _0x10e9('14a', 'EP(0'),
    NFMna: _0x10e9('14b', 'iWHF'),
    EjjJj: _0x10e9('14c', 'PvYR'),
    HixtE: 'interact_center_shopSign_signCollectGift',
    MbZfa: function (_0x380ef6, _0xf44aec) {
      return _0x380ef6 === _0xf44aec
    },
    jtOmq: 'YKlRU',
    nBxGs: _0x10e9('14d', 'nGeE'),
    EIorI: _0x10e9('14e', '$2^q'),
    qpXKI: _0x10e9('14f', 'nX$u'),
    PcCWf: function (_0x3ea433, _0x993bd) {
      return _0x3ea433 !== _0x993bd
    },
    HHuWI: 'euOaT',
  }
  return new Promise((_0x16d5e5) => {
    var _0x287f33 = {
      RoQGl: _0x185317[_0x10e9('150', 'e!B*')],
      rCXfZ: function (_0x321339, _0x288636) {
        return _0x321339 === _0x288636
      },
      wuWwW: _0x185317[_0x10e9('151', 's6PX')],
      NqXoe: _0x185317[_0x10e9('152', 'HDIM')],
      WOEQq: _0x185317[_0x10e9('153', '$2^q')],
      tJwSe: _0x185317[_0x10e9('154', 'PvYR')],
      qMeNe: function (_0x15902b, _0x1a991f, _0x1e7c54) {
        return _0x15902b(_0x1a991f, _0x1e7c54)
      },
      JIqhU: _0x185317['HixtE'],
      gbylN: function (_0x375755, _0x1e9ece) {
        return _0x185317[_0x10e9('155', 'd$hz')](_0x375755, _0x1e9ece)
      },
      fYglJ: _0x185317[_0x10e9('156', 'D!xA')],
      vAUaU: function (_0x3fb927, _0x38c636) {
        return _0x3fb927 !== _0x38c636
      },
      lxZQI: function (_0x4e41ab, _0x54b29d) {
        return _0x4e41ab === _0x54b29d
      },
      AOPAH: function (_0x18cac7, _0x4ff697) {
        return _0x185317[_0x10e9('157', 'JFZQ')](_0x18cac7, _0x4ff697)
      },
      AoEZm: _0x185317[_0x10e9('158', '1MOl')],
      wSybs: _0x185317[_0x10e9('159', 'Jr*$')],
      awVWD: 'JJFQT',
      iPfoS: _0x185317[_0x10e9('15a', 'zrsV')],
    }
    if (
      _0x185317[_0x10e9('15b', '1$GV')](
        _0x185317[_0x10e9('15c', 'nX$u')],
        _0x185317[_0x10e9('15d', 'PkMj')]
      )
    ) {
      _0x16d5e5()
    } else {
      $[_0x10e9('15e', 'vvmK')](
        taskUrl(_0x1746d1, _0x2e1096),
        async (_0xaa67e5, _0x5781a8, _0xd96c74) => {
          var _0x2552f8 = {
            vqpoG: function (_0x9b6146, _0x663309) {
              return _0x287f33[_0x10e9('15f', 'zrsV')](_0x9b6146, _0x663309)
            },
            fqwWQ: _0x287f33['wuWwW'],
            xpxdD: _0x10e9('160', 'E!2M'),
          }
          try {
            if (_0xaa67e5) {
              $[_0x10e9('161', 'iWHF')](_0x10e9('162', 'PvYR') + _0xaa67e5)
            } else {
              if (_0xd96c74) {
                if (
                  _0x287f33[_0x10e9('163', 'Ep4D')](_0x287f33['NqXoe'], 'FKIdc')
                ) {
                  _0xd96c74 = JSON[_0x10e9('164', 'nH90')](_0xd96c74)
                  switch (_0x1746d1) {
                    case _0x287f33[_0x10e9('165', 'v144')]:
                      switch (_0xd96c74['code']) {
                        case 0xc8:
                          $[_0x10e9('166', 'cwvT')](
                            '开启活动：' +
                              _0xd96c74[_0x10e9('167', '1$GV')][
                                _0x10e9('168', '9b!a')
                              ]
                          )
                          $[_0x10e9('169', 'lo[U')] =
                            _0xd96c74[_0x10e9('16a', 'rKUJ')][
                              _0x10e9('16b', 'EP(0')
                            ]
                          $[_0x10e9('16c', 'VwSl')] = _0xd96c74['data']['id']
                          $[_0x10e9('16d', 'v144')] =
                            _0xd96c74[_0x10e9('16e', '2KtF')][
                              _0x10e9('16f', 'x2Q3')
                            ]
                          if (
                            $[_0x10e9('170', 'e!B*')] === 0x1b7ca8d1e38 &&
                            _0xd96c74[_0x10e9('171', 'N%vF')]['endTime']
                          ) {
                            if (
                              _0x287f33[_0x10e9('172', 's6PX')] !==
                              _0x10e9('173', 'x2Q3')
                            ) {
                              await _0x287f33['qMeNe'](
                                updateActInfo,
                                $[_0x10e9('174', '2KtF')],
                                _0xd96c74[_0x10e9('175', 'PkMj')][
                                  _0x10e9('176', '1$GV')
                                ]
                              )
                            } else {
                              _0xd96c74 = JSON[_0x10e9('9', 'xgs4')](_0xd96c74)
                              if (
                                _0xd96c74 &&
                                _0x2552f8[_0x10e9('177', 'PvYR')](
                                  _0xd96c74[_0x10e9('178', 'zrsV')],
                                  0xc8
                                )
                              ) {
                                $[_0x10e9('d3', '$2^q')](_0xd96c74['msg'])
                              }
                            }
                          }
                          break
                        case 0x192:
                          $[_0x10e9('179', 'f2Xj')](
                            _0xd96c74[_0x10e9('17a', 'zrsV')]
                          )
                          await delActInfo($['actID'])
                          break
                        default:
                          $[_0x10e9('d3', '$2^q')](
                            _0xd96c74[_0x10e9('17b', '1MOl')]
                          )
                          break
                      }
                      break
                    case _0x287f33[_0x10e9('17c', 'hAv@')]:
                      if (
                        _0x287f33[_0x10e9('17d', 'mXjz')](
                          _0xd96c74['code'],
                          0xc8
                        )
                      ) {
                        if (
                          _0x287f33['gbylN'](
                            _0x287f33[_0x10e9('17e', 'HDIM')],
                            _0x10e9('17f', '9b!a')
                          )
                        ) {
                          if (
                            _0x287f33[_0x10e9('180', 'iWHF')](
                              _0xd96c74[_0x10e9('8a', '8@Qm')]['length'],
                              0x0
                            )
                          ) {
                            for (const _0x3fe302 of _0xd96c74[
                              _0x10e9('f9', 'VwSl')
                            ]) {
                              for (const _0x351859 of _0x3fe302[
                                _0x10e9('181', 'tI^S')
                              ]) {
                                if (_0x351859['type'] === 0x4) {
                                  $[_0x10e9('98', '9b!a')](
                                    _0x10e9('182', 'w!C6') +
                                      _0x351859[_0x10e9('183', 'vvmK')] +
                                      _0x10e9('184', '8@Qm')
                                  )
                                  $[_0x10e9('185', 'O!hk')] +=
                                    _0x351859[_0x10e9('186', '1MOl')]
                                }
                                if (
                                  _0x287f33[_0x10e9('187', 'JFZQ')](
                                    _0x351859['type'],
                                    0x6
                                  )
                                ) {
                                  $[_0x10e9('188', '&Xs7')](
                                    _0x10e9('189', 'NDW*') +
                                      _0x351859[_0x10e9('18a', 'w!C6')] +
                                      '】积分'
                                  )
                                }
                              }
                            }
                          } else {
                            if (
                              _0x287f33['AOPAH'](
                                _0x287f33[_0x10e9('18b', 'vvmK')],
                                _0x287f33[_0x10e9('18c', 'EP(0')]
                              )
                            ) {
                              $[_0x10e9('18d', 'JFZQ')](
                                _0x287f33[_0x10e9('18e', 'vvmK')]
                              )
                            } else {
                              message +=
                                _0x10e9('18f', 'e!B*') +
                                $[_0x10e9('45', 's6PX')] +
                                '】' +
                                ($[_0x10e9('190', 'Ep4D')] ||
                                  $[_0x10e9('a6', 'WTz5')]) +
                                _0x10e9('191', 'mXjz') +
                                $['bean'] +
                                _0x10e9('192', 'NDW*')
                            }
                          }
                        } else {
                          if (
                            _0x2552f8[_0x10e9('193', '8@Qm')](
                              voo[_0x10e9('194', 'N%vF')],
                              0x4
                            )
                          ) {
                            $[_0x10e9('195', 'WdS1')](
                              _0x10e9('196', 'v144') +
                                voo['discount'] +
                                _0x10e9('197', 'NDW*')
                            )
                            $['bean'] += voo[_0x10e9('198', 'R&#6')]
                          }
                          if (voo[_0x10e9('199', 'v144')] === 0x6) {
                            $['log'](
                              _0x10e9('19a', 'PkMj') +
                                voo[_0x10e9('19b', 's6PX')] +
                                _0x10e9('19c', 'O!hk')
                            )
                          }
                        }
                      } else {
                        $[_0x10e9('19d', 'nX$u')](_0xd96c74['msg'])
                      }
                      break
                    default:
                      break
                  }
                } else {
                  let _0x55dd07 = {
                    url: _0x2552f8['fqwWQ'],
                    headers: {
                      'Content-Type': _0x2552f8[_0x10e9('19e', '%f!Q')],
                    },
                    body: JSON['stringify']({
                      actID: actID,
                      actsID: actsID,
                      done: 0x1,
                    }),
                  }
                  return new Promise((_0x1ddc69) => {
                    var _0x1c376d = {
                      rcGED: function (_0x215941) {
                        return _0x215941()
                      },
                    }
                    $[_0x10e9('19f', 'R^[7')](
                      _0x55dd07,
                      (_0x4a1f0c, _0x56ff34, _0x10aac1) => {
                        _0x1c376d['rcGED'](_0x1ddc69)
                      }
                    )
                  })
                }
              } else {
                if (
                  _0x287f33[_0x10e9('1a0', 'mXjz')](
                    'NMQRh',
                    _0x287f33[_0x10e9('1a1', 'D!xA')]
                  )
                ) {
                  $[_0x10e9('161', 'iWHF')]('京东返回了一段空数据')
                } else {
                  uuid = v[_0x10e9('1a2', 'nX$u')](0x24)['toUpperCase']()
                }
              }
            }
          } catch (_0xa241f4) {
            if (
              _0x287f33[_0x10e9('1a3', 'WdS1')](
                _0x287f33[_0x10e9('1a4', 'iWHF')],
                _0x287f33[_0x10e9('1a5', '8@Qm')]
              )
            ) {
              $[_0x10e9('166', 'cwvT')](_0x10e9('1a6', 'vvmK') + _0xa241f4)
            } else {
              let _0x3001a4 = {
                url: _0x10e9('1a7', '1MOl') + act_id,
                headers: { 'Content-Type': _0x287f33[_0x10e9('1a8', 'HDIM')] },
              }
              return new Promise((_0x18a383) => {
                var _0xfd014e = {
                  srZgG: function (_0x2012ab) {
                    return _0x2012ab()
                  },
                }
                $[_0x10e9('1a9', '1MOl')](
                  _0x3001a4,
                  (_0x1d79ce, _0x1add95, _0x9d4545) => {
                    _0xfd014e['srZgG'](_0x18a383)
                  }
                )
              })
            }
          } finally {
            _0x16d5e5()
          }
        }
      )
    }
  })
}
function delActInfo(_0x2cf263) {
  var _0x5b1ca1 = {
    NsFHQ: function (_0x15c0f4) {
      return _0x15c0f4()
    },
    JMhoH: _0x10e9('1aa', 'I3Y2'),
  }
  let _0x5ccb9f = {
    url: 'https://api.r2ray.com/jd.intershopsign/del?token=' + _0x2cf263,
    headers: { 'Content-Type': _0x5b1ca1['JMhoH'] },
  }
  return new Promise((_0x3a31e3) => {
    var _0x54a320 = {
      oOCsl: function (_0x44e231) {
        return _0x5b1ca1[_0x10e9('1ab', 'zrsV')](_0x44e231)
      },
    }
    $['get'](_0x5ccb9f, (_0x4cb2a1, _0xc0c5cd, _0x2e0d0a) => {
      _0x54a320['oOCsl'](_0x3a31e3)
    })
  })
}
function updateActInfo(_0x36dde2, _0x1b2d9e) {
  var _0x5e2850 = {
    MFSSQ: function (_0x5165fe) {
      return _0x5165fe()
    },
    TYJyr: _0x10e9('1ac', 'lo[U'),
    ChFCJ: _0x10e9('1ad', '9EX4'),
    ixjlK: _0x10e9('1ae', 'cwvT'),
    gRUoE: 'nEIfR',
    LIJWj: _0x10e9('1af', 'N%vF'),
    SgHQT: _0x10e9('1b0', 'tI^S'),
  }
  let _0x24b5b0 = {
    url: _0x5e2850[_0x10e9('1b1', 'WTz5')],
    headers: { 'Content-Type': _0x5e2850['SgHQT'] },
    body: JSON[_0x10e9('1b2', 'I3Y2')]({
      token: _0x36dde2,
      endTime: _0x1b2d9e,
    }),
  }
  return new Promise((_0x1cccdd) => {
    var _0x466cb6 = {
      OlUSz: function (_0x4207d9) {
        return _0x5e2850['MFSSQ'](_0x4207d9)
      },
      xXbpm: function (_0x65e743, _0x364895) {
        return _0x65e743 !== _0x364895
      },
      RyqsG: _0x5e2850[_0x10e9('1b3', 'cj(J')],
      OxisH: _0x5e2850[_0x10e9('1b4', 'PkMj')],
      AOSCv: _0x5e2850[_0x10e9('1b5', 's6PX')],
      TPLGz: _0x5e2850['gRUoE'],
      ihkJT: function (_0x47d30c) {
        return _0x5e2850['MFSSQ'](_0x47d30c)
      },
    }
    if (_0x10e9('1b6', 'x2Q3') !== _0x10e9('1b7', 'hAv@')) {
      $[_0x10e9('1b8', 'NDW*')](
        _0x24b5b0,
        (_0x55d15b, _0xb9c0c4, _0x4f9c35) => {
          try {
            if (_0x55d15b) {
              if (
                _0x466cb6[_0x10e9('1b9', 'nH90')](
                  _0x466cb6[_0x10e9('1ba', 'Jr*$')],
                  _0x466cb6[_0x10e9('1bb', 'E!2M')]
                )
              ) {
                console['log']('' + JSON[_0x10e9('1bc', 'cwvT')](_0x55d15b))
              } else {
                $[_0x10e9('1bd', 'Jr*$')] = JSON['parse'](_0x4f9c35)
                _0x466cb6['OlUSz'](_0x1cccdd)
              }
            } else {
              if (_0x10e9('1be', 'EP(0') !== _0x466cb6['AOSCv']) {
                $[_0x10e9('1bf', 'PkMj')](_0x10e9('1c0', 'mXjz') + _0x55d15b)
              } else {
                _0x4f9c35 = JSON[_0x10e9('1c1', 'D!xA')](_0x4f9c35)
                if (_0x4f9c35 && _0x4f9c35[_0x10e9('1c2', '%f!Q')] === 0xc8) {
                  if (
                    _0x466cb6[_0x10e9('1c3', 'zrsV')] !== _0x466cb6['TPLGz']
                  ) {
                    $[_0x10e9('1c4', 'cwvT')] = []
                  } else {
                    $[_0x10e9('1c5', 'D!xA')](_0x4f9c35[_0x10e9('1c6', 'Ep4D')])
                  }
                }
              }
            }
          } catch (_0x7082ea) {
            $[_0x10e9('1c7', 'EP(0')](_0x7082ea)
          } finally {
            _0x466cb6['ihkJT'](_0x1cccdd)
          }
        }
      )
    } else {
      $['log'](data[_0x10e9('af', 'VwSl')])
    }
  })
}
function taskUrl(_0x42fed3, _0x3fc092) {
  var _0x1f4c8d = {
    aykwy: function (_0xc0e2ab, _0x2c462c) {
      return _0xc0e2ab(_0x2c462c)
    },
    HKAjA: 'api.m.jd.com',
    csYIe: _0x10e9('1c8', 'x2Q3'),
    Hcaqw: _0x10e9('1c9', 'PvYR'),
    QmFMa: 'zh-cn',
  }
  return {
    url:
      _0x10e9('1ca', 'zrsV') +
      new Date()['getTime']() +
      _0x10e9('1cb', 'VwSl') +
      _0x42fed3 +
      '&body=' +
      _0x1f4c8d['aykwy'](
        encodeURIComponent,
        JSON[_0x10e9('1cc', 'VwSl')](_0x3fc092)
      ),
    headers: {
      Host: _0x1f4c8d[_0x10e9('1cd', 'tI^S')],
      Accept: _0x1f4c8d[_0x10e9('1ce', 'PvYR')],
      Connection: _0x1f4c8d['Hcaqw'],
      Cookie: cookie,
      'User-Agent':
        'jdapp;iPhone;9.4.6;13.7;' +
        $[_0x10e9('1cf', 'mXjz')] +
        _0x10e9('1d0', '9b!a') +
        $[_0x10e9('1d1', 'x2Q3')] +
        _0x10e9('1d2', '9b!a'),
      'Accept-Language': _0x1f4c8d['QmFMa'],
      Referer:
        _0x10e9('1d3', 'Ep4D') +
        $[_0x10e9('1d4', 's6PX')] +
        _0x10e9('1d5', '&Xs7') +
        $[_0x10e9('1d6', 'cwvT')] +
        '&un_area=',
      'Accept-Encoding': _0x10e9('1d7', 'nGeE'),
    },
  }
}
function getUUID(_0x58ac23 = _0x10e9('1d8', '9b!a'), _0x2de6eb = 0x0) {
  var _0x55412c = {
    TxZag: _0x10e9('1d9', 'w!C6'),
    bNEXn: function (_0x555478, _0x580231) {
      return _0x555478 * _0x580231
    },
    SNKoR: function (_0x53dd83, _0x44e9ca) {
      return _0x53dd83 == _0x44e9ca
    },
    AhEuh: function (_0xc5cbb4, _0x4dde47) {
      return _0xc5cbb4 | _0x4dde47
    },
    UAmgX: function (_0x153cb2, _0x94c755) {
      return _0x153cb2 & _0x94c755
    },
    IFDpV: function (_0x2b09cd, _0x4958ec) {
      return _0x2b09cd === _0x4958ec
    },
  }
  return _0x58ac23['replace'](/[xy]/g, function (_0x495b04) {
    var _0x4b95aa = { ynzlz: _0x55412c[_0x10e9('1da', 'v)*g')] }
    var _0x535a5b =
        _0x55412c[_0x10e9('1db', '1$GV')](
          Math[_0x10e9('1dc', 'e!B*')](),
          0x10
        ) | 0x0,
      _0x5941e1 = _0x55412c['SNKoR'](_0x495b04, 'x')
        ? _0x535a5b
        : _0x55412c[_0x10e9('1dd', 'xgs4')](
            _0x55412c[_0x10e9('1de', 'Ep4D')](_0x535a5b, 0x3),
            0x8
          )
    if (_0x2de6eb) {
      uuid = _0x5941e1[_0x10e9('1df', 'v144')](0x24)[_0x10e9('1e0', 'EP(0')]()
    } else {
      if (
        _0x55412c[_0x10e9('1e1', 'R&#6')](
          _0x10e9('1e2', 'HDIM'),
          _0x10e9('1e3', '9EX4')
        )
      ) {
        $['msg'](
          $[_0x10e9('4c', '1$GV')],
          _0x4b95aa[_0x10e9('1e4', '9b!a')],
          message
        )
      } else {
        uuid = _0x5941e1[_0x10e9('1e5', 'xgs4')](0x24)
      }
    }
    return uuid
  })
}
function random(_0x130da5, _0x2ca6e5) {
  var _0x285a6e = {
    IyIta: function (_0x2720ab, _0x4a03b0) {
      return _0x2720ab * _0x4a03b0
    },
    erXOM: function (_0x420165, _0x3f34c1) {
      return _0x420165 - _0x3f34c1
    },
  }
  return (
    Math[_0x10e9('1e6', 'f2Xj')](
      _0x285a6e[_0x10e9('1e7', 'w!C6')](
        Math[_0x10e9('1dc', 'e!B*')](),
        _0x285a6e[_0x10e9('1e8', '1$GV')](_0x2ca6e5, _0x130da5)
      )
    ) + _0x130da5
  )
}
function getACT_ID() {
  var _0x501f0b = {
    cGNsM: function (_0x437b32) {
      return _0x437b32()
    },
    OwGoj: function (_0x491c55, _0x20bce8) {
      return _0x491c55 === _0x20bce8
    },
    VwinJ: _0x10e9('1e9', 'VwSl'),
    xBEGF: function (_0x57e9e8, _0x1a302e) {
      return _0x57e9e8 === _0x1a302e
    },
    oReeu: _0x10e9('1ea', '0)l('),
    DTcaO: _0x10e9('1eb', 'WTz5'),
    cylrm: function (_0x57a014, _0x21fe76) {
      return _0x57a014 !== _0x21fe76
    },
    Heotr: 'NUTwe',
    CzNlE: function (_0x5ce80d, _0x5a0711) {
      return _0x5ce80d(_0x5a0711)
    },
    rsILm: function (_0x38c2c5, _0x432842) {
      return _0x38c2c5 === _0x432842
    },
    lqsAo: _0x10e9('1ec', 'zrsV'),
  }
  return new Promise(async (_0x15d429) => {
    if (
      _0x501f0b[_0x10e9('1ed', 'R^[7')](
        _0x10e9('1ee', 'v144'),
        _0x501f0b['lqsAo']
      )
    ) {
      var _0x4ed186 = {
        zyqGa: function (_0x2f7c80) {
          return _0x2f7c80()
        },
      }
      $[_0x10e9('1ef', 'PvYR')](opt, (_0x1d0974, _0x155c1b, _0x455a29) => {
        if (_0x455a29) {
          $[_0x10e9('1f0', 'O!hk')] = JSON[_0x10e9('bb', 'nX$u')](_0x455a29)
          _0x4ed186['zyqGa'](_0x15d429)
        }
      })
    } else {
      _0x15d429()
      // $[_0x10e9('1f1', 'v144')](
      //   { url: _0x10e9('1f2', 'zrsV') + Date[_0x10e9('1f3', 'zrsV')]() },
      //   (_0x28a296, _0x577d3e, _0x1fb5d8) => {
      //     var _0x250a96 = {
      //       gnLQx: function (_0x55eb05) {
      //         return _0x501f0b['cGNsM'](_0x55eb05)
      //       },
      //     }
      //     try {
      //       if (_0x28a296) {
      //         if (
      //           _0x501f0b[_0x10e9('1f4', 'cj(J')](
      //             _0x501f0b[_0x10e9('1f5', '9b!a')],
      //             'dMFuV'
      //           )
      //         ) {
      //           $[_0x10e9('1f6', '0)l(')] = JSON['parse'](_0x1fb5d8)
      //           _0x15d429()
      //         } else {
      //           console[_0x10e9('1f7', '1$GV')]('' + _0x28a296)
      //         }
      //       } else {
      //         if (
      //           _0x501f0b[_0x10e9('1f8', 'NDW*')](
      //             _0x501f0b['oReeu'],
      //             _0x501f0b['DTcaO']
      //           )
      //         ) {
      //           _0x250a96[_0x10e9('1f9', 'v144')](_0x15d429)
      //         } else {
      //           if (_0x1fb5d8) {
      //             if (
      //               _0x501f0b[_0x10e9('1fa', '9b!a')](
      //                 _0x10e9('1fb', 'zrsV'),
      //                 _0x10e9('1fc', 'mXjz')
      //               )
      //             ) {
      //               _0x1fb5d8 = JSON[_0x10e9('1fd', 'HDIM')](_0x1fb5d8)
      //               if (_0x1fb5d8[_0x10e9('1fe', 'cwvT')]['length'] > 0x0) {
      //                 $['ACT_IDarr'] = _0x1fb5d8['data']
      //                 console['log'](_0x10e9('1ff', 'O!hk'))
      //               } else {
      //                 $[_0x10e9('200', '&Xs7')] = []
      //               }
      //             } else {
      //               $[_0x10e9('201', '1MOl')] = ![]
      //               return
      //             }
      //           }
      //         }
      //       }
      //     } catch (_0xd661d3) {
      //       $[_0x10e9('202', '8@Qm')](_0xd661d3, _0x577d3e)
      //     } finally {
      //       if (_0x501f0b['Heotr'] !== _0x501f0b['Heotr']) {
      //         _0x15d429()
      //       } else {
      //         _0x501f0b[_0x10e9('203', '8@Qm')](_0x15d429, _0x1fb5d8)
      //       }
      //     }
      //   }
      // )
    }
  })
}
function checkCookie() {
  var _0x14040b = {
    mLHqD: function (_0x17a7af, _0x56184d) {
      return _0x17a7af | _0x56184d
    },
    eAyJs: function (_0x2b63ee, _0xc62a23) {
      return _0x2b63ee == _0xc62a23
    },
    mvDWf: _0x10e9('204', 'cj(J'),
    HXtdy: _0x10e9('205', 'HDIM'),
    oBfOi: _0x10e9('206', '$2^q'),
    GOEJe: _0x10e9('207', '8@Qm'),
    aQeMT: _0x10e9('208', '&Xs7'),
    uLBcy: function (_0x4fa4d1, _0x2d5e3a) {
      return _0x4fa4d1 * _0x2d5e3a
    },
    dYebc: function (_0x3a67f7, _0x22ae7f) {
      return _0x3a67f7 - _0x22ae7f
    },
    nRFGQ: function (_0x42d9df, _0x41936e) {
      return _0x42d9df !== _0x41936e
    },
    WrALk: _0x10e9('209', '1MOl'),
    ouDxj: _0x10e9('20a', 'Ep4D'),
    KIvHp: function (_0xf57f49, _0x1c04ef) {
      return _0xf57f49 === _0x1c04ef
    },
    lCimu: _0x10e9('20b', 'VwSl'),
    SgSJc: _0x10e9('20c', 'f2Xj'),
    vLnfT: _0x10e9('20d', '1$GV'),
    aEWiT: 'ixHll',
    qZIhA: 'gLPcq',
    gPHmk: _0x10e9('20e', 'nX$u'),
    sJwOT: function (_0x38d0c4, _0x12b97b) {
      return _0x38d0c4 === _0x12b97b
    },
    aZsRB: 'lMCTu',
    RJdhC: function (_0xf69496, _0x1f02e6) {
      return _0xf69496 !== _0x1f02e6
    },
    mFUhT: function (_0x3e0f88) {
      return _0x3e0f88()
    },
    mdACl: 'https://me-api.jd.com/user_new/info/GetJDUserInfoUnion',
    uNqnz: 'me-api.jd.com',
    VlfyI: _0x10e9('20f', 'Jr*$'),
  }
  const _0x57aec3 = {
    url: _0x14040b[_0x10e9('210', 'f2Xj')],
    headers: {
      Host: _0x14040b['uNqnz'],
      Accept: '*/*',
      Connection: _0x14040b[_0x10e9('211', '1MOl')],
      Cookie: cookie,
      'User-Agent': _0x14040b['VlfyI'],
      'Accept-Language': _0x10e9('212', 'I3Y2'),
      Referer: _0x10e9('213', 'xgs4'),
      'Accept-Encoding': _0x14040b[_0x10e9('214', 'd$hz')],
    },
  }
  return new Promise((_0x4c6839) => {
    var _0x2ff831 = {
      sDONo: function (_0x3d1edb) {
        return _0x14040b[_0x10e9('215', '&Xs7')](_0x3d1edb)
      },
    }
    $[_0x10e9('1a9', '1MOl')](_0x57aec3, (_0x198b74, _0x46db5b, _0x5f51f4) => {
      var _0x43230a = {
        gLshp: function (_0x1cbab2, _0x13b62f) {
          return _0x14040b['mLHqD'](_0x1cbab2, _0x13b62f)
        },
        xDSEy: function (_0x181cef, _0x4f6e06) {
          return _0x14040b[_0x10e9('216', 'e!B*')](_0x181cef, _0x4f6e06)
        },
        XxLGP: _0x14040b[_0x10e9('217', 'WdS1')],
        Deyup: _0x14040b[_0x10e9('218', '%f!Q')],
        iRUtR: _0x14040b[_0x10e9('219', 'D!xA')],
        TECCs: _0x14040b[_0x10e9('21a', 'rKUJ')],
        PCKMs: _0x14040b[_0x10e9('21b', 'Jr*$')],
        YQePK: function (_0x52f2b9, _0x147646) {
          return _0x14040b[_0x10e9('21c', 'f2Xj')](_0x52f2b9, _0x147646)
        },
        oCxtl: function (_0xb3ffbf, _0x44dea7) {
          return _0x14040b[_0x10e9('21d', '8@Qm')](_0xb3ffbf, _0x44dea7)
        },
      }
      if (
        _0x14040b['nRFGQ'](
          _0x14040b[_0x10e9('21e', '1MOl')],
          _0x14040b[_0x10e9('21f', 'e!B*')]
        )
      ) {
        $[_0x10e9('220', 'tI^S')](_0x10e9('221', 'cj(J') + e)
      } else {
        try {
          if (_0x198b74) {
            $[_0x10e9('222', 'lo[U')](_0x198b74)
          } else {
            if (
              _0x14040b[_0x10e9('223', 'R&#6')] ===
              _0x14040b[_0x10e9('224', '%f!Q')]
            ) {
              if (_0x5f51f4) {
                if (
                  _0x14040b[_0x10e9('225', 'lo[U')](
                    _0x10e9('226', 'zrsV'),
                    _0x14040b[_0x10e9('227', 'Ep4D')]
                  )
                ) {
                  cookiesArr[_0x10e9('228', 'WdS1')](jdCookieNode[item])
                } else {
                  _0x5f51f4 = JSON[_0x10e9('229', '0)l(')](_0x5f51f4)
                  if (
                    _0x14040b[_0x10e9('22a', '1$GV')](
                      _0x5f51f4['retcode'],
                      _0x14040b[_0x10e9('22b', 'cj(J')]
                    )
                  ) {
                    $[_0x10e9('22c', '&Xs7')] = ![]
                    return
                  }
                  if (
                    _0x14040b[_0x10e9('22d', 'vvmK')](
                      _0x5f51f4[_0x10e9('22e', 'PkMj')],
                      '0'
                    ) &&
                    _0x5f51f4['data']['hasOwnProperty'](_0x10e9('22f', 'mXjz'))
                  ) {
                    if (
                      _0x14040b[_0x10e9('230', 'w!C6')](
                        _0x14040b[_0x10e9('231', '%f!Q')],
                        _0x14040b['aEWiT']
                      )
                    ) {
                      $[_0x10e9('232', 'D!xA')] =
                        _0x5f51f4[_0x10e9('233', 'R^[7')]['userInfo'][
                          _0x10e9('234', 'nX$u')
                        ][_0x10e9('235', '$2^q')]
                    } else {
                      return format[_0x10e9('236', 'vvmK')](
                        /[xy]/g,
                        function (_0xe38014) {
                          var _0x16db13 = _0x43230a[_0x10e9('237', 'Jr*$')](
                              Math[_0x10e9('238', 'I3Y2')]() * 0x10,
                              0x0
                            ),
                            _0x51db53 = _0x43230a['xDSEy'](_0xe38014, 'x')
                              ? _0x16db13
                              : _0x43230a['gLshp'](_0x16db13 & 0x3, 0x8)
                          if (UpperCase) {
                            uuid =
                              _0x51db53[_0x10e9('239', 'hAv@')](0x24)[
                                _0x10e9('23a', '$2^q')
                              ]()
                          } else {
                            uuid = _0x51db53[_0x10e9('23b', '2KtF')](0x24)
                          }
                          return uuid
                        }
                      )
                    }
                  }
                }
              } else {
                if (
                  _0x10e9('23c', 'v144') === _0x14040b[_0x10e9('23d', 'cwvT')]
                ) {
                  return {
                    url:
                      _0x10e9('23e', 'vvmK') +
                      new Date()[_0x10e9('23f', 'x2Q3')]() +
                      '&loginType=2&functionId=' +
                      function_id +
                      _0x10e9('240', 'cwvT') +
                      encodeURIComponent(JSON[_0x10e9('241', '1$GV')](body)),
                    headers: {
                      Host: _0x43230a[_0x10e9('242', '1$GV')],
                      Accept: _0x43230a['Deyup'],
                      Connection: _0x43230a[_0x10e9('243', 'WdS1')],
                      Cookie: cookie,
                      'User-Agent':
                        'jdapp;iPhone;9.4.6;13.7;' +
                        $[_0x10e9('244', '$2^q')] +
                        _0x10e9('245', 'tI^S') +
                        $[_0x10e9('246', 'zrsV')] +
                        _0x10e9('247', 'HDIM'),
                      'Accept-Language': _0x43230a['TECCs'],
                      Referer:
                        _0x10e9('248', 'v144') +
                        $['actID'] +
                        '&lng=0.000000&lat=0.000000&sid=' +
                        $['SID'] +
                        _0x10e9('249', 'vvmK'),
                      'Accept-Encoding': _0x43230a[_0x10e9('24a', 'e!B*')],
                    },
                  }
                } else {
                  $[_0x10e9('24b', 'zrsV')](_0x14040b['gPHmk'])
                }
              }
            } else {
              if (_0x5f51f4) {
                $[_0x10e9('24c', '2KtF')] =
                  JSON[_0x10e9('24d', '&Xs7')](_0x5f51f4)
              }
            }
          }
        } catch (_0x4bf664) {
          if (
            _0x14040b[_0x10e9('24e', 'JFZQ')](
              _0x10e9('24f', '9b!a'),
              _0x14040b[_0x10e9('250', 'rKUJ')]
            )
          ) {
            return (
              Math[_0x10e9('251', '9b!a')](
                _0x43230a['YQePK'](
                  Math[_0x10e9('252', 'nGeE')](),
                  _0x43230a['oCxtl'](max, min)
                )
              ) + min
            )
          } else {
            $[_0x10e9('e7', 'nH90')](_0x4bf664)
          }
        } finally {
          if (
            _0x14040b['RJdhC'](_0x10e9('253', 'xgs4'), _0x10e9('254', 'NDW*'))
          ) {
            _0x2ff831['sDONo'](_0x4c6839)
          } else {
            _0x4c6839()
          }
        }
      }
    })
  })
}
_0xod5 = 'jsjiami.com.v6'
