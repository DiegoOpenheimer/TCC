import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/pages/register/register-bloc.dart';
import 'package:bus_locator_mobile/share/theme.dart';
import 'package:flutter/material.dart';
import 'package:rxdart/rxdart.dart';

class RegisterAccountWidget extends StatefulWidget {
  @override
  _RegisterAccountWidgetState createState() => _RegisterAccountWidgetState();
}

class _RegisterAccountWidgetState extends State<RegisterAccountWidget> {

  RegisterBloc registerBloc;

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
        SizedBox(height: 16,),
        Align(
          alignment: Alignment.centerLeft,
          child: IconButton(icon: Icon(Icons.close), iconSize: 36, color: Colors.white, onPressed: Navigator.of(context).pop,)
        ),
        Expanded(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Text('Cadastrar', style: AppTheme.title,),
              SizedBox(height: 16,),
              _buildTextField(label: 'Nome', hint: 'Digíte seu nome', icon: Icons.person, stream: registerBloc.nameStream, sink: registerBloc.nameSink, key: 'name'),
              SizedBox(height: 16,),
              _buildTextField(label: 'Email', hint: 'Digíte seu email', icon: Icons.email, stream: registerBloc.emailStream, sink: registerBloc.emailSink, key: 'email'),
              SizedBox(height: 16,),
              _buildTextField(label: 'Senha', hint: 'Digíte sua senha', obscureText: true, icon: Icons.lock, stream: registerBloc.passwordStream, sink: registerBloc.passwordSink, key: 'password'),
              SizedBox(height: 16,),
              _buildTextField(label: 'Confirmar', hint: 'Repita sua senha', obscureText: true, icon: Icons.lock, stream: registerBloc.confirmPasswordStream, sink: registerBloc.confirmPasswordSink, key: 'confirmPassword'),
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
        onPressed: () => registerBloc.save(
            () {
              Navigator.of(context).pop();
             },
            () => print('ok')
        ),
      ),
    );
  }

  Widget _buildTextField({ String label, String hint, bool obscureText = false, IconData icon, Observable stream, Sink sink, String key }) {
    return StreamBuilder(
      stream: stream,
      builder: (context, snapshot) {
        return TextField(
          onChanged: (String value) {
            registerBloc.populate(key, value);
            sink.add(null);
          },
          decoration: InputDecoration(
              errorText: snapshot.hasError ? snapshot.error.toString() : null,
              labelText: label,
              hintText: hint,
              prefixIcon: Icon(icon, color: Colors.white,),
              labelStyle: TextStyle(color: Colors.white),
              hintStyle: TextStyle(color: Colors.white),
              enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.white)),
              focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.white)),
              border: OutlineInputBorder(borderSide: BorderSide(color: Colors.white)),
              errorBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.red))
          ),
          cursorColor: Colors.white,
          style: TextStyle(color: Colors.white),
          obscureText: obscureText,
        );
      }
    );
  }

  @override
  void initState() {
    super.initState();
    registerBloc = BlocProvider.getBloc<RegisterBloc>();
  }

}
