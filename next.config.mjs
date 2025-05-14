import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import fs from 'fs'

/** Jalankan penulisan file versi Git saat build server */
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const gitVersionPath = path.join(__dirname, '.next/static/git-version.json')

try {
  const commitHash = execSync('git rev-parse --short HEAD').toString().trim()
  fs.mkdirSync(path.dirname(gitVersionPath), { recursive: true })
  fs.writeFileSync(gitVersionPath, JSON.stringify({ version: commitHash }))
  console.log('✅ Git version saved:', commitHash)
} catch (err) {
  console.warn('❌ Failed to get git version', err)
}

const nextConfig = {
  // Tambahan konfigurasi kalau perlu
}

export default nextConfig
