import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export function GET(request, { params }) {
  const filePath = path.join(
    process.cwd(),
    'app/data/heroes',
    `${params.id}.json`
  )
  const json = fs.readFileSync(filePath, 'utf8')
  return NextResponse.json(JSON.parse(json))
}
