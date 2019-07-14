import { combineReducers } from 'redux'
import login from './login/reducer'
import home from './home/reducer'

const reducers = combineReducers({ login, home })

export default reducers