import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/blocs/Application-bloc.dart';
import 'package:bus_locator_mobile/model/user.dart';
import 'package:flutter/material.dart';

class DrawerWidget extends StatefulWidget {

  final PageController pageController;
  final GlobalKey<ScaffoldState> scaffoldState;

  DrawerWidget({ this.pageController, this.scaffoldState });

  @override
  _DrawerWidgetState createState() => _DrawerWidgetState();
}

class _DrawerWidgetState extends State<DrawerWidget> {
  final ApplicationBloc applicationBloc = BlocProvider.getBloc<ApplicationBloc>();


  @override
  void initState() {
  super.initState();
  applicationBloc.setIsDrawerOpen(true);
  }

  @override
  Widget build(BuildContext context) {
    applicationBloc.setIsDrawerOpen(true);
    return StreamBuilder<Object>(
      stream: applicationBloc.listenUser,
      initialData: applicationBloc.currentUser,
      builder: (context, snapshot) {
        return Drawer(
          child: _body(context, snapshot.data),
        );
      }
    );
  }

  Widget _body(BuildContext context, User user) {
    return Column(
      children: <Widget>[
        UserAccountsDrawerHeader(
          accountEmail: Text(user.email),
          accountName: Text(user.name),
          currentAccountPicture: Center(child: Text('logo'),),
        ),
        _options(label: 'Tela Inicial', icon: Icons.home, onPress: () => goPage(0), index: 0),
        _options(label: 'Minha conta', icon: Icons.account_circle, onPress: () => goPage(1), index: 1),
        _options(label: 'Notícias', icon: Icons.new_releases, onPress: () => goPage(2), index: 2),
        _options(label: 'Dúvidas e sugestões', icon: Icons.help, onPress: () => goPage(3), index: 3),
        Divider(color: Colors.black87,),
        _options(label: 'Sair', icon: Icons.exit_to_app, onPress: () => logout(context))
      ],
    );
  }

  void goPage(int index) {
    widget.scaffoldState.currentState.openEndDrawer();
    if (index == widget.pageController.page.toInt() + 1) {
      widget.pageController.animateToPage(index, duration: Duration(milliseconds: 500), curve: Curves.fastOutSlowIn);
    } else {
      widget.pageController.jumpToPage(index);
    }
  }

  Widget _options({
    IconData icon,
    String label,
    Function onPress,
    int index
  }) {
    bool active = index == widget.pageController.page.toInt();
    return Material(
      child: InkWell(
        onTap: () => onPress(),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Container(
            child: Row(
              children: <Widget>[
                Icon(icon, size: 28, color: active ? Colors.blue : Colors.black54,),
                SizedBox(width: 48),
                Text(label, style: TextStyle(fontSize: 18, color: active ? Colors.blue : Colors.black87),)
              ],
            ),
          ),
        ),
      ),
    );
  }

  void logout(context) {
    showGeneralDialog(
      context: context,
      pageBuilder: (BuildContext buildContext, Animation<double> animation,
          Animation<double> secondaryAnimation) {
        return WillPopScope(
          onWillPop: () => Future.value(false),
          child: Center(
            child: Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.all(Radius.circular(15))),
              width: MediaQuery.of(context).size.width * .7,
              height: 200.0,
              child: materialAlert(context),
            ),
          ),
        );
      },
      barrierDismissible: false,
      barrierColor: Colors.black.withOpacity(0.5),
      barrierLabel: MaterialLocalizations.of(context).modalBarrierDismissLabel,
      transitionDuration: const Duration(milliseconds: 500),
      transitionBuilder: (context, animation1, animation2, widget) {
        return ScaleTransition(
          scale: Tween(begin: 0.0, end: 1.0).animate(
              CurvedAnimation(parent: animation1, curve: Curves.elasticInOut)
          ),
          child: widget,
        );
      },
    );
  }

  Material materialAlert(context) {
    return Material(
      color: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(15))),
      child: Column(
        children: <Widget>[
          Text("Atenção", style: TextStyle(color: Colors.black, fontSize: 30),),
          SizedBox(height: 30,),
          Text('Deseja mesmo remover sair da aplicação?', style: TextStyle(fontSize: 18), textAlign: TextAlign.center,),
          Expanded(
            child:  Align(
              alignment: Alignment.bottomCenter,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: <Widget>[
                  FlatButton(
                    textColor: Theme.of(context).primaryColor,
                    onPressed: () {
                      Navigator.of(context).pop();
                    },
                    child: Text('Não', style: TextStyle(fontSize: 20),),
                  ),
                  FlatButton(
                    textColor: Theme.of(context).primaryColor,
                    onPressed: () async {
                      await applicationBloc.logout();
                      Navigator.of(context).pushNamedAndRemoveUntil('/', (routes) => false);
                    },
                    child: Text('Sim', style: TextStyle(fontSize: 20)),
                  )
                ],
              ),
            ),
          )
        ],
      ),
    );
  }

  @override
  void dispose() {
    super.dispose();
    applicationBloc.setIsDrawerOpen(false);
  }
}
