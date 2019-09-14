import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/blocs/Application-bloc.dart';
import 'package:bus_locator_mobile/components/drawer/drawer.dart';
import 'package:bus_locator_mobile/pages/account/account-widget.dart';
import 'package:bus_locator_mobile/pages/news/news-widget.dart';
import 'package:bus_locator_mobile/pages/suggestions/suggestion-widget.dart';
import 'package:flutter/material.dart';

class HomeWidget extends StatefulWidget {

  final PageController pageController;

  HomeWidget({ this.pageController });

  @override
  _HomeWidgetState createState() => _HomeWidgetState();
}

class _HomeWidgetState extends State<HomeWidget> {

  final GlobalKey<ScaffoldState> _scaffoldState = GlobalKey();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldState,
      drawer: DrawerWidget(pageController: widget.pageController, scaffoldState: _scaffoldState,),
      body: Container(
        width: double.infinity,
        height: double.infinity,
        child: _body()
      ),
    );
  }

  Widget _body() {
    return Center(
      child: Text('Map'),
    );
  }
}

class HomeAdapter extends StatelessWidget {

  final PageController _pageController = PageController();
  final ApplicationBloc _applicationBloc = BlocProvider.getBloc<ApplicationBloc>();

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () {
        if (_pageController.page.toInt() != 0 && !_applicationBloc.isDrawerOpen ) {
          _pageController.jumpToPage(0);
          return Future.value(false);
        }
        return Future.value(true);
      },
      child: PageView.builder(
        controller: _pageController,
        physics: NeverScrollableScrollPhysics(),
        itemCount: 4,
        itemBuilder: (BuildContext context, int index) {
          switch(index) {
            case 0:
              return HomeWidget(pageController: _pageController,);
            case 1:
              return AccountWidget(pageController: _pageController,);
            case 2:
              return NewsWidget(pageController: _pageController,);
            case 3:
              return SuggestionWidget(pageController: _pageController,);
          }
          return null;
        },
      ),
    );
  }
}

