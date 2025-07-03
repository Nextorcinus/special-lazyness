// scripts/generate-grouped.js
const fs = require('fs')
const path = require('path')
const stateList = require('../data/state_list.json')

function group(ids) {
  const result = {}
  ids.forEach((id) => {
    const start = Math.floor(id / 100) * 100
    const end = start + 99
    const key = `[${start} … ${end}]`
    if (!result[key]) result[key] = []
    result[key].push(id)
  })
  return result
}

const grouped = group(stateList)
fs.writeFileSync(
  path.join(__dirname, '../data/grouped_state_list.json'),
  JSON.stringify(grouped, null, 2)
)
