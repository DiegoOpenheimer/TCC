import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/blocs/Application-bloc.dart';
import 'package:bus_locator_mobile/model/suggestion.dart';
import 'package:bus_locator_mobile/pages/suggestions/suggestion-bloc.dart';
import 'package:bus_locator_mobile/share/utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';


class MessagesWidget extends StatefulWidget {

  @override
  _MessagesWidgetState createState() => _MessagesWidgetState();
}

class _MessagesWidgetState extends State<MessagesWidget> {

  ApplicationBloc _applicationBloc = BlocProvider.getBloc<ApplicationBloc>();
  SuggestionBloc _suggestionBloc = BlocProvider.getBloc<SuggestionBloc>();
  TextEditingController _controller = TextEditingController();

  @override
  Widget build(BuildContext context) {
    Suggestion suggestion = _suggestionBloc.currentSuggestion;
    AppBar appBar = _applicationBloc.currentTheme == ThemeApplication.LIGHT ? AppBar(
      title: Text(suggestion.title, style: TextStyle(color: Colors.black),),
      backgroundColor: Colors.white, brightness: Brightness.light,
      iconTheme: IconThemeData(color: Colors.black),
      actions: <Widget>[_buildIconActions()],
    ) : AppBar(title: Text(suggestion.title), actions: <Widget>[_buildIconActions()],);
    return GestureDetector(
      onTap: () => FocusScope.of(context).requestFocus(FocusNode()),
      child: Scaffold(
        appBar: appBar,
        body: _body(),
      ),
    );
  }

  Widget _body() {
    return Column(
      children: <Widget>[
        StreamBuilder<Suggestion>(
          stream: _suggestionBloc.listenerSuggestion,
          initialData: _suggestionBloc.currentSuggestion,
          builder: (context, snapshot) {
            return Expanded(child: _buildList(snapshot.data),);
          }
        ),
        _buildInput()
      ],
    );
  }

  Widget _buildList(Suggestion suggestion) {
    return ListView.builder(
      reverse: true,
      itemCount: suggestion.messages.length,
      itemBuilder: (BuildContext context, int index) {
        return _buildItem(suggestion.messages[suggestion.messages.length - index - 1]);
      },
    );
  }

  Widget _buildItem(Message message) {
    bool isUser = _applicationBloc.currentUser.id == message.by.id;
    MainAxisAlignment alignment = isUser ? MainAxisAlignment.end : MainAxisAlignment.start;
    Color colorContainer = isUser ? Colors.blue : Colors.green;
    return Row(
      mainAxisAlignment: alignment,
      children: <Widget>[
        Padding(
          padding: const EdgeInsets.all(16),
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.all(Radius.circular(5)),
              color: colorContainer,
            ),
            padding: const EdgeInsets.all(16),
            constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * .7),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(message.message, style: TextStyle(color: Colors.white),),
                SizedBox(height: 8,),
                _buildInformationMessage(isUser, message)
              ],
            ),
          ),
        )
      ],
    );
  }

  Row _buildInformationMessage(bool isUser, Message message) {
    return Row(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Visibility(visible: !isUser,child: Text(message.by.name + ' - ', style: TextStyle(color: Colors.white),)),
            Text(Utils.formatterDate(message.createdAt), style: TextStyle(color: Colors.white),),
            SizedBox(width: 8,),
            Visibility(
              visible: isUser,
              child: AnimatedCrossFade(
                firstChild: GestureDetector(
                  onTap: () => _suggestionBloc.removeMessage(message),
                  child: Icon(Icons.delete, color: Colors.white,),
                ),
                secondChild: Container(
                  height: 30,
                  width: 30,
                  padding: const EdgeInsets.all(8),
                  child: FittedBox(fit: BoxFit.cover,child: CircularProgressIndicator(valueColor: AlwaysStoppedAnimation(Colors.white),)),
                ),
                duration: const Duration(milliseconds: 500),
                crossFadeState: message.isLoading ? CrossFadeState.showSecond : CrossFadeState.showFirst,
              ),
            )
          ],
        );
  }

  Widget _buildInput() {
    Color colorContainer = _applicationBloc.currentTheme == ThemeApplication.DARK ? Theme.of(context).primaryColor : Colors.white;
    return Container(
      decoration: BoxDecoration(
        boxShadow: [ BoxShadow(color: Colors.black45, offset: Offset(0, -1), blurRadius: 5, spreadRadius: 0) ],
        color: colorContainer,
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: <Widget>[
          Expanded(
            child: TextField(
              maxLength: 500,
              maxLines: null,
              keyboardType: TextInputType.multiline,
              controller: _controller,
              decoration: InputDecoration(
                hintText: 'Mensagem',
                counterText: '',
                border: InputBorder.none
              ),
            ),
          ),
          Material(
            type: MaterialType.transparency,
            child: IconButton(
              icon: Icon(Icons.send),
              onPressed: () => _suggestionBloc.addMessage(_controller.text, callbackSuccess: () {
                FocusScope.of(context).requestFocus(FocusNode());
                _controller.text = '';
              }),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildIconActions() {
    return IconButton(
      icon: Icon(Icons.refresh),
      onPressed: _suggestionBloc.updateMessages,
    );
  }
}
