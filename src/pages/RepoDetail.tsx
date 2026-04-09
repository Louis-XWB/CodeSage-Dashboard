import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api, type RepoStats, type HistoryEntry } from '../api'
import StatCard from '../components/StatCard'
import ScoreBadge from '../components/ScoreBadge'
import VerdictBadge from '../components/VerdictBadge'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function RepoDetail() {
  const { name } = useParams<{ name: string }>()
  const repo = decodeURIComponent(name || '')
  const [stats, setStats] = useState<RepoStats | null>(null)
  const [reviews, setReviews] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!repo) return
    Promise.all([api.getRepoStats(repo), api.getHistory({ repo, limit: 50 })])
      .then(([s, r]) => { setStats(s); setReviews(r) })
      .finally(() => setLoading(false))
  }, [repo])

  if (loading || !stats) return <div className="text-gray-500">Loading...</div>

  const trendData = stats.scoreTrend.map((score, i) => ({ review: i + 1, score }))

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{repo}</h1>
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Avg Score" value={`${stats.avgScore}/100`} color={stats.avgScore >= 80 ? 'text-green-400' : stats.avgScore >= 60 ? 'text-yellow-400' : 'text-red-400'} />
        <StatCard label="Reviews" value={stats.totalReviews} />
        <StatCard label="Blocked" value={stats.blockedCount} color="text-red-400" />
        <StatCard label="Critical Issues" value={stats.totalCritical} color="text-red-400" />
      </div>
      {trendData.length >= 2 && (
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 mb-8">
          <h2 className="text-lg font-semibold mb-4">Score Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <XAxis dataKey="review" stroke="#4b5563" />
              <YAxis domain={[0, 100]} stroke="#4b5563" />
              <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      <h2 className="text-lg font-semibold mb-4">Review History</h2>
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-800 text-gray-500">
            <th className="text-left p-3">Date</th><th className="text-left p-3">PR</th>
            <th className="text-left p-3">Branch</th><th className="text-left p-3">Score</th>
            <th className="text-left p-3">Issues</th><th className="text-left p-3">Verdict</th>
          </tr></thead>
          <tbody>
            {reviews.map(r => (
              <tr key={r.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer">
                <td className="p-3 text-gray-400">{r.createdAt.slice(0, 16).replace('T', ' ')}</td>
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
