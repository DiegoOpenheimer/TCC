import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/components/drawer/drawer.dart';
import 'package:bus_locator_mobile/model/news.dart';
import 'package:bus_locator_mobile/pages/news/news-bloc.dart';
import 'package:bus_locator_mobile/share/utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/widgets.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:rxdart/rxdart.dart';

class NewsWidget extends StatefulWidget {

  final PageController pageController;

  NewsWidget({ this.pageController });

  @override
  _NewsWidgetState createState() => _NewsWidgetState();
}

class _NewsWidgetState extends State<NewsWidget> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey();
  final ScrollController _scrollController = ScrollController();
  final NewsBloc _newsBloc = BlocProvider.getBloc<NewsBloc>();

  @override
  void initState() {
    super.initState();
    _newsBloc.getNews();
    _scrollController.addListener(() {
      bool isEnd = _scrollController.offset >= _scrollController.position.maxScrollExtent - 100;
      if (isEnd) {
        _newsBloc.getNews(increment: true);
      }
    });
    _newsBloc.listenerMessage.listen((String message) {
      Fluttertoast.showToast(msg: message, toastLength: Toast.LENGTH_LONG);
    });
  }


  @override
  void dispose() {
    super.dispose();
    _newsBloc?.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(title: Text('Notícias'),),
      drawer: DrawerWidget(pageController: widget.pageController, scaffoldState: _scaffoldKey,),
      body: StreamBuilder(
            stream: Observable.merge([_newsBloc.streamDocNews, _newsBloc.listenerLoading]),
            builder: (context, snapshot) {
              if (_newsBloc.isLoading) {
                return Center(child: CircularProgressIndicator(valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),));
              }
              if (_newsBloc.currentValue != null && _newsBloc.currentValue.docs.isNotEmpty) {
                return _body(_newsBloc.currentValue);
              }
              if (snapshot.hasError) {
                return Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      IconButton(
                        onPressed: _newsBloc.getNews,
                        icon: Icon(Icons.replay),
                        iconSize: 48,
                      ),
                      const SizedBox(height: 16,),
                      Text(snapshot.error.toString(), textAlign: TextAlign.center, style: TextStyle(fontSize: 22),)
                    ],
                  ),
                );
              }
              return Container();
            }
          ),
    );
  }

  Widget _body(DocNews docsNews) {
    return RefreshIndicator(
    onRefresh: () => _newsBloc.getNews(isRefresh: true),
    child: ListView.separated(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: EdgeInsets.all(0),
      controller: _scrollController,
      itemCount: docsNews.docs.length,
      itemBuilder: (context, index) {
        return _buildItem(docsNews.docs[index]);
      },
      separatorBuilder: (context, index) => Divider(color: Colors.black54, height: 0,),
    ),
      );
  }

  Widget _buildItem(News news) {
    return Hero(
      tag: news.id,
      child: Material(
        child: InkWell(
          onTap: () => Navigator.of(context).pushNamed('/news-details', arguments: news),
          child: Container(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(news.title, maxLines: 3, style: TextStyle(fontSize: 28), overflow: TextOverflow.ellipsis, ),
                SizedBox(height: 16,),
                Row(
                  children: <Widget>[
                    Flexible(child: Text(news?.author?.name, overflow: TextOverflow.ellipsis, style: TextStyle(fontStyle: FontStyle.italic),)),
                    SizedBox(width: 32,),
                    Flexible(child: Text(Utils.formatterDate(news.createdAt), overflow: TextOverflow.ellipsis,)),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
