import { combineReducers } from 'redux'
import login from './login/reducer'
import home from './home/reducer'
import employee from './employees/reducer'

const reducers = combineReducers({ login, home, employee })

export default reducers