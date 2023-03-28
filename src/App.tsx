import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Inventory from './pages/Inventory';
import Build from './pages/Build';
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/inventoryContext';
import Layout from './components/layout';

function App() {

  return (
    <AuthProvider>
      <InventoryProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path='/' element={<Landing />} />
              <Route path='/signin' element={<SignIn />} />
              <Route path='/signup' element={<SignUp />} />
              <Route path='/inventory' element={<Inventory />} />
              <Route path='/build' element={<Build />} />
            </Routes>
          </Layout>
        </BrowserRouter >
      </InventoryProvider>
    </AuthProvider>
  )
}

export default App
