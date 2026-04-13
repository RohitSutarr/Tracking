import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from '../pages/Dashboard';
import Progress from '../pages/Progress';
import Gallery from '../pages/Gallery';
import Settings from '../pages/Settings';
import Navbar from '../components/Navbar';
function Mainroutes() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/progress' element={<Progress />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/settings' element={<Settings />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default Mainroutes
