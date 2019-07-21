import React, { useEffect } from 'react'
import { Grid, Input, Divider, Button} from '@material-ui/core'
import { Send } from '@material-ui/icons'
import { withRouter } from 'react-router-dom'
import styles from './styles'

export default withRouter(function Talk(props) {
    const { suggestion } = props
    const classes = styles()
    useEffect(() => {
        if (!suggestion) {
            props.history.goBack()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function buildItems() {
        console.log(suggestion)
        if (suggestion) {
            return suggestion.messages.map((content, index) => {
                return (
                    <div key={index.toString()} className={classes.contentCard}>
                        <div className={classes.card}>
                            <div className={classes.cardMessage}>
                                <p className={classes.name}>{ content.by.name }</p>
                                <p className={classes.date}>21/07/2019</p>
                            </div>
                            <div>
                                <p>{ content.message }</p>
                            </div>
                        </div>
                    </div>
                )
            })
        }
        return null
    }

    return (
        <Grid container direction="column">
            <Grid className={classes.contentMessages} container wrap="nowrap" direction="column">
                <h1 className={classes.title}>Título</h1>
                <h2 className={classes.title}>{ suggestion.title }</h2>
                <Divider />
                <div className={classes.contentList}>
                    { buildItems() }
                </div>
                <div className={classes.contentField}>
                    <div className={classes.contentInputMessage}>
                        <Input
                            className={classes.input}
                            placeholder="Responda aqui"
                            multiline
                            maxLength="2"
                            disableUnderline={true}
                        />
                    </div>
                    <div className={classes.contentButton}>
                        <Button>
                            Enviar
                            <Send className={classes.icon} />
                        </Button>
                    </div>
                </div>

            </Grid>
        </Grid>
    )

})
