import React from 'react'
import { EMPLOYEE_ROLE, USER_STATUS } from '../../../utils/constants'

export const Status = ({ status }) => {
    
    function getMessage() {
        if (status === USER_STATUS.PENDING) {
            return 'Usuário pendente'
        } else if (status === USER_STATUS.NOT_AUTHORIZED) {
            return 'Não autorizado'
        } else if (status === USER_STATUS.ENABLED) {
            return 'Usuário habilitado'
        }
        return 'Desconhecido'
    }
    
    return (
        <p>{ getMessage() }</p>
    )
}

export const Role = ({ role }) => {
    
    function getMessage() {
        if (role === EMPLOYEE_ROLE.ADMIN) {
            return 'Administrador'
        } else if (role === EMPLOYEE_ROLE.COMMON) {
            return 'Comum'
        }
        return 'Desconhecido'
    }
    
    return (
        <p>{ getMessage() }</p>
    )
}

