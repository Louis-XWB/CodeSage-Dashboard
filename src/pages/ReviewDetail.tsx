import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api, type ReviewDetail as ReviewDetailType } from '../api'
import ScoreBadge from '../components/ScoreBadge'
import VerdictBadge from '../components/VerdictBadge'

const categoryIcon: Record<string, string> = { bug: '🐛', security: '🔒', performance: '⚡', style: '🎨', design: '📐' }
const severityColor: Record<string, string> = { critical: 'border-red-400/50 bg-red-400/5', warning: 'border-yellow-400/50 bg-yellow-400/5', info: 'border-blue-400/50 bg-blue-400/5' }
const severityText: Record<string, string> = { critical: 'text-red-400', warning: 'text-yellow-400', info: 'text-blue-400' }

export default function ReviewDetail() {
  const { id } = useParams<{ id: string }>()
  const [review, setReview] = useState<ReviewDetailType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    api.getReviewDetail(parseInt(id)).then(setReview).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="text-gray-500">Loading...</div>
  if (!review) return <div className="text-gray-500">Review not found</div>

  const { report } = review

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">{review.repo} #{review.prNumber}</h1>
        <ScoreBadge score={review.score} size="lg" />
        <VerdictBadge blocked={review.blocked} />
      </div>
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 mb-6">
        <p className="text-gray-300">{report.summary}</p>
        <div className="text-gray-600 text-sm mt-2">
          {review.createdAt.slice(0, 16).replace('T', ' ')} · {review.headBranch} → {review.baseBranch} · {review.filesChanged} files (+{review.additions} -{review.deletions})
        </div>
      </div>
      <h2 className="text-lg font-semibold mb-4">Issues ({report.issues.length})</h2>
      <div className="space-y-3 mb-8">
        {report.issues.map((issue, i) => (
          <div key={i} className={`rounded-xl p-4 border ${severityColor[issue.severity]}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`font-bold uppercase text-xs ${severityText[issue.severity]}`}>{issue.severity}</span>
              <span>{categoryIcon[issue.category] || '📋'} {issue.title}</span>
            </div>
            <div className="text-gray-400 text-sm mb-1">
              <code className="bg-gray-800 px-1 rounded">{issue.file}{issue.line ? `:${issue.line}` : ''}</code>
              {issue.commit && <span className="ml-2 text-gray-600"><code>{issue.commit}</code> {issue.commitMessage && <em>{issue.commitMessage}</em>}</span>}
            </div>
            <p className="text-gray-300 text-sm">{issue.description}</p>
            {issue.suggestion && <p className="text-green-400/80 text-sm mt-2">💡 {issue.suggestion}</p>}
          </div>
        ))}
      </div>
      {report.suggestions.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-4">Recommendations</h2>
          <div className="space-y-3">
            {report.suggestions.map((s, i) => (
              <div key={i} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <h3 className="font-medium mb-1">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.description}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
