import React, { useState, useRef, useEffect } from 'react'
import { Grid, TextField, IconButton, InputAdornment, Paper, Button } from '@material-ui/core'
import globalStyle from '../../../style/global'
import { Clear, AddCircle, Search, Save } from '@material-ui/icons'
import clsx from 'clsx'
import Maps from '../../../components/Map'
import { DirectionsRenderer, Marker, OverlayView } from 'react-google-maps'
import { toast } from 'react-toastify'
import localStyles from '../styles'
import DialogInput from '../../../components/dialogInput'
import { connect } from 'react-redux'
import { createLine, getLineById } from '../../../redux/lines/action'

const AddLine = props => {

    const classes = globalStyle()
    const styles = localStyles()
    const refDirections = useRef(null)
    const { id } = props.match.params
    const [ directions, setDirections ] = useState()
    const [ information, setInformation ] = useState({ line: '', description: '', errorLine: '', errorDescription: '' })
    const [ routes, setRoutes ] = useState([ { route: '' }, { route: '' } ])
    const [ markers, setMarkers ] = useState([])
    const [ dialog, setDialog ] = useState({ index: null, text: '', open: false })

    useEffect(() => {
        if (id) {
            props.getLineById(id, () => {
                toast.error('Falha ao buscar dados da linha, tente novamente')
                props.history.goBack()
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ ])

    useEffect(() => {
        if (props.line && Object.keys(props.line).length) {
            setRoutes([ ...props.line.routes ])
            setMarkers([ ...props.line.points ])
            setDirections(props.line.directions)
            setInformation({ line: props.line.number, description: props.line.description })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props.line ])

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
                    toast.error('Falha ao requisitar rota')
                }
            })
        }
    }

    function saveLine() {
        let formOk = true
        const info = { ...information }
        if (!props.loading) {
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
                    const body = {
                        number: information.line,
                        description: information.description,
                        routes,
                        directions: refDirections.current.getDirections(),
                        points: markers
                    }
                    props.createLine(body, () => {
                        toast.success('Linha cadastrada com sucesso')
                        props.history.goBack()
                    }, () => toast.error('Falha ao criar linha'))
                } else {
                    toast.info('Busque pela rota adicionada para renderizar no mapa')
                }
            }
        }
    }

    function onConfirm() {
        if (!dialog.text) {
            toast.info('Informe o nome do marcador')
        } else {
            if (dialog.index !== null) {
                setMarkers(old => {
                    const newMarkers = [...old]
                    newMarkers[dialog.index].name = dialog.text
                    return newMarkers
                })
            }
            setDialog({ ...dialog, text: '', open: false, index: null })
        }
    }

    function buildMarkers() {
        const callbackCloseOverlay = index => _ => {
            setMarkers(old => {
                const newMarkers = [...old]
                newMarkers[index].showOverlayView = !newMarkers[index].showOverlayView
                return newMarkers
            })
         }
        return markers.map((marker, index) => {
            return (
                <React.Fragment key={index.toString()}>
                    <Marker onClick={callbackCloseOverlay(index)} title={marker.name} clickable={true} draggable={true} position={{ lat: marker.lat, lng: marker.lng }} />
                    {
                        marker.showOverlayView &&
                        <OverlayView mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}  position={{ lat: marker.lat, lng: marker.lng }}>
                            <Paper className={classes.container}>
                                <Grid container direction="column">
                                    <h4>Nome do ponto: {marker.name}</h4>
                                    <Button onClick={callbackCloseOverlay(index)}>Fechar</Button>
                                    <Button onClick={() => {
                                        setDialog({ ...dialog, index, text: marker.name, open: true })
                                        callbackCloseOverlay(index)()
                                    }}>Editar</Button>
                                    <Button onClick={() => setMarkers([ ...markers.filter((_, i) => index !== i) ])}>Remover</Button>
                                </Grid>
                            </Paper>
                        </OverlayView>

                    }
                </React.Fragment>
            )
        })
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
                            <Maps onClick={({latLng}) => {
                                if (!markers.some(marker => marker.showOverlayView)) {
                                    setMarkers([ ...markers, { lat: latLng.lat(), lng: latLng.lng(), showOverlayView: false, name: '' } ])
                                    setDialog({ ...dialog, index: markers.length, open: true })
                                }
                            }}>
                                { directions && <DirectionsRenderer ref={refDirections} options={{draggable: true}} directions={directions} /> }
                                { buildMarkers() }
                            </Maps>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <DialogInput
                open={dialog.open}
                title="Atenção"
                message="Informe o nome do marcador"
                label="Nome"
                onChange={ev => setDialog({ ...dialog, text: ev.target.value })}
                onConfirm={onConfirm}
                textButton="Salvar"
                text={dialog.text}
                textCancel="Cancelar"
                onCancel={() => setDialog({ ...dialog, text: '', index: null, open: false })}
            />
        </Grid>
    )
}

const mapStateToProps = state => ({ loading: state.component.loading, line: state.line.lineEdited })

export default connect(mapStateToProps, { createLine, getLineById })(AddLine)