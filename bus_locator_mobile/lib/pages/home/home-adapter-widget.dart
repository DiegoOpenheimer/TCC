import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/blocs/Application-bloc.dart';
import 'package:bus_locator_mobile/pages/account/account-widget.dart';
import 'package:bus_locator_mobile/pages/news/news-widget.dart';
import 'package:bus_locator_mobile/pages/suggestions/suggestion-widget.dart';
import 'package:flutter/material.dart';

import 'home-widget.dart';

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