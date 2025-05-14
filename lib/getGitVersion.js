'use client'

import { useEffect, useState } from 'react'

export function useGitVersion() {
  const [version, setVersion] = useState('...')

  useEffect(() => {
    fetch('/git-version.json') // ✅ ini yang benar
      .then((res) => res.json())
      .then((data) => setVersion(data.version))
      .catch(() => setVersion('unknown'))
  }, [])

  return version
}
