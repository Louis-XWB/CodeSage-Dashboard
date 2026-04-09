export default function VerdictBadge({ blocked }: { blocked: boolean }) {
  return blocked ? (
    <span className="bg-red-400/10 text-red-400 px-2 py-0.5 rounded text-sm font-medium">🚫 BLOCKED</span>
  ) : (
    <span className="bg-green-400/10 text-green-400 px-2 py-0.5 rounded text-sm font-medium">✅ PASSED</span>
  )
}
