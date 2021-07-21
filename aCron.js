const fs = require('fs')
const path = require('path')
const cron = require('node-cron')
const childProcess = require('child_process')

const { Env } = require('./utils/Env')

global.Env = Env

const PromiseWrapper =
  (cmdType) =>
  (...args) =>
    new Promise((resolve, reject) => {
      const result = childProcess[cmdType](...args)

      const stdoutChunks = []
      const stderrChunks = []

      const capture = (chunks) => (data) => {
        chunks.push(data)

        console.info(data.toString().trim())
      }

      result.stdout.on('data', capture(stdoutChunks))
      result.stderr.on('data', capture(stderrChunks))

      result.on('close', () => {
        stdoutChunks.length ? resolve(stdoutChunks) : reject(stderrChunks)
      })
    })

const spawn = PromiseWrapper('spawn')
const exec = PromiseWrapper('exec')

const userEnvPath = path.join(__dirname, 'aEnv.js')
if (fs.existsSync(userEnvPath)) {
  require(userEnvPath)
}

const isTs = /\.ts$/.test(process.env.RUN_FILE)
const getTsFileName = () => {
  const [, name] = process.env.RUN_FILE.match(/.*\/(.*)\.ts$/)

  return name
}

const run = async () => {
  try {
    if (isTs) {
      const name = getTsFileName()
      await exec(`yarn ts ${name}.ts`)
    } else {
      require(process.env.RUN_FILE)
      setTimeout(
        () => delete require.cache[require.resolve(process.env.RUN_FILE)]
      )
    }
  } catch {
    console.error(`执行 ${process.env.RUN_FILE} 异常`)
  }
}

try {
  if (process.env.CRON_TIME === 'always') {
    run()
  } else {
    cron.schedule(process.env.CRON_TIME, async function () {
      await run()
    })
  }
} catch {
  console.error(`执行 ${process.env.RUN_FILE} 异常`)
}
