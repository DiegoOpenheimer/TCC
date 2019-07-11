import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'

import Login from './pages/login/login'


function App() {
  toast.configure()
  return (
    <Router>
      <Route path="/login" component={Login} />
      <Redirect from="*" to="/login" />
    </Router>
  )
}

export default App
