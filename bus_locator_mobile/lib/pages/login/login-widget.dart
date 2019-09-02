import 'package:bus_locator_mobile/pages/login/button-login.dart';
import 'package:bus_locator_mobile/share/theme.dart';
import 'package:flutter/material.dart';

class LoginWidget extends StatefulWidget {
  @override
  _LoginWidgetState createState() => _LoginWidgetState();
}

class _LoginWidgetState extends State<LoginWidget> {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => FocusScope.of(context).requestFocus(FocusNode()),
      child: Scaffold(
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
              color: Colors.blue,
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
          _buildTextField(label: 'Email', hint: 'Informe seu email', icon: Icon(Icons.email)),
          SizedBox(height: 16,),
          _buildTextField(label: 'Senha', hint: 'Informe sua senha', obscureText: true, icon: Icon(Icons.lock)),
          Align(
            alignment: Alignment.centerRight,
            child: FlatButton(child: Text('Esqueci senha'), onPressed: () => print('ok'),),
          ),
          SizedBox(height: 16,),
          ButtonLogin(),
          FlatButton(child: Text('Cadastrar'), onPressed: () => Navigator.of(context).pushNamed('/register'),)
        ],
      ),
    );
  }

  Widget _buildTextField({ String label, String hint, bool obscureText = false, Icon icon }) {
    return TextField(
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        prefixIcon: icon,
        border: OutlineInputBorder()
      ),
      obscureText: obscureText,
    );
  }
}
