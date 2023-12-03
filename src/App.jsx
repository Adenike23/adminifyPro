import { useState } from 'react'
import './App.css'
import Home from './home/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar/Navbar'

function App() {
  
  return (
    <>
    <Router>
      <Navbar/>
      <Routes>
      <Route path='/' element={<Home/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
