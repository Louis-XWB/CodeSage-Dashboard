import { Link, Outlet, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', label: 'Overview' },
  { path: '/repos', label: 'Repositories' },
  { path: '/reviews', label: 'Reviews' },
  { path: '/trends', label: 'Trends' },
  { path: '/settings', label: 'Settings' },
]

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 flex items-center h-14">
          <Link to="/" className="text-blue-400 font-bold text-lg mr-8">🔮 CodeSage</Link>
          <div className="flex gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
                    ? 'bg-gray-800 text-blue-400'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
