const fs = require('fs')
const stateList = require('../app/data/state_list.json')

let output = {}
try {
  output = JSON.parse(fs.readFileSync('./data/state_age.json'))
} catch {}

;(async () => {
  const filtered = stateList.filter((id) => Number(id) >= 3098)

  for (const id of filtered) {
    try {
      const res = await fetch(
        `https://wosland.com/free-tools/stateage/api.php?state_id=${id}`
      )
      const json = await res.json()
      if (json.timestamp) {
        output[id] = json.timestamp
        console.log(`✅ State ${id}: ${json.timestamp}`)
      } else {
        console.warn(`⚠️  No timestamp for state ${id}`)
      }
    } catch (e) {
      console.error(`❌ Failed state ${id}:`, e.message)
    }

    await new Promise((r) => setTimeout(r, 100))
  }

  fs.writeFileSync('./data/state_age.json', JSON.stringify(output, null, 2))
  console.log('🎉 Done!')
})()
