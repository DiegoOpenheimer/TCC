import React from 'react'
import { Drawer }  from '@material-ui/core'
import createStyle from '../style'

const CustomDrawer = props => {

    const { onClose, open } = props
    const classesLocal = createStyle()

    return (
        <Drawer
            variant="persistent"
            onClose={onClose}
            className={classesLocal.drawer}
            anchor="left"
            open={open}
            classes={{
            paper: classesLocal.drawerPaper,
            }}
        >
        <h1 onClick={onClose}>ola</h1>
        </Drawer>
    )

}

export default CustomDrawer