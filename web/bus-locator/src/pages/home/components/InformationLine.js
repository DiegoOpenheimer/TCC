import React, { useEffect, useState } from 'react'
import { Grid, Paper, Divider, Typography, Button, IconButton } from '@material-ui/core'
import { Replay } from '@material-ui/icons'
import createStyle from '../../../style/global'
import { Doughnut } from 'react-chartjs-2'
import DialogRadio from '../../../components/dialogRadio'
import { connect } from 'react-redux'
import { requestScore } from '../../../redux/home/actions'
import { requestLines } from '../../../redux/devices/action'
import { toast } from 'react-toastify'
import Skeleton from 'react-loading-skeleton'
import Comments from './Comments'

function InformationLine(props) {

    const DEFAULT_VALUE = { _id: 'all', description: 'Todas as linhas', number: null }
    const classes = createStyle()
    const [ open, setOpenDialog ] = useState(false)
    const [ comments, setComments ] = useState({ open: false, id: '' })
    const [ value, setValueFilter ] = useState(DEFAULT_VALUE)

    useEffect(() => {
      props.requestLines()
      props.requestScore()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [  ])

    function onClose(id) {
      setOpenDialog(false)
      if (id) {
        getScore(id)
      }
    }

    function getScore(id) {
      props.requestScore(
        id || DEFAULT_VALUE._id,
        setValueFilter({ ...value, ...(props.lines.find(line => line._id === id) || DEFAULT_VALUE) }),
        () => toast.error('Falha ao fazer filtragem'))
    }

    function loadChart() {
      if (props.errorToLoadScore) {
        return (
          <IconButton onClick={() => getScore()}>
              <Replay />
          </IconButton>
        )
      } else if (props.isLoadingScore) {
        return <Skeleton height={200} width={400} />
      } else if (props.score.every(value => !value)) {
        return <Typography variant="h5">Sem registro de score</Typography>
      } else {
        return (
          <Grid container item sm={5}>
              <Doughnut
                data={{
                datasets: [{
                    data: props.score,
                    backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#56ff5e',
                    '#6756ff'
                    ]
                }],
                labels: [ '1 estrela', '2 estrelas', '3 estrelas', '4 estrelas', '5 estrelas' ]
             }}
            />
          </Grid>
        )
      }
    }
    const lines = [ DEFAULT_VALUE, ...props.lines ]
    return (
      <Grid item className={classes.container}>
        <Paper>
          <Grid
            justify="space-between"
            alignItems="center"
            container
            wrap="nowrap"
            className={classes.container}
          >
            <Typography variant="h5">Pontuação das linhas</Typography>
            <Grid>
              { (value._id !== 'all' && props.score.some(value => value)) &&
              <Button color="primary" variant="outlined" onClick={() => setComments({ open: true, id: value._id })}>Ver comentários</Button>}
              <Button onClick={() => setOpenDialog(true)}>Filtro: {value.number} - {value.description}</Button>
              <IconButton onClick={() => getScore()}>
                <Replay />
              </IconButton>
            </Grid>
          </Grid>
          <Divider />
          <Grid container justify="center" alignItems="center" style={{minHeight: 200}}>
            { loadChart() }
          </Grid>
        </Paper>
        <DialogRadio
            open={open}
            options={lines}
            title="Filtrar"
            textCancel="Cancelar"
            textConfirm="Ok"
            value={value._id}
            onClose={onClose}
        />
        <Comments
          idLine={comments.id}
          open={comments.open}
          onClose={() => setComments({ open: false, id: '' })}
        />
      </Grid>
    );
}

const mapStateToProps = state => ({
  lines: state.device.lines,
  errorToLoadLines: state.device.errorToLoadLines,
  score: state.home.score,
  isLoadingScore: state.home.isLoadingScore,
  errorToLoadScore: state.home.errorToLoadScore
})

export default connect(mapStateToProps, { requestLines, requestScore })(InformationLine)
