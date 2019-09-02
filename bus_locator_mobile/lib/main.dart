import 'package:bus_locator_mobile/pages/login/login-widget.dart';
import 'package:bus_locator_mobile/pages/register/register-account-widget.dart';
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Bus locator',
      color: Colors.white,
       routes: <String, WidgetBuilder>{
        '/': (context) => LoginWidget(),
        '/register': (context) => RegisterAccountWidget()
      }
    );
  }
}
