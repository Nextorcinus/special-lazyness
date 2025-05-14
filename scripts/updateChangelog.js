const fs = require('fs')
const { execSync } = require('child_process')

const hash = execSync('git rev-parse --short HEAD').toString().trim()
const date = new Date().toISOString().split('T')[0]
const message = execSync('git log -1 --pretty=%B').toString().trim()

const changelogPath = './data/changelog.json'
const changelog = JSON.parse(fs.readFileSync(changelogPath))

// Hindari duplikat
if (!changelog.find((e) => e.version === hash)) {
  changelog.unshift({
    version: hash,
    date,
    title: message.split('\n')[0], // optional: gunakan first line sebagai judul
    changes: message.split('\n'), // gunakan semua pesan git sebagai array
  })

  fs.writeFileSync(changelogPath, JSON.stringify(changelog, null, 2))
  console.log(`✅ Changelog updated with ${hash}`)
} else {
  console.log('⏭️  Version already exists in changelog')
}
