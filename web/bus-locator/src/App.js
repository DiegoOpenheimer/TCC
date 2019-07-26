import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import { toast } from 'react-toastify'
import store from './redux/index'
import { Provider } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/login/login'
import Home from './pages/home/home'
import './services/mqtt'

function App() {
  toast.configure({ position: toast.POSITION.BOTTOM_RIGHT })
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/home" component={Home} />
          <Redirect from="*" to='/login' />
          <Redirect from="/" to='/login' />
        </Switch>
      </Router>
    </Provider>
  )
}

export default App
