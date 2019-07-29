import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import List from './components/list'
import Add from './components/add'
import { ROUTES } from '../../utils/constants'

export default () => {
    return (
        <Switch>
            <Route path={ROUTES.LINES} exact component={List} />
            <Route path={ROUTES.ADD_LINES} exact component={Add} />
            <Route path={ROUTES.ADD_LINES.concat('/:id')} exact component={Add} />
            <Redirect from="*" to={ROUTES.LINES} />
        </Switch>
    )
}
