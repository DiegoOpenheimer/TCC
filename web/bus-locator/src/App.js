import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import store from './redux/index'
import { Provider } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/login/login'
import Home from './pages/home/home'

function App() {
  toast.configure()
  return (
    <Provider store={store}>
      <Router>
        <Route path="/login" component={Login} />
        <Route path="/home" component={Home} />
        <Redirect from="*" to="/login" />
      </Router>
    </Provider>
  )
}

export default App