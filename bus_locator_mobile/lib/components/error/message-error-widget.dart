import 'package:flutter/material.dart';

class ErrorMessageWidget extends StatelessWidget {

  final bool showIcon;
  final Function onPressIcon;
  final String text;

  ErrorMessageWidget({ this.showIcon = false, this.onPressIcon, @required this.text })
  : assert(text != null);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Visibility(
            visible: showIcon,
            child: IconButton(
              onPressed: onPressIcon,
              icon: Icon(Icons.replay),
              iconSize: 48,
            ),
          ),
          const SizedBox(height: 16,),
          Text(text, textAlign: TextAlign.center, style: TextStyle(fontSize: 22),)
        ],
      ),
    );
  }
}
