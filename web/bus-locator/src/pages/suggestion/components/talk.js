import React, { useEffect, useState, useRef } from 'react'
import { Grid, Input, Divider, Button, IconButton} from '@material-ui/core'
import { Send, Delete } from '@material-ui/icons'
import styles from './styles'
import { withRouter } from 'react-router-dom'
import { connect, useDispatch } from 'react-redux'
import { getSuggestionById, removeMessage } from '../../../redux/suggestion/action'
import { updateLoading } from '../../../redux/components/action'
import network from '../../../services/network'
import storage from '../../../services/storage'
import { toast } from 'react-toastify'
import clsx from 'clsx'

const mapStateToProps = state => ({ suggestion: state.suggestion.suggestion, user: state.home.user, loading: state.component.loading })

export default connect(
    mapStateToProps,
    { getSuggestionById, removeMessage }
)(withRouter(function Talk(props) {

    const { suggestion } = props
    const { match: { params } } = props
    const classes = styles()
    const [ text, setText ] = useState('')
    const dispatch = useDispatch()
    const { entity } = storage.getUser()
    const listRef = useRef(null)
    useEffect(() => {
        props.getSuggestionById(params.id, () => props.history.goBack())
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(scrollBottom, [ suggestion ])
    function buildItems() {
        if (suggestion) {
            return suggestion.messages.map((content, index) => {
                return (
                    <div key={index.toString()} className={clsx(classes.contentCard, { [classes.contentRight]: props.user._id === content.by._id })}>
                        <div className={classes.card}>
                            <div className={classes.cardMessage}>
                                <p className={classes.name}>{ content.by.name }</p>
                                <div className={classes.contentTime}>
                                    <p className={classes.date}>{ new Date(content.createdAt).toLocaleString() }</p>
                                    {
                                        props.user._id === content.by._id &&
                                        <IconButton onClick={() => removeMessage(content)}>
                                            <Delete />
                                        </IconButton>
                                    }
                                </div>
                                
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

    function scrollBottom() {
        const scrollHeight = listRef.current.scrollHeight;
        const height = listRef.current.clientHeight;
        const maxScrollTop = scrollHeight - height;
        listRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }

    async function createMessage() {
        if (suggestion && entity) {
            const body = {id: suggestion._id, data: { by: props.user._id, message: text, onModel: entity }}
            dispatch(updateLoading(true))
            try {
                setText('')
                await network.patch('suggestion', body)
                props.getSuggestionById(params.id)
            } catch {
                dispatch(updateLoading(false))
                toast.error('Falha ao enviar mensagem')
            }
        }
    }

    function removeMessage(message) {
        if (!props.loading) {
            props.removeMessage(
                suggestion._id, 
                message._id,
                () => props.getSuggestionById(params.id),
                () => toast.error('Houve um erro ao remover mensagem', {autoClose: 3000})
            )
        }
    }

    return (
        <Grid container direction="column" wrap="nowrap" className={classes.contentTalk}>
            <Grid className={classes.contentMessages} container wrap="nowrap" direction="column">
                <div className={classes.contentTitle}>
                    <h2 className={classes.title}>Título: </h2>
                    { suggestion && <h3 className={classes.title}>{ suggestion.title }</h3> }
                </div>
                <Divider />
                <div ref={listRef} className={classes.contentList}>
                    { buildItems() }
                </div>
            </Grid>
            <Grid container className={classes.footer}>
                <div className={classes.contentField}>
                        <div className={classes.contentInputMessage}>
                            <Input
                                className={classes.input}
                                placeholder="Responda aqui"
                                multiline
                                maxLength="2"
                                disableUnderline={true}
                                onChange={ev => setText(ev.target.value)}
                                value={text}
                            />
                        </div>
                        <div className={classes.contentButton}>
                            <Button disabled={!text} onClick={createMessage}>
                                Enviar
                                <Send className={classes.icon} />
                            </Button>
                        </div>
                    </div>
            </Grid>
        </Grid>
    )
}))
