import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/blocs/Application-bloc.dart';
import 'package:bus_locator_mobile/model/news.dart';
import 'package:bus_locator_mobile/share/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_html/flutter_html.dart';

class NewsDetailsWidget extends StatelessWidget {

  final News news;
  final ApplicationBloc _applicationBloc = BlocProvider.getBloc<ApplicationBloc>();

  NewsDetailsWidget(this.news);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(leading: IconButton(
        icon: Icon(Icons.close),
        color: Colors.white,
        onPressed: Navigator.of(context).pop,
        iconSize: 36,
      ), elevation: 0, title: Text('Notícia'), centerTitle: true,),
      body: Stack(
        children: <Widget>[
          Hero(
            tag: news.id,
            child: Container(
              height: double.infinity,
              color: _applicationBloc.getColor(context),
            )
          ),
          SingleChildScrollView(child: _body(context))
        ],
      ),
    );
  }

  Widget _body(context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          SizedBox(height: 16,),
          Text(news.title, style: AppTheme.title,),
          SizedBox(height: 16,),
          Html(data: news.message, defaultTextStyle: TextStyle(color: Colors.white, fontSize: 20),)
        ],
      ),
    );
  }
}
