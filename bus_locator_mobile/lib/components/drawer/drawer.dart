import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/blocs/Application-bloc.dart';
import 'package:bus_locator_mobile/model/user.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

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
          child: SingleChildScrollView(child: _body(context, snapshot.data), physics: ClampingScrollPhysics()),
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
          currentAccountPicture: Container(
            decoration: BoxDecoration(
              image: DecorationImage(image: AssetImage('assets/logo.png')),
              boxShadow: [BoxShadow(color: Colors.black26, blurRadius: 100)]
            ),
          ),
        ),
        _options(label: 'Tela Inicial', icon: Icons.home, onPress: () => goPage(0), index: 0),
        _options(label: 'Minha conta', icon: Icons.account_circle, onPress: () => goPage(1), index: 1),
        _options(label: 'Notícias', icon: Icons.new_releases, onPress: () => goPage(2), index: 2),
        _options(label: 'Dúvidas e sugestões', icon: Icons.help, onPress: () => goPage(3), index: 3),
        Divider(color: Colors.black87,),
        _buildDarkTheme(),
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

  Widget _buildDarkTheme() {
    Color color = applicationBloc.currentTheme == ThemeApplication.DARK ? Colors.white.withOpacity(.7) : Colors.black54;
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Container(
        child: Row(
          children: <Widget>[
            Icon(Icons.color_lens, size: 28, color: color,),
            SizedBox(width: 48),
            Text('Tema escuro', style: TextStyle(fontSize: 18, color: color),),
            Spacer(),
            Checkbox(value: applicationBloc.currentTheme == ThemeApplication.LIGHT ? false : true, onChanged: (bool value) {
              if (value) {
                applicationBloc.updateTheme(ThemeApplication.DARK);
              } else {
                applicationBloc.updateTheme(ThemeApplication.LIGHT);
              }
            },)
          ],
        ),
      ),
    );
  }

  Widget _options({
    IconData icon,
    String label,
    Function onPress,
    int index
  }) {
    bool active = index == widget.pageController.page.toInt();
    Color color = applicationBloc.currentTheme == ThemeApplication.DARK ? active ? Colors.white : Colors.white.withOpacity(.7) :
    active ? Theme.of(context).primaryColor : Colors.black54;
    return Material(
      child: InkWell(
        onTap: () => onPress(),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Container(
            child: Row(
              children: <Widget>[
                Icon(icon, size: 28, color: color,),
                SizedBox(width: 48),
                Flexible(child: Text(label, style: TextStyle(fontSize: 18, color: color)))
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
        double width = MediaQuery.of(context).size.width * .7;
        double height = MediaQuery.of(context).size.height;
        return WillPopScope(
          onWillPop: () => Future.value(false),
          child: Stack(
            children: <Widget>[
              Center(
                child: Container(
                  padding: EdgeInsets.all(16),
                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.all(Radius.circular(15))),
                  width: width,
                  height: 250.0,
                  child: materialAlert(context),
                ),
              ),
              Positioned(
                left: MediaQuery.of(context).size.width/2 - 50,
                top: (height - 250) / 2 - 50,
                child: Container(
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    image: DecorationImage(image: AssetImage('assets/logo.png'), fit: BoxFit.contain, alignment: Alignment.center),
                    color: Theme.of(context).primaryColor
                  ),
                  height: 100,
                  width: 100,
                ),
              ),
            ],
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
          SizedBox(height: 40,),
          Text("Atenção", style: TextStyle(color: Colors.black, fontSize: 30),),
          SizedBox(height: 30,),
          Text('Deseja mesmo sair da aplicação?', style: TextStyle(fontSize: 18, color: Colors.black), textAlign: TextAlign.center,),
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
