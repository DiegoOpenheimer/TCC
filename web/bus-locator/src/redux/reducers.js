import {
    combineReducers
} from 'redux'
import login from './login/reducer'
import home from './home/reducer'
import employee from './employees/reducer'
import component from './components/reducer'
import history from './history/reducer'
import suggestion from './suggestion/reducer'
import line from './lines/reducer'

const reducers = combineReducers({
    login,
    home,
    employee,
    component,
    history,
    suggestion,
    line
})

export default reducers