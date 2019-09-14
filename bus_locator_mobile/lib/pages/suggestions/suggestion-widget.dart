import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/components/drawer/drawer.dart';
import 'package:bus_locator_mobile/model/suggestion.dart';
import 'package:bus_locator_mobile/pages/suggestions/suggestion-bloc.dart';
import 'package:flutter/material.dart';
import 'package:meta/meta.dart';

class SuggestionWidget extends StatefulWidget {

  final PageController pageController;

  SuggestionWidget({ @required this.pageController }) : assert(pageController != null);

  @override
  _SuggestionWidgetState createState() => _SuggestionWidgetState();
}

class _SuggestionWidgetState extends State<SuggestionWidget> {

  GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey();
  SuggestionBloc _suggestionBloc = BlocProvider.getBloc<SuggestionBloc>();

  @override
  void initState() {
    super.initState();
    _suggestionBloc.getSuggestions();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Dúvidas e sugestões'),),
      key: _scaffoldKey,
      drawer: DrawerWidget(scaffoldState: _scaffoldKey, pageController: widget.pageController,),
      body: _body()
    );
  }

  Widget _body() {
    return StreamBuilder<List<Suggestion>>(
      stream: _suggestionBloc.listener,
      builder: (BuildContext context, AsyncSnapshot<List<Suggestion>> snapshot) {
        if (snapshot.hasError) {
          return _buildMessage(snapshot.error.toString());
        }
        if (snapshot.hasData) {
          return _buildList(snapshot.data);
        }
        return Center(child: CircularProgressIndicator(valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),),);
      },
    );
  }

  Widget _buildList(List<Suggestion> suggestions) {
    if (suggestions.isNotEmpty) {
      return ListView.separated(
        itemCount: suggestions.length,
        itemBuilder: (context, index) => _buildItem(suggestions[index]),
        separatorBuilder: (context, index) => Divider(color: Colors.black54, height: 0,),
      );
    } else {
      return _buildMessage('Nenhuma sugestão ou dúvida registrada', icon: false);
    }
  }

  Widget _buildItem(Suggestion suggestion) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: <Widget>[
          Text(suggestion.title, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 28),),
        ],
      ),
    );
  }

  Widget _buildMessage(String message, { bool icon: true }) {
    return Center(
        child: Padding(
          padding: const EdgeInsets.all(8),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Visibility(
                visible: icon,
                child: IconButton(
                  icon: Icon(Icons.replay),
                  iconSize: 48,
                  onPressed: _suggestionBloc.getSuggestions,
                ),
              ),
              SizedBox(height: 16,),
              Text(message, style: TextStyle(fontSize: 22), textAlign: TextAlign.center,)
            ],
          ),
        ),
      );
  }
}