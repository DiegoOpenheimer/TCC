import { combineReducers } from 'redux'
import login from './login/reducer'
import home from './home/reducer'
import employee from './employees/reducer'
import component from './components/reducer'

const reducers = combineReducers({ login, home, employee, component })

export default reducers