'use client'

import Image from 'next/image'

const iconMap = {
  Meat: 'meat.png',
  Wood: 'wood.png',
  Coal: 'coal.png',
  Iron: 'iron.png',
  Crystal: 'crystal.png',
  RFC: 'rfc.png',
  Steel: 'steel.png',
  'FC Shards': 'fc-shards.png',
}

export default function ResourceIcon({ type, size = 20 }) {
  const fileName = iconMap[type]
  const src = fileName ? `/icon/${fileName}` : '/icon/default.png'

  return (
    <Image
      src={src}
      alt={type}
      width={size}
      height={size}
      className="inline-block mr-1 align-middle"
    />
  )
}
