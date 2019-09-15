import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/components/drawer/drawer.dart';
import 'package:bus_locator_mobile/components/error/message-error-widget.dart';
import 'package:bus_locator_mobile/model/suggestion.dart';
import 'package:bus_locator_mobile/pages/suggestions/suggestion-bloc.dart';
import 'package:bus_locator_mobile/share/utils.dart';
import 'package:flutter/cupertino.dart';
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
      body: _body(),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.add),
        onPressed: () => Navigator.of(context).pushNamed('/new-suggestion'),
      ),
    );
  }

  Widget _body() {
    return StreamBuilder<List<Suggestion>>(
      stream: _suggestionBloc.listener,
      builder: (BuildContext context, AsyncSnapshot<List<Suggestion>> snapshot) {
        if (snapshot.hasError) {
          return ErrorMessageWidget(
            text: snapshot.error.toString(),
            showIcon: true,
            onPressIcon: _suggestionBloc.getSuggestions,
          );
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
      return ErrorMessageWidget(text: 'Nenhuma sugestão ou dúvida registrada',);
    }
  }

  Widget _buildItem(Suggestion suggestion) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(suggestion.title, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 28),),
            Row(
              children: <Widget>[
                Text(Utils.formatterDate(suggestion.createdAt)),
                const SizedBox(width: 16,),
                Text(suggestion.messages.length.toString() + ' mensagens'),
              ],
            )
          ],
        ),
      ),
    );
  }

}