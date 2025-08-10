import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from '@/App.jsx'       // make sure this file exists
import Embed from '@/pages/Embed.jsx' // or comment this route out if you don't have it yet
import '@/index.css'              // ok to keep or remove if you don’t have it

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/embed" element={<Embed />} />
    </Routes>
  </BrowserRouter>
)
