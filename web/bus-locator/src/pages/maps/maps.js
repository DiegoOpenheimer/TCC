import React, { useEffect, useState } from 'react'
import { Grid } from '@material-ui/core'
import Maps from '../../components/Map'
import MarkerWithLabel from 'react-google-maps/lib/components/addons/MarkerWithLabel'
import { connect } from 'react-redux'
import { requestAllDevices, updateDevices } from '../../redux/devices/action'
import BUS from '../../assets/bus.png'

const mapStateToProps = state => ({devices: state.device.devices})

export default connect(mapStateToProps, { requestAllDevices, updateDevices })(PageMaps)

function PageMaps(props) {

    const [ load, setLoad ] = useState(false)

    useEffect(() => {
        window.initMap = () => setLoad(true)
        if (load || window.google) {
            props.requestAllDevices()
        }
        return () => props.updateDevices([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ load ])

    function buildMarker() {
        const { google } = window
        if (google) {
            return props.devices.map(device => {
                const message = device.lineNumber ? `${device.lineNumber} - ${device.lineDescription}` : null
                if (device.latitude && device.longitude) {
                    return (
                        <MarkerWithLabel
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

    return(
        <Grid container>
            <Maps>
                { buildMarker() }
            </Maps>
        </Grid>
    )
}