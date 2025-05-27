'use client'

export default function Home() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || 'dev'

  return (
 
    <main className="flex items-center justify-center min-h-screen text-white p-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl text-lime-500">Special Lazyness</h1>
        <p className="text-zinc-400 mt-4">
          I'm not here to make you win. I'm just here to stop you from wasting
          resources and time. Calculating upgrade costs? Calculating research
          needs? <i>Yeah... no thanks</i>. That's why I created this calculator,
          because I'd rather click than think. Use it, prepare better, and maybe
          / just maybe / lose with dignity. - special_one👻
        </p>
      </div>
    </main>
    
  )
}
