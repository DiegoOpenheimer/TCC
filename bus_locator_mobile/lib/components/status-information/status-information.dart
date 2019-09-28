import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/services/mqtt.dart';
import 'package:flutter/material.dart';

class StatusInformation extends StatefulWidget {
  @override
  _StatusInformationState createState() => _StatusInformationState();
}

class _StatusInformationState extends State<StatusInformation> with TickerProviderStateMixin {

  AnimationController _animationController;
  Animation<double> animationSize;
  AnimationController _animationControllerSuccess;
  Animation<Color> animationColor;
  MqttService _mqttService = BlocProvider.getDependency<MqttService>();

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(vsync: this, duration: const Duration(seconds: 2));
    animationSize = Tween(begin: 0.0, end: 40.0).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.elasticInOut
    ));
    _animationControllerSuccess = AnimationController(vsync: this, duration: const Duration(seconds: 1));
    animationColor = ColorTween(begin: Colors.red, end: Colors.green).animate(_animationControllerSuccess);
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<Object>(
      stream: _mqttService.listenerConnectionMqtt,
      initialData: _mqttService.isConnected,
      builder: (context, snapshot) {
        bool isConnected = _mqttService.isConnected;
        if (isConnected) {
          _animationControllerSuccess.forward();
          if (_animationController.isCompleted) {
            Future.delayed(const Duration(milliseconds: 500))
                .then((T) => _animationController.reverse());
          }
        } else {
          _animationControllerSuccess.reset();
          _animationController.forward();
        }
        return buildAnimatedBuilder();
      }
    );
  }

  AnimatedBuilder buildAnimatedBuilder() {
    return AnimatedBuilder(
    animation: _animationController,
    builder: (context, _) {
      return AnimatedBuilder(
        animation: _animationControllerSuccess,
        builder: (context, _) => SingleChildScrollView(
          child: Container(
            width: double.infinity,
            height: animationSize.value.clamp(0.0, 40.0),
            color: animationColor.value,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                buildIcon(),
                SizedBox(width: 16,),
                buildText()
              ],
            ),
          ),
        ),
      );
    }
  );
  }

  Widget buildText() {
    String message = _animationControllerSuccess.value > 0 ? 'Conectado' : 'Desconectado';
    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 500),
      child: Text(message, style: TextStyle(color: Colors.white, fontSize: 20), key: ValueKey<String>(message),),
      transitionBuilder: (child, animation) {
        return FadeTransition(
          opacity: animation,
          child: child,
        );
      },
    );
  }

  Widget buildIcon() {
    return AnimatedCrossFade(
      firstChild: Icon(Icons.mood_bad, color: Colors.white,),
      secondChild: Icon(Icons.mood, color: Colors.white,),
      duration: const Duration(milliseconds: 400),
      crossFadeState: _animationControllerSuccess.value > 0 ? CrossFadeState.showSecond : CrossFadeState.showFirst,
    );
  }
}
