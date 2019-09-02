import 'package:bus_locator_mobile/share/theme.dart';
import 'package:flutter/material.dart';

class RegisterAccountWidget extends StatefulWidget {
  @override
  _RegisterAccountWidgetState createState() => _RegisterAccountWidgetState();
}

class _RegisterAccountWidgetState extends State<RegisterAccountWidget> {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => FocusScope.of(context).requestFocus(FocusNode()),
      child: Scaffold(
        body: Stack(
          children: <Widget>[
            Hero(
              tag: 'login-to-register',
              child: Container(
                color: Colors.blue,
                height: double.infinity,
              ),
            ),
            SingleChildScrollView(
              child: Container(
                padding: EdgeInsets.all(16),
                height: MediaQuery.of(context).size.height,
                child: _body(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _body() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        Expanded(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Text('Cadastrar', style: AppTheme.title,),
              SizedBox(height: 16,),
              _buildTextField(label: 'Nome', hint: 'Digíte seu nome', icon: Icons.person),
              SizedBox(height: 16,),
              _buildTextField(label: 'Email', hint: 'Digíte seu email', icon: Icons.email),
              SizedBox(height: 16,),
              _buildTextField(label: 'Senha', hint: 'Digíte sua senha', icon: Icons.lock),
              SizedBox(height: 16,),
              _buildTextField(label: 'Confirmar', hint: 'Repita sua senha', icon: Icons.lock),
              SizedBox(height: 16,),
            ],
          ),
        ),
        _buildButton()
     ],
    );
  }

  Widget _buildButton() {
    return FractionallySizedBox(
      widthFactor: 1,
      child: OutlineButton(
        child: Text('Criar conta', style: TextStyle(color: Colors.white)),
        borderSide: BorderSide(color: Colors.white),
        onPressed: () => print('ok'),
      ),
    );
  }

  Widget _buildTextField({ String label, String hint, bool obscureText = false, IconData icon }) {
    return TextField(
      decoration: InputDecoration(
          labelText: label,
          hintText: hint,
          prefixIcon: Icon(icon, color: Colors.white,),
          labelStyle: TextStyle(color: Colors.white),
          hintStyle: TextStyle(color: Colors.white),
          enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.white)),
          focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.white)),
          border: OutlineInputBorder(borderSide: BorderSide(color: Colors.white))
      ),
      cursorColor: Colors.white,
      style: TextStyle(color: Colors.white),
      obscureText: obscureText,
    );
  }
}
