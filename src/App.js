import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/home'
import Test from './pages/test'
import BasicPlane from './pages/basic_plane'
import Elevation from './pages/elevation'

export default function App() {
  return (
    <Router>
      <div>
        {/* <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/test">Test</Link>
            </li>
          </ul>
        </nav> */}
        <Routes>
          <Route path="/test" element={<Test />} />
          <Route path="/basic-plane" element={<BasicPlane />} />
          <Route path="/elevation" element={<Elevation />} />
          <Route path="/" exact element={<Home />} />
        </Routes>
      </div>
    </Router>
  )
}
