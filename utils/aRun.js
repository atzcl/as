const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')

// const { Env } = require('./utils/Env')

// global.Env = Env

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

const run = async (runFile) => {
  const isTs = /\.ts$/.test(runFile)
  const getTsFileName = () => {
    const [, name] = runFile.match(/.*\/(.*)\.ts$/)

    return name
  }

  try {
    if (isTs) {
      const name = getTsFileName()
      await exec(`yarn ts ${name}.ts`)
    } else {
      require(runFile)
      setTimeout(() => delete require.cache[require.resolve(runFile)])
    }
  } catch {
    console.error(`执行 ${runFile} 异常`)
  }
}

module.exports = {
  run,
}
