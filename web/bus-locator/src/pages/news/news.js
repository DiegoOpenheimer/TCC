import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import List from './components/list'
import Add from './components/add'
import { ROUTES } from '../../utils/constants'

export default () => {
    return (
        <Switch>
            <Route path={ROUTES.NEWS} exact component={List} />
            <Route path={ROUTES.ADD_NEWS} exact component={Add} />
            <Route path={ROUTES.ADD_NEWS.concat('/:id')} exact component={Add} />
            <Redirect from="*" to={ROUTES.NEWS} />
        </Switch>
    )
}
