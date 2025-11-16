import { NextResponse } from 'next/server'

export async function GET(request) {
  const fid = request.nextUrl.searchParams.get('fid') || '155426370'
  const sign = 'ebbb155ca00be7bf94958118f7b53071'
  const time = '1761802775669'

  const body = new URLSearchParams({ fid, sign, time })

  const res = await fetch(
    'https://wos-giftcode-api.centurygame.com/api/player',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Origin: 'https://wos-giftcode.centurygame.com',
        Referer: 'https://wos-giftcode.centurygame.com/',
      },
      body: body.toString(),
      cache: 'no-store',
    }
  )

  const data = await res.json()
  return NextResponse.json(data)
}
