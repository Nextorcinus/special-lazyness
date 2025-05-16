'use client'

import changelog from 'data/changelog'
import { useGitVersion } from 'lib/getGitVersion'

export default function ChangelogPage() {
  const currentVersion = useGitVersion()

  const currentEntry = changelog.find(
    (entry) => entry.version === currentVersion
  )
  console.log('Current Version:', currentVersion)
  console.log('Current Entry:', currentEntry)

  return (
    <div className="p-6 max-w-3xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">Changelog</h1>

      <p className="mb-2 text-sm text-zinc-400">
        Current Version:{' '}
        <span className="text-green-400 font-mono">{currentVersion}</span>
        {currentEntry && (
          <span className="text-sm text-zinc-500 font-normal">
            {' '}
            ({currentEntry.date})
          </span>
        )}
      </p>

      {currentEntry && (
        <ul className="list-disc list-inside text-zinc-300 mb-4">
          {currentEntry.changes.map((change, idx) => (
            <li key={idx}>{change}</li>
          ))}
        </ul>
      )}

      {/* Tampilkan seluruh changelog lainnya */}
      {changelog.map((entry) => (
        <div key={entry.version} className="mb-6">
          <h2 className="text-sm  text-lime-400">
            {entry.version}{' '}
            <span className="text-sm text-zinc-500 font-normal">
              ({entry.date})
            </span>
          </h2>
          <ul className="list-disc list-inside mt-2 text-zinc-300">
            {entry.changes.map((change, idx) => (
              <li key={idx}>{change}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
