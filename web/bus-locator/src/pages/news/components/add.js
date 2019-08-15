import React, { useState, useEffect } from 'react'
import { Grid, TextField, Typography, Fab } from '@material-ui/core'
import createStyle from '../../../style/global'
import createLocalStyle from '../styles'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { createNews, editNews, getNewsById, clearNewsEdit } from '../../../redux/news/action'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'

const AddNews = props => {

    const classes = createStyle()
    const localClasses = createLocalStyle()
    const [ editorState, setEditorState ] = useState(EditorState.createEmpty())
    const [ title, setTitle ] = useState('')
    const { id } = props.match.params

    useEffect(() => {
        if (id) {
            props.getNewsById(id, () => toast.error('Falha na comunicação com o servidor, tente novamente'))
        }
        return () => props.clearNewsEdit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [  ])

    useEffect(() => {
        if (props.newsEdit) {
            const { message, title } = props.newsEdit
            setTitle(title)
            const blocksFromHtml = htmlToDraft(message)
            const { contentBlocks, entityMap } = blocksFromHtml
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
            setEditorState(EditorState.createWithContent(contentState))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props.newsEdit ])

    function saveNews() {
        const message = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        if (title && message) {
            const body = {
                title,
                message, 
                author: props.user._id,
            }
            const callbackSuccess = message => () => {
                toast.success(message)
                props.history.goBack()
            }
            const callbackError = message => () => toast.error(message)
            if (id) {
                body._id = id
                props.editNews(body, callbackSuccess('Notícia editada com sucesso'), callbackError('Falha ao editar notícia'))
            } else {
                props.createNews(body, callbackSuccess('Notícia registrada com sucesso'), callbackError('Falha ao registrar notícia'))
            }
        } else
            toast.info('Verifique os campos')
    }

    return(
        <Grid className={classes.container} container direction="column" wrap="nowrap">
            <Typography variant="h4">Notícia:</Typography>
            <TextField
                value={title}
                onChange={ev => setTitle(ev.target.value)}
                className={localClasses.inputRegisterNews}
                placeholder="Informe título"
                label="Título"
                inputProps={{
                    maxLength: 100
                }}
            />
            <Typography className={localClasses.textMessage} variant="h5">Mensagem:</Typography>
            <Grid style={{backgroundColor: '#FFF', minHeight: 400}}>
                <Editor editorClassName="editor" editorState={editorState} onEditorStateChange={state => setEditorState(state)} />
            </Grid>
            <Fab onClick={saveNews} variant="extended" color="primary" className={localClasses.fab}>
                <span>Salvar</span>
            </Fab>
        </Grid>
    )

}

const mapStateToProps = state => ({ newsEdit: state.news.newsEdit, user: state.home.user })

export default connect(mapStateToProps, { createNews, editNews, getNewsById, clearNewsEdit })(AddNews)