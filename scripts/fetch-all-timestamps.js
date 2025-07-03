const fs = require('fs')
const stateList = require('../app/data/state_list.json')
const output = {}

;(async () => {
  for (const id of stateList) {
    try {
      const res = await fetch(
        `https://wosland.com/free-tools/stateage/api.php?state_id=${id}`
      )
      const json = await res.json()
      if (json.timestamp) {
        output[id] = json.timestamp
        console.log(`✅ State ${id}: ${json.timestamp}`)
      }
    } catch (e) {
      console.error(`❌ Failed state ${id}:`, e.message)
    }
    await new Promise((r) => setTimeout(r, 100))
  }

  fs.writeFileSync('./data/state_age.json', JSON.stringify(output, null, 2))
  console.log('🎉 Done! Saved to data/state_age.json')
})()
