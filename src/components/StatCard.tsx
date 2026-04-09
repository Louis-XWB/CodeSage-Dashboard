export default function StatCard({ label, value, color = 'text-gray-100' }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-gray-500 text-sm mt-1">{label}</div>
    </div>
  )
}
