import { useEffect, useState } from 'react'
import { api, type HistoryEntry } from '../api'
import ScoreBadge from '../components/ScoreBadge'
import VerdictBadge from '../components/VerdictBadge'
import { Link } from 'react-router-dom'

export default function Reviews() {
  const [reviews, setReviews] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getHistory({ limit: 50 }).then(setReviews).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-gray-500">Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Reviews</h1>
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-800 text-gray-500">
            <th className="text-left p-3">Date</th><th className="text-left p-3">Repository</th>
            <th className="text-left p-3">PR</th><th className="text-left p-3">Branch</th>
            <th className="text-left p-3">Score</th><th className="text-left p-3">Issues</th>
            <th className="text-left p-3">Verdict</th>
          </tr></thead>
          <tbody>
            {reviews.map(r => (
              <tr key={r.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="p-3 text-gray-400">{r.createdAt.slice(0, 16).replace('T', ' ')}</td>
                <td className="p-3"><Link to={`/repos/${encodeURIComponent(r.repo)}`} className="text-blue-400 hover:underline">{r.repo}</Link></td>
                <td className="p-3">{r.prNumber ? <Link to={`/reviews/${r.id}`} className="text-blue-400 hover:underline">#{r.prNumber}</Link> : '-'}</td>
                <td className="p-3 text-gray-400">{r.headBranch || '-'}</td>
                <td className="p-3"><ScoreBadge score={r.score} size="sm" /></td>
                <td className="p-3"><span className="text-red-400">{r.criticalCount}</span>/<span className="text-yellow-400">{r.warningCount}</span>/<span className="text-blue-400">{r.infoCount}</span></td>
                <td className="p-3"><VerdictBadge blocked={r.blocked} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
