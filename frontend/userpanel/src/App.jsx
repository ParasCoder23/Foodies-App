import React from 'react'
import Menubar from './components/Menubar/Menubar'
import Home from './pages/Home/Home'
import ContactUs from './pages/Contact/Contact'
import ExploreFood from './pages/ExploreFood/ExploreFood'
import { Route, Routes } from 'react-router-dom'
const App = () => {
  return (
    <div>
      <Menubar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<ContactUs />} />
        <Route path='/explore' element={<ExploreFood />} />
      </Routes>
    </div>
  )
}

export default App
