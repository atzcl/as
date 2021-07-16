import path from 'path'
import fs from 'fs'

const { Env } = require('./Env')

;(global as any).Env = Env

const args = process.argv.slice(2)

const scriptPath = path.join(__dirname, '..', args[0])

require(path.join(__dirname, '..', 'jdCookie'))

if (fs.existsSync(scriptPath)) {
  import(scriptPath)
}
