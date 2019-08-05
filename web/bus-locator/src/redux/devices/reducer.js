import { types } from './action'

const INITIAL_STATE = {
    name: '',
    open: false,
    lines: [],
    errorToLoadLines: false,
    value: '',
    data: {
        docs: [],
        total: 0,
        limit: 10,
        page: 1,
        pages: 1
    },
    devices: [],
    currentDevice: null
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case types.UPDATE_DEVICE_NAME:
            return { ...state, name: action.payload.value }
        case types.UPDATE_DEVICE_LINES:
            return { ...state, lines: action.payload.value }
        case types.UPDATE_DEVICES_DOCS:
            return { ...state, data: action.payload.value }
        case types.UPDATE_DEVICES:
            return { ...state, devices: action.payload.value, currentDevice: null }
        case types.UPDATE_CURRENT_DEVICE:
            return { ...state, currentDevice: action.payload.value }
        case types.UPDATE_DEVICE_DIALOG:
            return { ...state, open: action.payload.value }
        case types.ERROR_LOAD_LINES:
            return { ...state, errorToLoadLines: action.payload.value }
        case types.UPDATE_LINE_VALUE:
            return { ...state, open: false, value: action.payload.value || state.value }
        case types.DEVICE_CLEAR:
            return { ...state, open: false, name: '', lines: [], value: '' }
        default:
            return { ...state }
    }
}