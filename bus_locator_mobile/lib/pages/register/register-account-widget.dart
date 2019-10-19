import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/blocs/Application-bloc.dart';
import 'package:bus_locator_mobile/components/loading/loading-bloc.dart';
import 'package:bus_locator_mobile/components/loading/loading.dart';
import 'package:bus_locator_mobile/pages/register/register-bloc.dart';
import 'package:bus_locator_mobile/share/theme.dart';
import 'package:flutter/material.dart';
import 'package:rxdart/rxdart.dart';
import 'package:fluttertoast/fluttertoast.dart';

class RegisterAccountWidget extends StatefulWidget {
  @override
  _RegisterAccountWidgetState createState() => _RegisterAccountWidgetState();
}

class _RegisterAccountWidgetState extends State<RegisterAccountWidget> {
  RegisterBloc registerBloc;
  final LoadingBloc _loadingBloc = BlocProvider.getBloc<LoadingBloc>();
  final ApplicationBloc _applicationBloc =
      BlocProvider.getBloc<ApplicationBloc>();

  @override
  Widget build(BuildContext context) {
    return LoadingWidget(
      stream: _loadingBloc.stream,
      child: GestureDetector(
        onTap: () => FocusScope.of(context).requestFocus(FocusNode()),
        child: Scaffold(
          body: Stack(
            children: <Widget>[
              Hero(
                tag: 'login-to-register',
                child: Container(
                  color: _applicationBloc.getColor(context),
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
      ),
    );
  }

  Widget _body() {
    return LayoutBuilder(builder: (context, constraints) {
      double padding = constraints.maxHeight < 540 ? 10 : 16;
      double fontSize = constraints.maxHeight < 540 ? 25 : 36;
      return Column(
        children: <Widget>[
          SizedBox(
            height: 16,
          ),
          Align(
              alignment: Alignment.centerLeft,
              child: IconButton(
                icon: Icon(Icons.close),
                iconSize: fontSize,
                color: Colors.white,
                onPressed: Navigator.of(context).pop,
              )),
          Expanded(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Text(
                  'Cadastrar',
                  style: AppTheme.title.copyWith(fontSize: fontSize),
                ),
                SizedBox(
                  height: 16,
                ),
                _buildTextField(
                  label: 'Nome',
                  hint: 'Digíte seu nome',
                  icon: Icons.person,
                  stream: registerBloc.nameStream,
                  sink: registerBloc.nameSink,
                  key: 'name',
                  padding: EdgeInsets.all(padding)
                ),
                SizedBox(
                  height: 16,
                ),
                _buildTextField(
                    label: 'Email',
                    hint: 'Digíte seu email',
                    icon: Icons.email,
                    stream: registerBloc.emailStream,
                    sink: registerBloc.emailSink,
                    key: 'email',
                    inputType: TextInputType.emailAddress,
                    padding: EdgeInsets.all(padding)),
                SizedBox(
                  height: 16,
                ),
                _buildTextField(
                    label: 'Senha',
                    hint: 'Digíte sua senha',
                    obscureText: true,
                    icon: Icons.lock,
                    stream: registerBloc.passwordStream,
                    sink: registerBloc.passwordSink,
                    key: 'password',
                    padding: EdgeInsets.all(padding)),
                SizedBox(
                  height: 16,
                ),
                _buildTextField(
                    label: 'Confirmar',
                    hint: 'Repita sua senha',
                    obscureText: true,
                    icon: Icons.lock,
                    stream: registerBloc.confirmPasswordStream,
                    sink: registerBloc.confirmPasswordSink,
                    key: 'confirmPassword',
                    padding: EdgeInsets.all(padding)),
                SizedBox(
                  height: 16,
                ),
              ],
            ),
          ),
          _buildButton()
        ],
      );
    });
  }

  Widget _buildButton() {
    return FractionallySizedBox(
      widthFactor: 1,
      child: OutlineButton(
        child: Text('Criar conta', style: TextStyle(color: Colors.white)),
        borderSide: BorderSide(color: Colors.white),
        onPressed: () {
          _loadingBloc.showLoading(true);
          FocusScope.of(context).requestFocus(FocusNode());
          registerBloc.save(() {
            _loadingBloc.showLoading(false);
            Navigator.of(context).pop();
          }, ([String message, bool showMessage = true]) {
            _loadingBloc.showLoading(false);
            if (message != null && message.isNotEmpty) {
              Fluttertoast.showToast(
                  msg: message, toastLength: Toast.LENGTH_LONG);
            } else if (showMessage) {
              Fluttertoast.showToast(
                  msg: 'Falha ao criar conta', toastLength: Toast.LENGTH_LONG);
            }
          });
        },
      ),
    );
  }

  Widget _buildTextField(
      {String label,
      String hint,
      bool obscureText = false,
      IconData icon,
      Observable stream,
      Sink sink,
      String key,
      TextInputType inputType,
      EdgeInsetsGeometry padding}) {
    return StreamBuilder(
        stream: stream,
        builder: (context, snapshot) {
          return TextField(
            onChanged: (String value) {
              registerBloc.populate(key, value);
              sink.add(null);
            },
            decoration: InputDecoration(
                contentPadding: padding,
                errorText: snapshot.hasError ? snapshot.error.toString() : null,
                labelText: label,
                hintText: hint,
                prefixIcon: Icon(
                  icon,
                  color: Colors.white,
                ),
                labelStyle: TextStyle(color: Colors.white),
                hintStyle: TextStyle(color: Colors.white),
                enabledBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.white)),
                focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.white)),
                border: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.white)),
                errorBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.red))),
            cursorColor: Colors.white,
            style: TextStyle(color: Colors.white),
            obscureText: obscureText,
            keyboardType: inputType,
          );
        });
  }

  @override
  void initState() {
    super.initState();
    registerBloc = BlocProvider.getBloc<RegisterBloc>();
  }

  @override
  void dispose() {
    super.dispose();
    registerBloc.clear();
  }
}
