const { join } = require('path')
const { existsSync } = require('fs')

const tasks = require('./jd_task.json')

const apps = []

for (let i = 0; i < tasks.list.length; i += 1) {
  const item = tasks.list[i]

  if (item.time === '0') {
    continue
  }

  const arr = item.job.target.split('/')
  const RUN_FILE = join(__dirname, arr[arr.length - 1])

  if (!existsSync(RUN_FILE)) {
    continue;
  }

  apps.push({
    name: item.name,
    script: join(__dirname, 'aCron.js'),
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
      RUN_FILE,
      CRON_TIME: item.time,
    },
  })
}

module.exports = {
  apps,
}
