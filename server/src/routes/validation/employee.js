const Employee = require('../../model/employee')
const jwt = require('../../utils/jwt')
const constants = require('../../utils/constants')

const verifyIfEmployeeIsAdmin = async (req, res, next) => {
    try {
        const auth = req.headers.authorization
        if (auth !== 'undefined' && auth != null) {
            const { _id } = jwt.decode(auth)
            const employee = await Employee.findById(_id)
            if (employee && employee.role === constants.EMPLOYEE_ROLE.ADMIN) {
                next()
            } else {
                res.status(401).send({ message: 'not authorized' })
            }
        } else {
            res.status(401).send({ message: 'not authorized' })
        }
    } catch(e) {
        console.log(e)
        res.status(500).send({ message: 'Error server' })
    }
}

module.exports = { verifyIfEmployeeIsAdmin }