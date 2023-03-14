import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Inventory from './components/inventory';

function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/inventory' element={<Inventory />} />
          <Route path='/bot' element={<Landing />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
