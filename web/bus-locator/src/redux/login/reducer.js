import { type } from './actions'

const INITAL_STATE = {
    isLoading: false,
    token: '',
}

const login = (state = INITAL_STATE, action) => {
    switch(action.type) {
        case type.LOGIN_SUCCESS:
            return { ...state, token: action.payload.value }
        case type.LOADING:
            return { ...state, isLoading: action.payload.value }
        default:
            return { ...state }
    }
}

export default login