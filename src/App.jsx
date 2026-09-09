import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AdminDashboard from './components/AdminDashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Router>
      <div>
        <Routes>
           <Route path="/" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
    </>
  )
}

export default App
