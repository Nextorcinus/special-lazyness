// lib/useGitVersion.js
'use client'

import { useEffect, useState } from 'react'

export function useGitVersion() {
  const [version, setVersion] = useState('...')

  useEffect(() => {
    fetch('/_next/static/git-version.json')
      .then((res) => res.json())
      .then((data) => setVersion(data.version))
      .catch(() => setVersion('unknown'))
  }, [])

  return version
}
