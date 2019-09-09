import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/blocs/Application-bloc.dart';
import 'package:bus_locator_mobile/components/loading/loading-bloc.dart';
import 'package:bus_locator_mobile/pages/account/account-bloc.dart';
import 'package:bus_locator_mobile/pages/forgot-password/forgot-bloc.dart';
import 'package:bus_locator_mobile/pages/forgot-password/forgot-widget.dart';
import 'package:bus_locator_mobile/pages/home/home-widget.dart';
import 'package:bus_locator_mobile/pages/login/login-bloc.dart';
import 'package:bus_locator_mobile/pages/login/login-widget.dart';
import 'package:bus_locator_mobile/pages/news/news-bloc.dart';
import 'package:bus_locator_mobile/pages/news/news-details-widget.dart';
import 'package:bus_locator_mobile/pages/register/register-account-widget.dart';
import 'package:bus_locator_mobile/pages/register/register-bloc.dart';
import 'package:bus_locator_mobile/repository/user-dao.dart';
import 'package:bus_locator_mobile/services/connection-network.dart';
import 'package:bus_locator_mobile/services/http.dart';
import 'package:bus_locator_mobile/services/shared-preference.dart';
import 'package:bus_locator_mobile/share/transition.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

void main() {
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
  SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
    statusBarColor: Colors.transparent
  ));
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      blocs: [
        Bloc((i) => RegisterBloc(i.get<Http>())),
        Bloc((i) => ApplicationBloc()),
        Bloc((i) => LoadingBloc(), singleton: false),
        Bloc((i) => ForgotBloc(i.get<Http>())),
        Bloc((i) => LoginBloc(i.get<Http>(), i.get<UserDAO>(), i.get<SharedPreferenceService>()), singleton: false),
        Bloc((i) => AccountBloc(i.get<Http>()), singleton: false),
        Bloc((i) => NewsBloc(i.get<Http>()), singleton: false),
      ],
      dependencies: [
        Dependency((i) => Http()),
        Dependency((i) => ConnectionNetwork()),
        Dependency((i) => UserDAO()),
        Dependency((i) => SharedPreferenceService()),
      ],
      child: MaterialApp(
        title: 'Bus locator',
        color: Colors.white,
         routes: <String, WidgetBuilder>{
          '/': (context) => LoginWidget(),
          '/register': (context) => RegisterAccountWidget(),
          '/home': (context) => HomeAdapter()
        },
        onGenerateRoute: (RouteSettings settings) {
          if (settings.name == '/forgot') {
            return CustomSlideTransition(child: ForgotWidget());
          }
          if (settings.name == '/news-details') {
            return MaterialPageRoute(builder: (context) => NewsDetailsWidget(settings.arguments));
          }
          return null;
        },
      ),
    );
  }
}
