'use client'

export default function Home() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || 'dev'

 return (
  <main className="flex items-center justify-center min-h-screen text-white p-6">
    <div className="max-w-2xl text-center">
      <h1 className="text-4xl text-lime-500">Special Lazyness</h1>
      <p className="text-zinc-400 mt-4">
        Tired of doing in-game math? Same here. That’s exactly why I built this app.<br />
        
        <strong>Special Lazyness</strong> is made for fellow lazy gamers who still want to play smart without the headache of manual calculations. Here, you’ll find handy calculators for: Chief Gear, Research, Buildings Upgrade, War Academy.<br />
        <br />
        These tools weren’t built out of productivity—they exist because I’m too lazy to do the math every time I play. So if you're like me—lazy but still want to optimize your gameplay—you’ve come to the right place.
      </p>
    </div>
  </main>
)

}
