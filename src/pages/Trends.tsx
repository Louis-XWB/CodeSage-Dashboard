import { useEffect, useState } from 'react'
import { api, type HistoryEntry } from '../api'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981']

export default function Trends() {
  const [reviews, setReviews] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getHistory({ limit: 100 }).then(setReviews).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-gray-500">Loading...</div>

  const scoreData = [...reviews].reverse().map((r, i) => ({ review: i + 1, score: r.score, repo: r.repo }))
  const totalCritical = reviews.reduce((s, r) => s + r.criticalCount, 0)
  const totalWarning = reviews.reduce((s, r) => s + r.warningCount, 0)
  const totalInfo = reviews.reduce((s, r) => s + r.infoCount, 0)
  const issueData = [
    { name: 'Critical', value: totalCritical },
    { name: 'Warning', value: totalWarning },
    { name: 'Info', value: totalInfo },
  ].filter(d => d.value > 0)

  const blockedRate = reviews.length > 0 ? Math.round(reviews.filter(r => r.blocked).length / reviews.length * 100) : 0

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Trends</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <div className="text-2xl font-bold">{reviews.length}</div>
          <div className="text-gray-500 text-sm">Total Reviews</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <div className="text-2xl font-bold text-red-400">{blockedRate}%</div>
          <div className="text-gray-500 text-sm">Blocked Rate</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <div className="text-2xl font-bold">{totalCritical + totalWarning + totalInfo}</div>
          <div className="text-gray-500 text-sm">Total Issues Found</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Score Over Time</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={scoreData}>
              <XAxis dataKey="review" stroke="#4b5563" />
              <YAxis domain={[0, 100]} stroke="#4b5563" />
              <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Issues by Severity</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={issueData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {issueData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
