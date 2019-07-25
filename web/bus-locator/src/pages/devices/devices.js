import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ROUTES } from '../../utils/constants'
import DeviceList from './components/deviceList'
import AddDevice from './components/addDevice'

export default function(){

    return (
        <Switch>
            <Route path={ROUTES.DEVICES} exact component={DeviceList} />
            <Route path={ROUTES.ADD_DEVICES} exact component={AddDevice} />
            <Redirect from="*" to={ROUTES.DEVICES} />
        </Switch>
    )

}