import React, { useEffect, useState } from 'react'
import { Grid, Drawer, Button, Typography } from '@material-ui/core'
import Maps from '../../components/Map'
import MarkerWithLabel from 'react-google-maps/lib/components/addons/MarkerWithLabel'
import { connect } from 'react-redux'
import { requestAllDevices, updateDevices, requestDeviceById } from '../../redux/devices/action'
import BUS from '../../assets/bus.png'
import createStyle from '../../style/global'
import createLocalStyle from './styles'
import { toast } from 'react-toastify'
import { Polyline } from 'react-google-maps'
import mqtt from '../../services/mqtt'
import store from '../../redux/index'

const mapStateToProps = state => ({devices: state.device.devices, loading: state.component.loading, currentDevice: state.device.currentDevice})

export default connect(mapStateToProps, { requestAllDevices, updateDevices, requestDeviceById })(PageMaps)

function PageMaps(props) {

    const [ load, setLoad ] = useState(false)
    const [ controller, setController ] = useState({ device: null, open: false, filter: false })
    const classes = createStyle({ marginVertical: '16px' })
    const classesLocal = createLocalStyle()

    useEffect(() => {
        window.initMap = () => setLoad(true)
        if (load || window.google) {
            props.requestAllDevices()
            mqtt.subscribe('#')
            mqtt.addListener('message', onMessage)
        }
        return () => {
            props.updateDevices([])
            mqtt.removeListener('message', onMessage)
            mqtt.unsubscribe('#')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ load ])

    useEffect(() => {
        if (props.currentDevice) {
            setController({ device: props.currentDevice, open: false, filter: true })
        }
    }, [ props.currentDevice ])

    function onMessage(topic, message) {
        try {
            if (topic.endsWith('/location')) {
                const id = topic.split('/')[0]
                const stateDevices = store.getState().device.devices
                const devices = [...stateDevices]
                const deviceFound = devices.find(device => device.uuid === id)
                if (deviceFound) {
                    const payload = JSON.parse(String(message))
                    deviceFound.latitude = payload.lat
                    deviceFound.longitude = payload.lon
                    props.updateDevices(devices) 
                }
            }
        } catch {}
    }

    function buildRoute() {
        if (controller.filter && controller.device.line.directions) {
            return <Polyline
                path={controller.device.line.directions.routes}
                geodesic={true}
                options={{
                    strokeColor: "#ff2527",
                    strokeWeight: 3,
                 }}
            />
        }
    }

    function buildPoints() {
        if (controller.filter && controller.device.line.points) {
            return controller.device.line.points.map((point, index) => {
                return (
                    <MarkerWithLabel
                        key={index.toString()}
                        position={point}
                        labelAnchor={new window.google.maps.Point(0, 0)}
                        labelStyle={point.name && {backgroundColor: "#FFF", fontSize: "12px", padding: "8px", borderRadius: '8px'}}
                    >
                        { point.name ? <div>{point.name}</div> : <div></div> }
                    </MarkerWithLabel>
                )
            })
        }
    }

    function buildMarker() {
        const { google } = window
        if (google) {
            return props.devices
            .filter(device => !(controller.filter && controller.device && controller.device._id !== device._id))
            .map(device => {
                const message = device.lineNumber ? `${device.lineNumber} - ${device.lineDescription}` : null
                if (device.latitude && device.longitude) {
                    return (
                        <MarkerWithLabel
                            onClick={() => setController({ ...controller, open: true, device })}
                            key={device._id}
                            icon={{
                                url: BUS,
                                scaledSize:  new google.maps.Size(50,50)
                            }}
                            position={{ lat: device.latitude, lng: device.longitude }}
                            labelAnchor={new google.maps.Point(0, 0)}
                            labelStyle={message && {backgroundColor: "#FFF", fontSize: "12px", padding: "8px", borderRadius: '8px'}}
                        >
                            { message ? <div>{message}</div> : <div></div> }
                        </MarkerWithLabel>
                    )
                }
                return null
            })
        }
    }

    function buildDrawer() {
        if (controller.device) {
            const message = controller.device.lineNumber ? `${controller.device.lineNumber} - ${controller.device.lineDescription}` : 'Sem linha associada'
            return (
                <Drawer open={controller.open} onClose={() => setController({...controller, open: false})} anchor="top">
                    <Grid className={classes.container} container direction="column">
                        <Typography className={classes.marginVertical} variant="h4">{ controller.device.name }</Typography>
                        <Typography variant="h5">{ message }</Typography>
                        <Grid>
                            <Button onClick={() => {
                                if (controller.device.line) {
                                    props.requestDeviceById(controller.device._id, () => {
                                        toast.error('Falha ao verificar rota')
                                        setController({ device: null, filter: false, open: false })
                                    })
                                }
                            }} className={classes.marginVertical} color="primary" variant="outlined">Visualizar linha</Button>
                        </Grid>
                    </Grid>
                </Drawer>
            )
        }
    }

    return (
      <Grid className={classesLocal.contentMap} container>
        {controller.filter && (
          <Button
            onClick={() => setController({ device: null, filter: false, open: false })}
            variant="contained"
            color="primary"
            className={classesLocal.filterBtn}
          >
            Remover filtro
          </Button>
        )}
        <Maps>
          {buildMarker()}
          {buildRoute()}
          {buildPoints()}
        </Maps>
        {buildDrawer()}
      </Grid>
    );
}