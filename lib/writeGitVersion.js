const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

try {
  const commitHash = execSync('git rev-parse --short HEAD').toString().trim()
  const outputPath = path.join(process.cwd(), 'public/git-version.json')
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify({ version: commitHash }, null, 2))
  console.log('✅ Git version saved to public/git-version.json:', commitHash)
} catch (error) {
  console.error('❌ Failed to write Git version:', error)
}
