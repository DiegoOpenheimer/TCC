import React, { useEffect } from "react"
import { Grid } from "@material-ui/core"
import createStyle from "../style"
import createGlobalStyle from '../../../style/global'
import Card from "./Card"
import { connect } from "react-redux"
import {
  requestTotalUsers,
  requestTotalDevices,
  requestTotalLines,
} from "../../../redux/home/actions"
import InformationLine from './InformationLine'

function Dashboard(props) {
  const classes = createStyle()
  const globalClasses = createGlobalStyle()

  useEffect(() => {
    props.requestTotalUsers()
    props.requestTotalDevices()
    props.requestTotalLines()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid className={globalClasses.maxWidth}>
        <Grid className={classes.contentCard} justify="space-between" container>
            <Card
                buttonError={() => props.requestTotalDevices()}
                error={props.errorLoadTotalDevices}
                isLoading={props.isLoadingTotalDevices}
                icon="location_on"
                title="Total de dispositivos"
                content={props.totalDevices}
            />
            <Card
                buttonError={() => props.requestTotalLines()}
                error={props.errorLoadTotalLines}
                isLoading={props.isLoadingTotalLines}
                styleIcon={{backgroundColor: "rgb(251, 140, 0)"}}
                icon="directions"
                title="Total de linhas"
                content={props.totalLines}
            />
            <Card
                buttonError={() => props.requestTotalUsers()}
                error={props.errorLoadTotalUsers}
                isLoading={props.isLoadingTotalUsers}
                textColors="#FFF"
                styleIcon={{backgroundColor: "#FFF", color: '#000'}}
                styleCard={{backgroundColor: '#3f51b5', color: '#FFF'}}
                icon="people_outline"
                title="Total de usuários"
                content={props.totalUsers}
            />
        </Grid>
        <InformationLine />
    </Grid>

  )
}

const mapStateToProps = state => ({
  isLoadingTotalUsers: state.home.isLoadingTotalUsers,
  totalUsers: state.home.totalUsers,
  errorLoadTotalUsers: state.home.errorLoadTotalUsers,
  totalDevices: state.home.totalDevices,
  isLoadingTotalDevices: state.home.isLoadingTotalDevices,
  errorLoadTotalDevices: state.home.errorLoadTotalDevices,
  totalLines: state.home.totalLines,
  isLoadingTotalLines: state.home.isLoadingTotalLines,
  errorLoadTotalLines: state.home.errorLoadTotalLines
})

export default connect(
  mapStateToProps,
  { requestTotalUsers, requestTotalDevices, requestTotalLines }
)(Dashboard)
