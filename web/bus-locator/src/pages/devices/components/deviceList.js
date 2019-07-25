import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../utils/constants'

export default function() {
    return (
        <Link to={ROUTES.ADD_DEVICES}>Device list</Link>
    )
}