import 'package:flutter/material.dart';

class ButtonLogin extends StatefulWidget {
  @override
  _ButtonLoginState createState() => _ButtonLoginState();
}

class _ButtonLoginState extends State<ButtonLogin> with TickerProviderStateMixin {

  AnimationController _animationController;
  Animation _animation;


  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(vsync: this, duration: Duration(milliseconds: 500));
  }

  @override
  Widget build(BuildContext context) {
    _animation = Tween(begin: MediaQuery.of(context).size.width, end: 50.0).animate(_animationController);
    return AnimatedBuilder(
      animation: _animationController,
      builder: (context, child) {
        return GestureDetector(
            onTap: () {
              if (_animationController.isCompleted) {
                _animationController.reverse();
              } else {
                _animationController.forward();
              }
            },
            child: _buildContentAnimation()
        );
      }
    );
  }

  Widget _buildContentAnimation() {
    return Container(
      height: 50,
      decoration: BoxDecoration(
        color: Colors.blue,
        borderRadius: BorderRadius.all(Radius.circular(_animationController.value < .7 ? 10 : 25))
      ),
      alignment: Alignment.center,
      width: _animation.value,
      child: _animationController.value < .7 ?
      _addPadding(Text('Entrar', style: TextStyle(color: Colors.white, fontSize: 19),)) :
      CircularProgressIndicator(valueColor: AlwaysStoppedAnimation(Colors.white)),
    );
  }

  Widget _addPadding(Widget child) {
    return Padding(
      padding: EdgeInsets.all(16),
      child: child,
    );
  }
}