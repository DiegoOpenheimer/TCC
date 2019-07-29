import React from 'react'
import { compose, withProps } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps'

export default compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCfg6PgpQycYtUFaSRl336lsM8EDPmpmfI&v=3.exp&libraries=geometry,drawing,places",
        center: { lat: -22.2295935, lng: -45.9434848 },
        loadingElement: <div style={{ width: '100%' }} />,
        containerElement: <div style={{ width: '100%' }} />,
        mapElement: <div style={{ height: `100%`, width: '100%' }} />
    }),
    withScriptjs,
    withGoogleMap
)(HandleMap)

function HandleMap(props) {

    const { children, onClick } = props
    
    return (
        <GoogleMap defaultZoom={15} onClick={ev => onClick && onClick(ev)} defaultCenter={props.center} >
            { children && children }
        </GoogleMap>
    )
}