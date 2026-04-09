import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Overview from './pages/Overview'
import Repositories from './pages/Repositories'
import RepoDetail from './pages/RepoDetail'
import Reviews from './pages/Reviews'
import ReviewDetail from './pages/ReviewDetail'
import Trends from './pages/Trends'
import Settings from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Overview />} />
          <Route path="/repos" element={<Repositories />} />
          <Route path="/repos/:name" element={<RepoDetail />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/reviews/:id" element={<ReviewDetail />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
