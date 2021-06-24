const path = require('path')
const fs = require('fs')
const { Env } = require('./Env')

global.Env = Env

const args = process.argv.slice(2)

const scriptPath = path.join(__dirname, '..', args[0])

const userEnvPath = path.join(__dirname, '..', 'aEnv.js')
if (fs.existsSync(userEnvPath)) {
  require(userEnvPath)
}

require(scriptPath)
