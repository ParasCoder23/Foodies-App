import React from 'react'
import Menubar from './components/Menubar/Menubar'
import Home from './pages/Home/Home'
import ContactUs from './pages/Contact/Contact'
import ExploreFood from './pages/ExploreFood/ExploreFood'
import { Route, Routes } from 'react-router-dom'
import FoodDetails from './pages/FoodDetails/FoodDetails'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import { ToastContainer } from 'react-toastify'

const App = () => {
  return (
    <div>
      <Menubar />
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<ContactUs />} />
        <Route path='/explore' element={<ExploreFood />} />
        <Route path='/food/:id' element={<FoodDetails />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/order' element={<PlaceOrder />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </div>
  )
}

export default App
