import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/components/loading/loading-bloc.dart';
import 'package:bus_locator_mobile/pages/forgot-password/forgot-bloc.dart';
import 'package:bus_locator_mobile/pages/forgot-password/forgot-widget.dart';
import 'package:bus_locator_mobile/pages/login/login-widget.dart';
import 'package:bus_locator_mobile/pages/register/register-account-widget.dart';
import 'package:bus_locator_mobile/pages/register/register-bloc.dart';
import 'package:bus_locator_mobile/services/connection-network.dart';
import 'package:bus_locator_mobile/services/http.dart';
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
        Bloc((i) => LoadingBloc(), singleton: false),
        Bloc((i) => ForgotBloc(i.get<Http>())),
      ],
      dependencies: [
        Dependency((i) => Http()),
        Dependency((i) => ConnectionNetwork()),
      ],
      child: MaterialApp(
        title: 'Bus locator',
        color: Colors.white,
         routes: <String, WidgetBuilder>{
          '/': (context) => LoginWidget(),
          '/register': (context) => RegisterAccountWidget(),
        },
        onGenerateRoute: (RouteSettings settings) {
          if (settings.name == '/forgot') {
            return CustomSlideTransition(child: ForgotWidget());
          }
          return null;
        },
      ),
    );
  }
}
