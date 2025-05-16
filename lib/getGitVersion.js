import gitVersion from './gitVersion.json'

export function useGitVersion() {
  return gitVersion.version || 'unknown'
}
