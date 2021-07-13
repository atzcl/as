const path = require('path')
const fs = require('fs')
const { Env } = require('./Env')

global.Env = Env
global.urls = new Set([]);

const args = process.argv.slice(2)

const scriptPath = path.join(__dirname, '..', args[0])

const userEnvPath = path.join(__dirname, '..', 'aEnv.js')
if (fs.existsSync(userEnvPath)) {
  require(userEnvPath)
}

require(scriptPath)

// setTimeout(() => {
//   const newUrls = [];
//   for (const url of global.urls) {
//     newUrls.push(url);
//   }

//   fs.writeFileSync(path.join(__dirname, '..', 'url.txt'), newUrls.join('\n'), 'utf8')
// }, 1000 * 60 * 60)
