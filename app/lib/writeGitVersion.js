import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const commitHash = execSync('git rev-parse --short HEAD').toString().trim()
const versionData = { version: commitHash }

const outputPath = path.join(process.cwd(), 'public/git-version.json')
fs.writeFileSync(outputPath, JSON.stringify(versionData, null, 2))
console.log('✅ Git version saved to public/git-version.json:', commitHash)
