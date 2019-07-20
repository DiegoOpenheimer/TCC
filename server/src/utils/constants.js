const USER_STATUS = {
    ENABLED: 'ENABLED',
    PENDING: 'PEDING',
    NOT_AUTHORIZED: 'NOT_AUTHORIZED'
}

const EMPLOYEE_ROLE = {
    COMMON: 'COMMON',
    ADMIN: 'ADMIN'
}

function Translate(key) {
    const value = {
        [EMPLOYEE_ROLE.COMMON]: 'comum',
        [EMPLOYEE_ROLE.ADMIN]: 'administrador',
        [USER_STATUS.ENABLED]: 'habilitado',
        [USER_STATUS.NOT_AUTHORIZED]: 'não habilitado'
    }
    return value[key]
}

module.exports = {
    USER_STATUS,
    EMPLOYEE_ROLE,
    Translate
}