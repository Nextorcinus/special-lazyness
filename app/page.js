'use client'

export default function Home() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || 'dev'

  return (
 
    <main className="flex items-center justify-center min-h-screen text-white px-12 md:px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl text-teal-300">Special Lazyness</h1>
        <p className="text-white mt-4">
          I made this app because I am lazy. Seriously. I hate calculating things. Numbers stress me out. So I created this tool to make life easier, not smarter just easier.

          Enjoy it. Use it. Let it do the thinking while you do absolutely anything else.
          special_one 👻
        </p>
      </div>
    </main>
    
  )
}
