export default function MilestoneCard({ milestone: m, isUpcoming = false }) {
  const statusStyle =
    isUpcoming && m.daysLeft > 60
      ? 'saturate-[0.3] opacity-80 hover:saturate-100'
      : !isUpcoming
      ? 'opacity-80 saturate-[0.7]'
      : ''

  return (
    <div
      className={`rounded-xl border shadow bg-special-inside border-zinc-800 text-white mt-6 p-5 transition-all duration-300 ${statusStyle}`}
    >
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-2">
        <h3
          className={`text-lg font-semibold ${
            isUpcoming ? 'text-lime-400' : 'text-zinc-300'
          }`}
        >
          Day {m.days} – {m.name}
          {isUpcoming && m.daysLeft <= 3 && (
            <span className="ml-2 bg-red-600 text-white px-2 py-0.5 rounded text-xs">
              🔥 New
            </span>
          )}
        </h3>
        <span className="text-sm border-[2px] border-lime-500 bg-lime-400 px-2 py-1 rounded-lg text-black sm:text-right inline-block w-fit">
          {isUpcoming ? `${m.daysLeft} days left` : `${m.daysAgo} days ago`}
        </span>
      </div>

      {/* Detail */}
      {m.details?.length > 0 && (
        <p className="text-sm text-zinc-400 mb-3">{m.details[0]}</p>
      )}

      {/* icons */}
      {m.icons && (
        <div className="flex flex-wrap gap-4 mt-4">
          {m.icons.names.map((icon, i) => (
            <div key={icon + i} className="text-center">
              <img
                src={m.icons.icon[i]}
                alt={icon}
                className="w-14 h-14 sm:w-[150px] sm:h-[150px] mx-auto rounded-md object-contain shadow-sm"
              />
              <div className="mt-1 text-zinc-300">{icon}</div>
            </div>
          ))}
        </div>
      )}

      {/* heroes */}
      {m.heroes && (
        <div className="grid grid-cols-3 gap-4 md:gap-6 mt-4">
          {m.heroes.names.map((hero, i) => (
            <div key={hero + i} className="text-center">
              <img
                src={m.heroes.icon[i]}
                alt={hero}
                className="w-14 h-14 sm:w-[130px] sm:h-[130px] mx-auto rounded-md object-contain shadow-sm"
              />
              <div className="mt-2 font-medium text-zinc-200">{hero}</div>
              {m.heroes.acquisition?.[i]?.length > 0 && (
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

      {/* heroGroups (SSR, SR, R) */}
      {m.heroGroups?.map((group, gi) => (
        <div key={group.groupName + gi} className="mt-6">
          <h4 className="text-base font-semibold mb-2 text-green-400">
            {group.groupName}
          </h4>

          {/* SSR / R structure */}
          {group.heroes && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {group.heroes.names.map((hero, i) => (
                <div key={hero + i} className="text-center text-sm">
                  <img
                    src={group.heroes.images[i]}
                    alt={hero}
                    className="w-14 h-14 sm:w-[120px] sm:h-[120px] mx-auto object-contain rounded shadow"
                  />
                  <div className="mt-2">{hero}</div>
                  {group.heroes.acquisition?.[i]?.length > 0 && (
                    <div className="flex justify-center gap-1 mt-1">
                      {group.heroes.acquisition[i].map((source, idx) => (
                        <img
                          key={idx}
                          src={`/icon/${source}.png`}
                          alt={source}
                          title={source}
                          className="w-5 h-5"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* SR grid structure */}
          {group.heroGrids?.map((grid, gidx) => (
            <div
              key={gidx}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4"
            >
              {grid.names.map((hero, i) => (
                <div key={hero + i} className="text-center text-sm">
                  <img
                    src={grid.images[i]}
                    alt={hero}
                    className="w-14 h-14 sm:w-[120px] sm:h-[120px] mx-auto object-contain rounded shadow"
                  />
                  <div className="mt-2">{hero}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
