import { useState } from 'react'

export default function Settings() {
  const [apiUrl, setApiUrl] = useState(localStorage.getItem('codesage_api_url') || '')

  const save = () => {
    if (apiUrl) {
      localStorage.setItem('codesage_api_url', apiUrl)
    } else {
      localStorage.removeItem('codesage_api_url')
    }
    alert('Saved! Reload to apply.')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 max-w-lg">
        <h2 className="font-semibold mb-4">API Configuration</h2>
        <label className="block text-sm text-gray-400 mb-1">API Base URL</label>
        <input
          value={apiUrl}
          onChange={e => setApiUrl(e.target.value)}
          placeholder="http://localhost:3000 (default)"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:border-blue-400 focus:outline-none"
        />
        <p className="text-gray-600 text-xs mt-1">Leave empty for default (http://localhost:3000)</p>
        <button onClick={save} className="mt-4 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Save
        </button>
      </div>
    </div>
  )
}
