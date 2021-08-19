const { join } = require('path')
const { existsSync } = require('fs')

const tasks = require('./jd_task.json')
const { run } = require('./utils/aRun')
const { Env } = require('./utils/Env')

global.Env = Env

const apps = []

for (let i = 0; i < tasks.list.length; i += 1) {
  const item = tasks.list[i]

  // if (['京东试用', '星店长', '京东极速版', '柠檬京喜牧场', '京喜财富岛'].includes(item.name)) {
  //   continue;
  // }

  if (item.time === '0') {
    continue
  }

  const arr = item.job.target.split('/')
  const RUN_FILE = join(__dirname, arr[arr.length - 1])

  if (!existsSync(RUN_FILE)) {
    continue
  }

  apps.push(RUN_FILE)
}

Promise.all(apps.map((f) => run(f)))
