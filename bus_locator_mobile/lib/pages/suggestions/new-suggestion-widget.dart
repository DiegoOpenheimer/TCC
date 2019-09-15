import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/blocs/Application-bloc.dart';
import 'package:bus_locator_mobile/components/fab/fab-loading.dart';
import 'package:bus_locator_mobile/pages/suggestions/suggestion-bloc.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

class NewSuggestionWidget extends StatefulWidget {
  @override
  _NewSuggestionWidgetState createState() => _NewSuggestionWidgetState();
}

class _NewSuggestionWidgetState extends State<NewSuggestionWidget> {

  bool isLoading = false;
  ApplicationBloc _applicationBloc = BlocProvider.getBloc<ApplicationBloc>();
  SuggestionBloc _suggestionBloc = BlocProvider.getBloc<SuggestionBloc>();
  TextEditingController _controllerSubject = TextEditingController();
  TextEditingController _controllerMessage = TextEditingController();


  @override
  Widget build(BuildContext context) {
    AppBar appBar = _applicationBloc.currentTheme == ThemeApplication.LIGHT ? AppBar(
      title: Text('Adicionar sugestões ou dúvidas', style: TextStyle(color: Colors.black),),
      backgroundColor: Colors.white, brightness: Brightness.light,
      iconTheme: IconThemeData(color: Colors.black),
    ) : AppBar(title: Text('Adicionar sugestões ou dúvidas'));
    return GestureDetector(
      onTap: () => FocusScope.of(context).requestFocus(FocusNode()),
      child: Scaffold(
        appBar: appBar,
        floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
        floatingActionButton: buildFabLoading(),
        body: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: _body(),
          ),
        ),
      ),
    );
  }

  StreamBuilder buildFabLoading() {
    return StreamBuilder<bool>(
      stream: _suggestionBloc.listenerLoading,
      initialData: false,
      builder: (context, snapshot) {
        return FabLoading(
            loading: snapshot.data,
            onPress: _clickFab
          );
      }
    );
  }

  Widget _body() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text('Adicione aqui sua dúvida ou sugestão com o assunto, que quando possível, retornaremos a mensagem:', style: TextStyle(fontSize: 18),),
        const SizedBox(height: 16,),
        TextField(
          controller: _controllerSubject,
          maxLength: 50,
          decoration: const InputDecoration(
            contentPadding: const EdgeInsets.symmetric(vertical: 4),
              labelText: 'Assunto',
              hintMaxLines: 10,
          ),
        ),
        const SizedBox(height: 16,),
        TextField(
          controller: _controllerMessage,
          maxLines: null,
          maxLength: 500,
          decoration: const InputDecoration(
            hintMaxLines: 10,
            hintText: 'Digite aqui a sugestão ou dúvida'
          ),
        )
      ],
    );
  }

  void _clickFab() {
    _suggestionBloc.registerSuggestion(
      _controllerSubject.text,
      _controllerMessage.text,
      callbackSuccess: () => Navigator.of(context).pop()
    );
  }
}
