import { useEffect, useState } from 'react'
import { api, type RepoSummary } from '../api'
import ScoreBadge from '../components/ScoreBadge'
import { Link } from 'react-router-dom'

export default function Repositories() {
  const [repos, setRepos] = useState<RepoSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.listRepos().then(setRepos).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-gray-500">Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Repositories</h1>
      <div className="grid grid-cols-3 gap-4">
        {repos.map(r => (
          <Link key={r.repo} to={`/repos/${encodeURIComponent(r.repo)}`} className="bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-blue-400/50 transition-colors">
            <h3 className="font-semibold text-blue-400 mb-2">{r.repo}</h3>
            <div className="flex items-center justify-between">
              <ScoreBadge score={r.avgScore} size="sm" />
              <span className="text-gray-500 text-sm">{r.reviewCount} reviews</span>
            </div>
            <div className="text-gray-600 text-xs mt-2">Last: {r.lastReview.slice(0, 10)}</div>
          </Link>
        ))}
      </div>
      {repos.length === 0 && <p className="text-gray-500">No repositories reviewed yet.</p>}
    </div>
  )
}
