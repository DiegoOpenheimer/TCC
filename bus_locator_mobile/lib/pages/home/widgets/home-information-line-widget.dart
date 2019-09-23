import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/blocs/Application-bloc.dart';
import 'package:flutter/material.dart';

import '../home-bloc.dart';

class HomeInformationWidget extends StatefulWidget {

  final GlobalKey<ScaffoldState> scaffoldState;

  HomeInformationWidget(this.scaffoldState);

  @override
  _HomeInformationWidgetState createState() => _HomeInformationWidgetState();
}

class _HomeInformationWidgetState extends State<HomeInformationWidget> with TickerProviderStateMixin {

  final ApplicationBloc _applicationBloc = BlocProvider.getBloc<ApplicationBloc>();
  final HomeBloc _homeBloc = BlocProvider.getBloc<HomeBloc>();
  AnimationController _animationController;
  Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(vsync: this, duration: const Duration(milliseconds: 500));
    _animation = Tween(begin: 0.0, end: 1.0).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.elasticInOut
    ));
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<Object>(
      stream: _homeBloc.listenerCurrentDevice,
      builder: (context, snapshot) {
        if (_homeBloc.currentInformationDevice != null) {
          _animationController.forward();
        } else {
          _animationController.reverse();
        }
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              children: <Widget>[
                AnimatedCrossFade(
                  duration: const Duration(milliseconds: 300),
                  firstChild: buildRow(),
                  secondChild: buildFilterRemoveBtn(),
                  crossFadeState: _homeBloc.currentInformationDevice == null ? CrossFadeState.showFirst : CrossFadeState.showSecond,
                ),
                SizedBox(height: MediaQuery.of(context).size.height * .05,),
                Align(alignment: Alignment.topRight, child: buildActionButtons())
              ],
            ),
          ),
        );
      }
    );
  }

  Align buildFilterRemoveBtn() {
    return Align(
          alignment: Alignment.topCenter,
          child: RaisedButton(
            color: Colors.blue,
            padding: EdgeInsets.all(16),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(10))),
            onPressed: _homeBloc.removeFilter,
            child: Text('Remover filtro', style: TextStyle(fontSize: 16, color: Colors.white),),
          ),
        );
  }

  Widget buildRow() {
    return Padding(
      padding: const EdgeInsets.all(8),
      child: Row(
          children: <Widget>[
            IconButton(
              iconSize: 32, color: _applicationBloc.currentTheme == ThemeApplication.DARK ? Colors.white : Colors.black,
              icon: Icon(Icons.menu),
              onPressed: () => widget.scaffoldState.currentState.openDrawer(),
            ),
            SizedBox(width: 16,),
            Expanded(
              child: Container(
                alignment: Alignment.centerLeft,
                padding: EdgeInsets.only(left: 16),
                height: 40,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.all(Radius.circular(20)),
                  boxShadow: [ BoxShadow(color: Colors.black38, spreadRadius: 2, blurRadius: 10, offset: Offset(2,0)) ]
                ),
                child: TextField(
                  decoration: InputDecoration.collapsed(hintText: 'Destino ou linha', hintStyle: TextStyle(color: Colors.black54)),
                ),
              ),
            ),
            SizedBox(width: 32,)
          ],
        ),
    );
  }

  Widget buildActionButtons() {
    String zoom = _homeBloc.currentInformationDevice?.zoom?.toString();
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Transform.scale(
          scale: _animation.value.clamp(0.0, 1.0),
          child: child,
        );
      },
      child: Column(
        children: <Widget>[
          buildBtn(icon: Icons.expand_less, onPress: () => _homeBloc.updateZoom(1)),
          SizedBox(height: 8),
          Material(
            shape: CircleBorder(),
            color: Colors.white,
            elevation: 5,
            child: Container(
              height: 40,
              width: 40,
              alignment: Alignment.center,
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                transitionBuilder: (Widget child, Animation<double> animation) {
                  return ScaleTransition(child: child, scale: animation);
                },
                child: RichText(
                  key: ValueKey<String>(zoom),
                  text: TextSpan(
                    children: [
                      TextSpan(text: zoom ?? '', style: TextStyle(fontSize: 16, color: Colors.black)),
                      TextSpan(text: 'x', style: TextStyle(color: Colors.black)),
                    ]
                  ),
                ),
              ),
            ),
          ),
          SizedBox(height: 8),
          buildBtn(icon: Icons.expand_more, onPress: () => _homeBloc.updateZoom(-1)),
        ],
      ),
    );
  }

  Widget buildBtn({IconData icon, Function onPress}) {
    return Material(
      shape: CircleBorder(),
      color: Colors.white,
      elevation: 5,
      child: InkWell(
        borderRadius: BorderRadius.all(Radius.circular(20)),
        onTap: onPress,
        child: Container(
          height: 40,
          width: 40,
          alignment: Alignment.center,
          child: Icon(icon, color: Colors.black,),
        ),
      ),
    );
  }
}
