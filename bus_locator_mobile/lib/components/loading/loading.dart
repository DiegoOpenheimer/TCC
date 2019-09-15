import 'package:flutter/material.dart';
import 'package:meta/meta.dart';
import 'package:rxdart/rxdart.dart';

class LoadingWidget extends StatelessWidget {

  final Widget child;
  final String message;
  final Observable stream;

  LoadingWidget({ @required this.child, @required this.stream, this.message = 'Aguarde...' })
  : assert(stream != null && child != null);

  @override
  Widget build(BuildContext context) {
    return Material(
      child: Stack(
        children: <Widget>[
          child,
          StreamBuilder<Object>(
            stream: stream,
            builder: (context, snapshot) {
              return Visibility(
                visible: snapshot.data ?? false,
                child: _body()
              );
            }
          )
        ],
      ),
    );
  }

  Widget _body() {
    return Container(
      height: double.infinity,
      color: Colors.black.withOpacity(.5),
      child: Center(
        child: FractionallySizedBox(
          widthFactor: .8,
          child: Container(
            padding: EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.all(Radius.circular(5))
            ),
            child: Row(
              children: <Widget>[
                CircularProgressIndicator(),
                Expanded(child: Text(message, style: TextStyle(fontSize: 20, color: Colors.black), textAlign: TextAlign.center,))
              ],
            ),
          ),
        ),
      ),
    );
  }
}
