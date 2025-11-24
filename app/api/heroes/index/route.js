import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export function GET() {
  const filePath = path.join(process.cwd(), 'app/data/heroes/index.json')
  const json = fs.readFileSync(filePath, 'utf8')
  return NextResponse.json(JSON.parse(json))
}
