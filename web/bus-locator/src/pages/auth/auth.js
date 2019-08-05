import React from 'react'
import storage from '../../services/storage'
import { EMPLOYEE_ROLE, ROUTES } from '../../utils/constants'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

export default props => {

    const REDIRECT_TO_LOGIN = 3
    const REDIRECT_TO_MAP = 2
    const RENDER_CHILDREN = 1

    const user = useSelector(state => state.home.user)
    
    function getRedirectRoute() {
        const storageUser = storage.getUser()
        if (!storageUser) {
            return REDIRECT_TO_LOGIN
        }
        if (props.onlyToken) {
            return RENDER_CHILDREN
        }
        if ((!user.role && storageUser.role === EMPLOYEE_ROLE.ADMIN) ||
            (user.role === EMPLOYEE_ROLE.ADMIN)) {
            return RENDER_CHILDREN
        }
        return REDIRECT_TO_MAP
    }

    function handleRoute() {
        const result = getRedirectRoute()
        if (result === REDIRECT_TO_LOGIN) {
            return <Redirect to={ROUTES.LOGIN} />
        } else if (result === RENDER_CHILDREN) {
            return props.children
        } else {
            return <Redirect to={ROUTES.MAP} />
        }
    }

    return (
        <React.Fragment>
            {handleRoute()}
        </React.Fragment>
    )
}