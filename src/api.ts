const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export interface RepoSummary {
  repo: string
  reviewCount: number
  avgScore: number
  lastReview: string
}

export interface HistoryEntry {
  id: number
  repo: string
  prNumber: number | null
  baseBranch: string | null
  headBranch: string | null
  score: number
  summary: string
  issuesCount: number
  criticalCount: number
  warningCount: number
  infoCount: number
  blocked: boolean
  filesChanged: number
  additions: number
  deletions: number
  createdAt: string
}

export interface RepoStats {
  repo: string
  totalReviews: number
  avgScore: number
  totalIssues: number
  totalCritical: number
  blockedCount: number
  passedCount: number
  lastReview: string
  scoreTrend: number[]
}

export interface ReviewIssue {
  severity: 'critical' | 'warning' | 'info'
  category: string
  file: string
  line?: number
  commit?: string
  commitMessage?: string
  title: string
  description: string
  suggestion?: string
}

export interface ReviewDetail extends HistoryEntry {
  changedFiles: string[]
  report: {
    summary: string
    score: number
    issues: ReviewIssue[]
    suggestions: { title: string; description: string }[]
    metadata: { model: string; duration: number; filesReviewed: number }
  }
}

export const api = {
  listRepos: () => fetchApi<RepoSummary[]>('/api/history/repos'),
  getRepoStats: (repo: string) => fetchApi<RepoStats>(`/api/history/repos/${encodeURIComponent(repo)}/stats`),
  getHistory: (params?: { repo?: string; pr?: number; limit?: number }) => {
    const query = new URLSearchParams()
    if (params?.repo) query.set('repo', params.repo)
    if (params?.pr) query.set('pr', String(params.pr))
    if (params?.limit) query.set('limit', String(params.limit))
    const qs = query.toString()
    return fetchApi<HistoryEntry[]>(`/api/history${qs ? '?' + qs : ''}`)
  },
  getReviewDetail: (id: number) => fetchApi<ReviewDetail>(`/api/history/${id}`),
}
