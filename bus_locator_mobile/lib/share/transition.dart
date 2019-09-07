import 'package:flutter/cupertino.dart';
import 'package:meta/meta.dart';

class CustomSlideTransition extends PageRouteBuilder {


  CustomSlideTransition({ @required Widget child }) : assert(child != null),
  super(
      transitionsBuilder: (context, animation1, animation2, child) {
        return SlideTransition(
          position: Tween(begin: Offset(1, 0), end: Offset(0, 0)).animate(animation1),
          child: FadeTransition(
            opacity: Tween(begin: 0.0, end: 1.0).animate(CurvedAnimation(
                parent: animation1,
                curve: Interval(0.5, 1)
            )),
            child: child,
          ),
        );
      },
      transitionDuration: Duration(milliseconds: 300),
      pageBuilder: (context, animation1, animation2) {
        return child;
      }
  );


}