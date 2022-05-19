import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/home'
import Test from './pages/test'
import BasicPlane from './pages/basic_plane'

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
          <Route path="/" exact element={<Home />} />
          <Route path="/basic-plane" exact element={<BasicPlane />} />
        </Routes>
      </div>
    </Router>
  )
}
