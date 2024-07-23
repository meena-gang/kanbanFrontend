import { useState } from 'react'
import './App.css'
import { Routes,Route } from 'react-router'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import Create from './pages/Create'

function App() {
  

  return (
    <>
      <Routes>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/create' element={<Create/>}></Route>
      </Routes>
    </>
  )
}

export default App
