import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/blocs/Application-bloc.dart';
import 'package:bus_locator_mobile/pages/forgot-password/forgot-bloc.dart';
import 'package:bus_locator_mobile/pages/login/button-login.dart';
import 'package:bus_locator_mobile/pages/login/login-bloc.dart';
import 'package:bus_locator_mobile/pages/register/register-bloc.dart';
import 'package:bus_locator_mobile/share/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:fluttertoast/fluttertoast.dart';

class LoginWidget extends StatefulWidget {
  @override
  _LoginWidgetState createState() => _LoginWidgetState();
}

class _LoginWidgetState extends State<LoginWidget> {

  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey();
  final LoginBloc _loginBloc = BlocProvider.getBloc<LoginBloc>();
  final ApplicationBloc _applicationBloc = BlocProvider.getBloc<ApplicationBloc>();

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => FocusScope.of(context).requestFocus(FocusNode()),
      child: Scaffold(
        key: _scaffoldKey,
        body: SingleChildScrollView(child: Container(
          child: _body(),
          height: MediaQuery.of(context).size.height,
        )),
      ),
    );
  }

  Widget _body() {
    return Column(
      children: <Widget>[
        Hero(
          tag: 'login-to-register',
          child: Container(
            height: MediaQuery.of(context).size.height * .3,
            decoration: BoxDecoration(
              color: _applicationBloc.getColor(context),
              borderRadius: BorderRadius.vertical(bottom: Radius.elliptical(100, 50))
            ),
            child: Center(child: Material(color: Colors.transparent,child: Text('Bus Locator', style: AppTheme.title,))),
          ),
        ),
        Expanded(child: Center(child: _buildForm(),),)
      ],
    );
  }

  Widget _buildForm() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Text('Entrar', style: TextStyle(fontSize: 28, fontFamily: 'WorkSans'),),
          SizedBox(height: 16,),
          _buildTextField(
            label: 'Email',
            hint: 'Informe seu email',
            icon: Icon(Icons.email),
            inputType: TextInputType.emailAddress,
            onChange: _loginBloc.setEmail
          ),
          SizedBox(height: 16,),
          _buildTextField(
            label: 'Senha',
            hint: 'Informe sua senha',
            obscureText: true,
            icon: Icon(Icons.lock),
            onChange: _loginBloc.setPassword
          ),
          Align(
            alignment: Alignment.centerRight,
            child: FlatButton(child: Text('Esqueci senha'), onPressed: () => Navigator.of(context).pushNamed('/forgot'),),
          ),
          SizedBox(height: 16,),
          StreamBuilder<bool>(
            stream: _loginBloc.listenLoading,
            initialData: false,
            builder: (context, snapshot) {
              return ButtonLogin(backgroundColor: _applicationBloc.getColor(context), loading: snapshot.data, onPress: () {
                FocusScope.of(context).requestFocus(FocusNode());
                _loginBloc.login(() {
                  Navigator.of(context).pushReplacementNamed('/home');
                }, (String message) {
                  Fluttertoast.showToast(msg: message, toastLength: Toast.LENGTH_LONG);
                });
              },);
            }
          ),
          FlatButton(child: Text('Cadastrar'), onPressed: () => Navigator.of(context).pushNamed('/register'),)
        ],
      ),
    );
  }

  Widget _buildTextField({ String label, String hint, bool obscureText = false, Icon icon, TextInputType inputType, Function(String) onChange }) {
    return TextField(
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        prefixIcon: icon,
        border: OutlineInputBorder()
      ),
      obscureText: obscureText,
      keyboardType: inputType,
      onChanged: onChange,
    );
  }

  @override
  void initState() {
    _loginBloc.verifyLogin((bool value) {
      if (value) {
        Navigator.of(context).pushReplacementNamed('/home');
      }
    });
    super.initState();
    Function callback = (String message) => (T) {
      _scaffoldKey.currentState.showSnackBar(SnackBar(
        content: Text(message),
        action: SnackBarAction(
          onPressed: () => _scaffoldKey.currentState.hideCurrentSnackBar(),
          label: 'Fechar',
        ),
      ));
    };
    BlocProvider.getBloc<RegisterBloc>().finishProcessStream.listen(callback('Conta criada com sucesso, verique seu email para confirmação'));
    BlocProvider.getBloc<ForgotBloc>().finishProcessStream.listen(callback('Verique seu email para alterar senha'));
  }


}
