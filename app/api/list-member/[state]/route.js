import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

export async function GET(req, { params }) {
  const { state } = params

  try {
    const filePath = path.join(
      process.cwd(),
      'app',
      'data',
      'listMember',
      `${state}.json`
    )
    const jsonData = await fs.readFile(filePath, 'utf8')
    const parsed = JSON.parse(jsonData)

    return NextResponse.json({ success: true, data: parsed })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `State ${state} not found.` },
      { status: 404 }
    )
  }
}
