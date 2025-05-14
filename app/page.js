'use client'

export default function Home() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || 'dev'

  return (
    <main className="p-6 text-white">
      <h1 className="text-2xl font-bold">Special Lazyness</h1>
      <p>Welcome to the upgrade calculator!</p>
    </main>
  )
}
