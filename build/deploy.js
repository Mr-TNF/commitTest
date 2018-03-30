var client = require('scp2')
var config = require('../config')
var ora = require('ora')
var chalk = require('chalk')
var version = null
var command = null

// switch between pro and deploy
if (process.argv[2] === 'pro') {
  version = process.argv[3]
  command = 'pro'
} else {
  version = process.argv[2]
  command = 'deploy'
}

// check dist tag
if (!version) {
  console.log(chalk.red('  No dist version!'))
  console.log()
  console.log(chalk.red('  You can specify by running like:'))
  console.log(chalk.red(`  "npm run ${command} v1.0.0" or "yarn ${command} v1.0.0"`))
  console.log()
  process.exit(1)
}

var spinner = ora('uploading static files...')
spinner.start()
config.deploy.path += `/dist-${version}`
client.scp(config.build.assetsRoot, config.deploy, function(err) {
  spinner.stop()
  if (err) {
    console.log(chalk.red(' Upload failed with errors.\n'))
    console.log(err)
  }
})
