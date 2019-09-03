import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/pages/login/login-widget.dart';
import 'package:bus_locator_mobile/pages/register/register-account-widget.dart';
import 'package:bus_locator_mobile/pages/register/register-bloc.dart';
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
        Bloc((i) => RegisterBloc())
      ],
      child: MaterialApp(
        title: 'Bus locator',
        color: Colors.white,
         routes: <String, WidgetBuilder>{
          '/': (context) => LoginWidget(),
          '/register': (context) => RegisterAccountWidget()
        }
      ),
    );
  }
}
