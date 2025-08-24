// components/DawnHeroCard.js
import Link from 'next/link'
import Image from 'next/image'

export default function DawnHeroCard({ hero }) {
  // Path gambar dari folder public/icon/
  const imagePath = hero['image-hero']
    ? `/icon/${hero['image-hero']}`
    : '/icon/default-hero.png'

  return (
    <Link href={`/dashboard/dawn/${hero.id}`}>
     <div className="border shadow bg-special-inside border-zinc-800 rounded-xl p-4 hover:bg-gray-800 transition cursor-pointer h-full flex flex-col items-center text-center">
  {/* Gambar Hero */}
  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden flex justify-center">
    <Image
      src={imagePath}
      alt={hero.name}
      width={180}
      height={300}
      className="object-contain"
      onError={(e) => {
        e.target.src = '/icon/default-hero.png'
        const target = e.target
        target.src = '/icon/default-hero.png'
      }}
    />
  </div>

  <div className="flex flex-col items-center">
    <h2 className="text-xl font-semibold">{hero.name}</h2>
    <p className="text-gray-400">{hero.role || 'Academy Dawn'}</p>
    <p className="text-gray-500 text-sm mt-2">ID: {hero.id}</p>
  </div>
</div>
    </Link>
  )
}
