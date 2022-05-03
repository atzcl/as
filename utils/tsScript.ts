import path from 'path'
import fs from 'fs'

const { Env } = require('./Env')

;(global as any).Env = Env

const args = process.argv.slice(2)

const scriptPath = path.join(__dirname, '..', args[0])

require(path.join(__dirname, '..', 'jdCookie'))

const userEnvPath = path.join(__dirname, '..', 'aEnv.js')
if (fs.existsSync(userEnvPath)) {
  // @ts-ignore
  import(userEnvPath)
}

if (fs.existsSync(scriptPath)) {
  import(scriptPath)
}
