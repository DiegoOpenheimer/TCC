import 'dart:async';

import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/components/drawer/drawer.dart';
import 'package:bus_locator_mobile/components/error/message-error-widget.dart';
import 'package:bus_locator_mobile/components/loading/loading-bloc.dart';
import 'package:bus_locator_mobile/components/loading/loading.dart';
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
  LoadingBloc _loadingBloc = BlocProvider.getBloc<LoadingBloc>();
  StreamSubscription _listener;

  @override
  void initState() {
    super.initState();
    _suggestionBloc.getSuggestions();
    _listener = _suggestionBloc.listenerCreatedSuggestion.listen((_) {
        _suggestionBloc.getSuggestions();
    });
  }

  @override
  void dispose() {
    super.dispose();
    _listener?.cancel();
    _suggestionBloc.cancelRequest();
  }

  @override
  Widget build(BuildContext context) {
    return LoadingWidget(
      stream: _loadingBloc.stream,
      child: Scaffold(
        appBar: AppBar(title: Text('Dúvidas e sugestões'),),
        key: _scaffoldKey,
        drawer: DrawerWidget(scaffoldState: _scaffoldKey, pageController: widget.pageController,),
        body: _body(),
        floatingActionButton: FloatingActionButton(
          heroTag: 'hero-fab',
          child: Icon(Icons.add),
          onPressed: () => Navigator.of(context).pushNamed('/new-suggestion'),
        ),
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
      return RefreshIndicator(
        onRefresh: _suggestionBloc.getSuggestions,
        child: ListView.separated(
          itemCount: suggestions.length,
          itemBuilder: (context, index) => _buildItem(suggestions[index]),
          separatorBuilder: (context, index) => Divider(color: Colors.black54, height: 0,),
        ),
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
            Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: <Widget>[
                Text(suggestion.title, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 28),),
                Spacer(),
                PopupMenuButton(
                  onSelected: (value) async {
                    _loadingBloc.showLoading(true);
                    await _suggestionBloc.removeSuggestion(suggestion);
                    _loadingBloc.showLoading(false);
                  },
                  child: Icon(Icons.more_vert),
                  padding: const EdgeInsets.all(0),
                  itemBuilder: (context) => <PopupMenuEntry>[
                    const PopupMenuItem(
                      value: 'remove',
                      child: Text('Remover')
                    )
                  ],
                )
              ],
            ),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
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