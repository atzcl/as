const cron = require('node-cron')
const { Env } = require('./utils/Env')

global.Env = Env

try {
  cron.schedule(process.env.CRON_TIME, async function () {
    try {
      require(process.env.RUN_FILE)
      setTimeout(
        () => delete require.cache[require.resolve(process.env.RUN_FILE)]
      )

      // await exec(`node ${process.env.RUN_FILE}`)
    } catch {
      console.error(`执行 ${process.env.RUN_FILE} 异常`)
    }
  })
} catch {
  console.error(`执行 ${process.env.RUN_FILE} 异常`)
}
