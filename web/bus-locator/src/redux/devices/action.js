import network from '../../services/network'
import { updateLoading } from '../components/action'

export const types = {
    UPDATE_DEVICE_LINES: 'UPDATE_DEVICE_LINES',
    ERROR_LOAD_LINES: 'ERROR_LOAD_LINES',
    UPDATE_DEVICE_NAME: 'UPDATE_DEVICE_NAME',
    UPDATE_DEVICE_DIALOG: 'UPDATE_DEVICE_DIALOG',
    UPDATE_LINE_VALUE: 'UPDATE_LINE_VALUE',
    DEVICE_CLEAR: 'DEVICE_CLEAR',
    UPDATE_DEVICES_DOCS: 'UPDATE_DEVICES_DOCS',
    UPDATE_DEVICES: 'UPDATE_DEVICES'
}

export const updateName = value => ({ type: types.UPDATE_DEVICE_NAME, payload: { value }})

export const openDialog = value => ({ type: types.UPDATE_DEVICE_DIALOG, payload: { value }})

export const updateLines = value => ({ type: types.UPDATE_DEVICE_LINES, payload: { value }})

export const updateDevicesDocs = value => ({ type: types.UPDATE_DEVICES_DOCS, payload: { value }})

export const updateDevices= value => ({ type: types.UPDATE_DEVICES, payload: { value }})

export const updateErrorLines = value => ({ type: types.ERROR_LOAD_LINES, payload: { value }})

export const onClose = value => ({ type: types.UPDATE_LINE_VALUE, payload: { value } })

export const clear = () => ({ type: types.DEVICE_CLEAR })

export const requestLines = (error = console.log) => dispatch => {
    dispatch(updateLoading(true))
    dispatch(updateErrorLines(false))
    network.get('line/associate')
    .then(response => {
        dispatch(updateLoading(false))
        dispatch(updateLines(response.data))
    })
    .catch(e => {
        dispatch(updateErrorLines(true))
        dispatch(updateLoading(false))
        error(e)
    })
}

export const requestDevices = (page = 1, limit = 10, field, success, error = console.log) => dispatch => {
    dispatch(updateLoading(true))
    let URI = `device?limit=${limit}&page=${page}`
    if (field) {
        URI = URI.concat(`&field=${field}`)
    }
    network.get(URI)
    .then(response => {
        dispatch(updateLoading(false))
        dispatch(updateDevicesDocs(response.data))
        if (success) {
            success()
        }
    })
    .catch(e => {
        dispatch(updateLoading(false))
        error(e)
    })
}

export const requestAllDevices = (success, error = console.log) => dispatch => {
    dispatch(updateLoading(true))
    let URI = `device?all=all`
    network.get(URI)
    .then(response => {
        dispatch(updateLoading(false))
        dispatch(updateDevices(response.data))
        if (success) {
            success()
        }
    })
    .catch(e => {
        dispatch(updateLoading(false))
        error(e)
    })
}

export const createDevice = (body, success = console.log, error = console.log) => dispatch => {
    dispatch(updateLoading(true))
    network.post('device', body)
    .then(response => {
        dispatch(updateLoading(false))
        success(response)
    })
    .catch(e => {
        dispatch(updateLoading(false))
        error(e)
    })
}

export const updateDevice = (body, success = console.log, error = console.log) => {
    network.put('device', body)
    .then(response => {
        success(response)
    })
    .catch(e => {
        error(e)
    })
}

export const removeDevice = (id, success = console.log, error = console.log) => dispatch => {
    dispatch(updateLoading(true))
    network.delete(`device/${id}`)
    .then(response => {
        dispatch(updateLoading(false))
        success(response)
    })
    .catch(e => {
        dispatch(updateLoading(false))
        error(e)
    })
}

