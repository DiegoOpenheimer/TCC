import network from '../../services/network'

export const type = {
    LOADING_TOTAL_USERS: 'LOADING_TOTAL_USERS',
    TOTAL_USERS: 'TOTAL_USERS',
    ERROR_LOAD_TOTAL_USERS: 'ERROR_LOAD_TOTAL_USERS',
    TOTAL_DEVICES: 'TOTAL_DEVICES',
    ERROR_LOAD_TOTAL_DEVICES: 'ERROR_LOAD_TOTAL_DEVICES',
    LOADING_TOTAL_DEVICES: 'LOADING_TOTAL_DEVICES',
    TOTAL_LINES: 'TOTAL_LINES',
    ERROR_LOAD_TOTAL_LINES: 'ERROR_LOAD_TOTAL_LINES',
    LOADING_TOTAL_LINES: 'LOADING_TOTAL_LINES',
    USERS_NOT_AUTHORIZED: 'USERS_NOT_AUTHORIZED',
    UPDATE_USER: 'UPDATE_USER',
    UPDATE_SCORE: 'UPDATE_SCORE',
    LOADING_SCORE: 'LOADING_SCORE',
    ERROR_LOAD_SCORE: 'ERROR_LOAD_SCORE',
}

const handleTotalUsers = value => ({ type: type.TOTAL_USERS, payload: { value } })
const handleLoadingTotalUsers = value => ({ type: type.LOADING_TOTAL_USERS, payload: { value } })
const handleErrorTotalUsers = value => ({ type: type.ERROR_LOAD_TOTAL_USERS, payload: { value } })
const handleTotalDevices = value => ({ type: type.TOTAL_DEVICES, payload: { value } })
const handleLoadingTotalDevices = value => ({ type: type.LOADING_TOTAL_DEVICES, payload: { value } })
const handleErrorTotalDevices = value => ({ type: type.ERROR_LOAD_TOTAL_DEVICES, payload: { value } })
const handleTotalLines = value => ({ type: type.TOTAL_LINES, payload: { value } })
const handleLoadingTotalLines = value => ({ type: type.LOADING_TOTAL_LINES, payload: { value } })
const handleErrorTotalLines = value => ({ type: type.ERROR_LOAD_TOTAL_LINES, payload: { value } })
const handleTotalUsersNotAuthorized = value => ({ type: type.USERS_NOT_AUTHORIZED, payload: { value } })
const handleScore = value => ({ type: type.UPDATE_SCORE, payload: { value } })
const handleLoadingScore = value => ({ type: type.LOADING_SCORE, payload: { value } })
const handleErrorScore = value => ({ type: type.ERROR_LOAD_SCORE, payload: { value } })
export const handleUser = value => ({ type: type.UPDATE_USER, payload: { value } })


export const logout = () => ({ type: type.UPDATE_USER, payload: { value: { email: '', name: '', role: '' } } })

export const requestTotalUsers = (error = console.log) => dispatch => {
  dispatch(handleLoadingTotalUsers(true));
  dispatch(handleErrorTotalUsers(false));
  network
    .get("user/count")
    .then(response => {
      dispatch(handleLoadingTotalUsers(false));
      dispatch(handleTotalUsers(response.data.count));
    })
    .catch(e => {
      error(e);
      dispatch(handleLoadingTotalUsers(false));
      dispatch(handleErrorTotalUsers(true));
    });
};

export const requestTotalDevices = (error = console.log) => dispatch => {
  dispatch(handleErrorTotalDevices(false));
  dispatch(handleLoadingTotalDevices(true));
  network
    .get("device/count")
    .then(response => {
      dispatch(handleLoadingTotalDevices(false));
      dispatch(handleTotalDevices(response.data.count));
    })
    .catch(e => {
      error(e);
      dispatch(handleLoadingTotalDevices(false));
      dispatch(handleErrorTotalDevices(true));
    });
};

export const requestTotalLines = (error = console.log) => dispatch => {
  dispatch(handleErrorTotalLines(false));
  dispatch(handleLoadingTotalLines(true));
  network
    .get("line/count")
    .then(response => {
      dispatch(handleLoadingTotalLines(false));
      dispatch(handleTotalLines(response.data.count));
    })
    .catch(e => {
      error(e);
      dispatch(handleLoadingTotalLines(false));
      dispatch(handleErrorTotalLines(true));
    });
};

export const requestScore = (filter = 'all', success = console.log, error = console.log) => dispatch => {
  dispatch(handleErrorScore(false))
  dispatch(handleLoadingScore(true))
  network
    .get(`line/score?filter=${filter}`)
    .then(response => {
      dispatch(handleLoadingScore(false))
      dispatch(handleScore(response.data))
      success()
    })
    .catch(e => {
      error(e)
      dispatch(handleLoadingScore(false))
      dispatch(handleErrorScore(true))
    })
}

export const requestEmployeeToEnable = (error = console.log) => dispatch => {
    network.get('employee/not_authorized')
    .then(response => dispatch(handleTotalUsersNotAuthorized(response.data)))
    .catch(error)
}

export const requestUser = (error = console.log) => dispatch => {
    network.get('employee/current')
    .then(response => dispatch(handleUser(response.data)))
    .catch(error)
}