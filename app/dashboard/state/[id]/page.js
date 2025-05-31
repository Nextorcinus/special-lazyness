import milestoneData from '@/data/milestones.json'

export default async function StatePage({ params }) {
  const { id } = params

  const res = await fetch(
    `https://wosland.com/free-tools/stateage/api.php?state_id=${id}`
  )
  const data = await res.json()

  if (!data?.timestamp) {
    return <p className="text-red-500 p-6">State not found.</p>
  }

  const createdAt = new Date(data.timestamp * 1000)
  const now = new Date()
  const ageInDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24))

  const milestones = milestoneData.milestones

  const achieved = milestones
    .filter((m) => m.days <= ageInDays)
    .map((m) => ({ ...m, daysAgo: ageInDays - m.days }))

  const upcoming = milestones
    .filter((m) => m.days > ageInDays)
    .map((m) => ({ ...m, daysLeft: m.days - ageInDays }))

  return (
    <div className="p-4 md:p-6 text-white w-full">
      {/* title state */}
      <div className="relative bg-special-inside border border-zinc-800 rounded-2xl p-6 shadow-md space-y-2 mb-6">
        <h1 className="text-2xl font-bold mb-2">State {id}</h1>
        <p className="text-sm text-zinc-400">
          Created At: {createdAt.toUTCString()}
        </p>
        <p className="text-lime-400 mb-6">Age: {ageInDays} days</p>
      </div>

      {/* Upcoming */}
      <h2 className="text-xl mb-4 px-2 text-zinc-400">Upcoming Updates</h2>
      <div className="space-y-6">
        {upcoming.map((m) => (
          <div
            key={m.name}
            className={`rounded-xl border shadow bg-special-inside border-zinc-800 text-white mt-6 p-5 transition-all duration-300 ${
              m.daysLeft > 60
                ? 'saturate-[0.3] opacity-80 hover:saturate-100'
                : ''
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-2">
              <h3 className="text-lg font-semibold text-lime-400">
                Day {m.days} – {m.name}{' '}
                {m.daysLeft <= 3 && (
                  <span className="ml-2 bg-red-600 text-white px-2 py-0.5 rounded text-xs">
                    🔥 New
                  </span>
                )}
              </h3>
              <span className="text-sm border-[2px] border-lime-500 bg-lime-400 px-2 py-1 rounded-lg text-black sm:text-right inline-block w-fit">
                {m.daysLeft} days left
              </span>
            </div>

            <p className="text-sm text-zinc-400 mb-3">{m.details?.[0]}</p>

            {m.heroes && (
              <div className="grid grid-cols-3 gap-4 md:gap-50 mt-4">
                {m.heroes.names.map((hero, i) => (
                  <div key={hero} className="text-center">
                    <img
                      src={m.heroes.images[i].replace('./images/', '/icon/')}
                      alt={hero}
                      className="w-14 h-14 sm:w-[130px] sm:h-[130px] mx-auto rounded-md object-contain shadow-sm"
                    />
                    <div className="mt-2 font-medium text-zinc-200">{hero}</div>

                    {m.heroes.acquisition?.[i] && (
                      <div className="flex justify-center gap-1 mt-3">
                        {m.heroes.acquisition[i].map((source, idx) => (
                          <img
                            key={idx}
                            src={`/icon/${source}.png`}
                            alt={source}
                            title={source}
                            className="w-6 h-6"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {m.icons && (
              <div className="flex flex-wrap gap-4 mt-4">
                {m.icons.names.map((icon, i) => (
                  <div key={icon} className="text-center">
                    <img
                      src={m.icons.images[i].replace('./images/', '/icon/')}
                      alt={icon}
                      className="w-14 h-14 sm:w-[150px] sm:h-[150px] mx-auto rounded-md object-contain shadow-sm"
                    />
                    <div className="mt-1 text-zinc-300">{icon}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Previous */}
      {achieved.filter((m) => m.daysAgo >= 30).length > 0 && (
        <>
          <h2 className="text-xl mt-12 mb-4 px-2 text-zinc-400">
            Previous Updates
          </h2>

          <div className="space-y-6">
            {achieved
              .filter((m) => m.daysAgo >= 30)
              .reverse()
              .map((m) => (
                <div
                  key={m.name}
                  className="rounded-xl border shadow bg-special-inside border-zinc-800 text-white mt-6 p-5 opacity-80 saturate-[0.7]"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-2">
                    <h3 className="text-lg font-semibold text-zinc-300">
                      Day {m.days} – {m.name}
                    </h3>
                    <span className="text-sm text-zinc-500 sm:text-right">
                      {m.daysAgo} days ago
                    </span>
                  </div>

                  <p className="text-sm text-zinc-400 mb-3">{m.details?.[0]}</p>

                  {m.heroes && (
                    <div className="grid grid-cols-3 gap-4 md:gap-50 mt-4">
                      {m.heroes.names.map((hero, i) => (
                        <div key={hero} className="text-center">
                          <img
                            src={m.heroes.images[i].replace(
                              './images/',
                              '/icon/'
                            )}
                            alt={hero}
                            className="w-14 h-14 sm:w-[130px] sm:h-[130px] mx-auto rounded-md object-contain shadow-sm"
                          />
                          <div className="mt-2 font-medium text-zinc-200">
                            {hero}
                          </div>

                          {m.heroes.acquisition?.[i] && (
                            <div className="flex justify-center gap-1 mt-3">
                              {m.heroes.acquisition[i].map((source, idx) => (
                                <img
                                  key={idx}
                                  src={`/icon/${source}.png`}
                                  alt={source}
                                  title={source}
                                  className="w-6 h-6"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {m.icons && (
                    <div className="flex flex-wrap gap-4 mt-4">
                      {m.icons.names.map((icon, i) => (
                        <div key={icon} className="text-center">
                          <img
                            src={m.icons.images[i].replace(
                              './images/',
                              '/icon/'
                            )}
                            alt={icon}
                            className="w-14 h-14 sm:w-[150px] sm:h-[150px] mx-auto rounded-md object-contain shadow-sm"
                          />
                          <div className="mt-1 text-zinc-300">{icon}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  )
}
