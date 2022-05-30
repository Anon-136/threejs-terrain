import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/home'
import Test from './pages/test'
import Terrain from './pages/terrain'
import TerrainWithHypsometricTints from './pages/terrain/hypsometricTints'

import Infinite from './pages/infinite'

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
          <Route path="/terrain" element={<Terrain />} />
          <Route path="/infinite" element={<Infinite />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" exact element={<TerrainWithHypsometricTints />} />
        </Routes>
      </div>
    </Router>
  )
}
