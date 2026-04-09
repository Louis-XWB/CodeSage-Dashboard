export default function ScoreBadge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const color = score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'
  const bg = score >= 80 ? 'bg-green-400/10' : score >= 60 ? 'bg-yellow-400/10' : 'bg-red-400/10'
  const sizeClass = size === 'lg' ? 'text-3xl px-4 py-2' : size === 'md' ? 'text-lg px-3 py-1' : 'text-sm px-2 py-0.5'

  return (
    <span className={`${color} ${bg} ${sizeClass} rounded-lg font-bold`}>
      {score}/100
    </span>
  )
}
