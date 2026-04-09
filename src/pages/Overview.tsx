import { useEffect, useState } from 'react'
import { api, type RepoSummary, type HistoryEntry } from '../api'
import StatCard from '../components/StatCard'
import ScoreBadge from '../components/ScoreBadge'
import VerdictBadge from '../components/VerdictBadge'
import { Link } from 'react-router-dom'

export default function Overview() {
  const [repos, setRepos] = useState<RepoSummary[]>([])
  const [recent, setRecent] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.listRepos(), api.getHistory({ limit: 10 })])
      .then(([r, h]) => { setRepos(r); setRecent(h) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-gray-500">Loading...</div>

  const totalReviews = repos.reduce((s, r) => s + r.reviewCount, 0)
  const avgScore = repos.length > 0 ? Math.round(repos.reduce((s, r) => s + r.avgScore, 0) / repos.length) : 0
  const blockedCount = recent.filter(r => r.blocked).length

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Overview</h1>
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Repositories" value={repos.length} color="text-blue-400" />
        <StatCard label="Total Reviews" value={totalReviews} />
        <StatCard label="Avg Score" value={`${avgScore}/100`} color={avgScore >= 80 ? 'text-green-400' : avgScore >= 60 ? 'text-yellow-400' : 'text-red-400'} />
        <StatCard label="Recent Blocked" value={blockedCount} color={blockedCount > 0 ? 'text-red-400' : 'text-green-400'} />
      </div>
      <h2 className="text-lg font-semibold mb-4">Recent Reviews</h2>
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-800 text-gray-500">
            <th className="text-left p-3">Date</th><th className="text-left p-3">Repository</th>
            <th className="text-left p-3">PR</th><th className="text-left p-3">Score</th>
            <th className="text-left p-3">Issues</th><th className="text-left p-3">Verdict</th>
          </tr></thead>
          <tbody>
            {recent.map(r => (
              <tr key={r.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="p-3 text-gray-400">{r.createdAt.slice(0, 16).replace('T', ' ')}</td>
                <td className="p-3"><Link to={`/repos/${encodeURIComponent(r.repo)}`} className="text-blue-400 hover:underline">{r.repo}</Link></td>
                <td className="p-3">{r.prNumber ? `#${r.prNumber}` : '-'}</td>
                <td className="p-3"><ScoreBadge score={r.score} size="sm" /></td>
                <td className="p-3">
                  <span className="text-red-400">{r.criticalCount}</span>
                  <span className="text-gray-600 mx-1">/</span>
                  <span className="text-yellow-400">{r.warningCount}</span>
                  <span className="text-gray-600 mx-1">/</span>
                  <span className="text-blue-400">{r.infoCount}</span>
                </td>
                <td className="p-3"><VerdictBadge blocked={r.blocked} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
