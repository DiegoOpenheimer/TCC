import 'package:bus_locator_mobile/components/drawer/drawer.dart';
import 'package:flutter/material.dart';

class NewsWidget extends StatelessWidget {

  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey();
  final PageController pageController;

  NewsWidget({ this.pageController });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      drawer: DrawerWidget(pageController: pageController, scaffoldState: _scaffoldKey,),
      appBar: AppBar(title: Text('Notícias'),),
    );
  }
}
