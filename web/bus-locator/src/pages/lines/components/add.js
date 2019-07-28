import React, { useState, useRef } from 'react'
import { Grid, TextField, IconButton, InputAdornment, Paper, Button } from '@material-ui/core'
import globalStyle from '../../../style/global'
import { Clear, AddCircle, Search, Save } from '@material-ui/icons'
import clsx from 'clsx'
import Maps from '../../../components/Map'
import { DirectionsRenderer } from 'react-google-maps'
import { toast } from 'react-toastify'
import localStyles from '../styles'

export default () => {

    const classes = globalStyle()
    const styles = localStyles()
    const refDirections = useRef(null)
    const [ directions, setDirections ] = useState()
    const [ information, setInformation ] = useState({ line: '', description: '', errorLine: '', errorDescription: '' })
    const [ routes, setRoutes ] = useState([ { route: '' }, { route: '' } ])

    function buildInputRoutes() {
        return routes.map((content, index) => {
            return (
                <Grid alignItems="center" className={clsx(styles.addIconField, { [styles.iconRemove]: routes.length > 2 })} container key={index.toString()} wrap="nowrap">
                    <TextField
                        className={classes.maxWidth}
                        value={content.route}
                        onChange={ev => {
                            const value = ev.target.value
                            setRoutes(old => {
                                const newRoutes = [...old]
                                newRoutes[index].route = value
                                return newRoutes
                            })
                        }}
                        placeholder={index === 0 ? 'Informe início da rota' : index === routes.length - 1 ? "Informe destino final" : 'Informe caminho'}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={buildRoutes} edge="end">
                                        <Search />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <IconButton onClick={() => {
                        setRoutes([...routes.filter((_, i) => index !== i)])
                    }} className={styles.iconHiddenRemove}><Clear /></IconButton>
                </Grid>
            )
        })
    }

    function buildRoutes() {
        if (!routes.every(content => !!content.route)) {
            toast.error('Existe campo de rota sem preenchimento')
        } else {
            const { google } = window
            const DirectionService = new google.maps.DirectionsService()
            const options = {
                origin: routes[0].route,
                destination: routes[routes.length - 1].route,
                waypoints: routes.filter((_, index) => index !== 0 && index !== routes.length - 1).map(content => ({location: content.route, stopover: true})),
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.DRIVING,
                avoidTolls: true
            }
            DirectionService.route(options, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    setDirections({ ...directions, ...result })
                } else if (status === google.maps.DirectionsStatus.NOT_FOUND) {
                    toast.error('Rota não encontrada, verifique os caminhos inseridos')
                } else {
                    console.log('error fetching direction ', result)
                    toast.error('Falha ao requisitar rota')
                }
            })
        }
    }

    function saveLine() {
        let formOk = true
        const info = { ...information }
        if (!info.line) {
            info.errorLine = 'Campo vazio'
            formOk = false
        }
        if (!info.description) {
            info.errorDescription = 'Campo vazio'
            formOk = false
        }
        if (!formOk) {
            setInformation(info)
            return
        } else {
            if (refDirections.current) {
                console.log(refDirections.current.getDirections())
            }
        }
    }

    return (
        <Grid container className={classes.container} wrap="nowrap" direction="column">
            <Grid alignItems="center" container>
                <h2>Informação: </h2>
                <TextField
                    className={styles.inputLine}
                    value={information.line}
                    onChange={ev => setInformation({ ...information, line: ev.target.value, errorLine: '' })}
                    variant="outlined"
                    type="number"
                    label="Linha"
                    InputProps={{inputProps:{min: 0}}}
                    placeholder="Número da linha"
                    error={!!information.errorLine}
                    helperText={information.errorLine}
                />
                <TextField
                    value={information.description}
                    onChange={ev => setInformation({ ...information, description: ev.target.value, errorDescription: '' })}
                    className={styles.input}
                    variant="outlined"
                    label="Descrição"
                    placeholder="Informe a descrição"
                    error={!!information.errorDescription}
                    helperText={information.errorDescription}
                />
                <Button onClick={saveLine} variant="contained" className={styles.buttonSave} color="primary">
                    <Save />
                    <span>SALVAR</span>
                </Button>
            </Grid>
            <Grid className={styles.contentBlockMap} container>
                <Paper className={classes.maxWidth}>
                    <Grid container wrap="nowrap" className={styles.contentContainerMap}>
                        <Grid className={styles.contentFields} container>
                            { buildInputRoutes() }
                            <IconButton className={styles.addIconField} onClick={() => setRoutes([...routes, { route: '' }])}>
                                <AddCircle />
                            </IconButton>
                        </Grid>
                        <Grid className={styles.contentMap} container>
                            <Maps>
                                { directions && <DirectionsRenderer ref={refDirections} options={{draggable: true}} directions={directions} /> }
                            </Maps>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    )
}