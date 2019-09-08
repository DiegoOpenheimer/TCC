import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/blocs/Application-bloc.dart';
import 'package:bus_locator_mobile/components/drawer/drawer.dart';
import 'package:bus_locator_mobile/components/loading/loading-bloc.dart';
import 'package:bus_locator_mobile/components/loading/loading.dart';
import 'package:bus_locator_mobile/pages/account/account-bloc.dart';
import 'package:bus_locator_mobile/share/theme.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';

class AccountWidget extends StatefulWidget {

  final PageController pageController;

  AccountWidget({ this.pageController });

  @override
  _AccountWidgetState createState() => _AccountWidgetState();
}

class _AccountWidgetState extends State<AccountWidget> {

  final GlobalKey<ScaffoldState> _scaffoldState = GlobalKey();
  final LoadingBloc _loadingBloc = BlocProvider.getBloc<LoadingBloc>();
  final ApplicationBloc _applicationBloc = BlocProvider.getBloc<ApplicationBloc>();
  final AccountBloc _accountBloc = BlocProvider.getBloc<AccountBloc>();
  final TextEditingController nameController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return LoadingWidget(
      stream: _loadingBloc.stream,
      child: GestureDetector(
        onTap: () => FocusScope.of(context).requestFocus(FocusNode()),
        child: Scaffold(
          key: _scaffoldState,
          drawer: DrawerWidget(pageController: widget.pageController, scaffoldState: _scaffoldState,),
          body: Stack(
            children: <Widget>[
              Container(
                color: Colors.blue,
                height: double.infinity,
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
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        SizedBox(height: 16,),
        Align(
            alignment: Alignment.centerLeft,
            child: IconButton(icon: Icon(Icons.close), iconSize: 36, color: Colors.white, onPressed: () {
              widget.pageController.animateToPage(0, duration: Duration(milliseconds: 500), curve: Curves.fastOutSlowIn);
            },)
        ),
        Expanded(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Text('Editar', style: AppTheme.title,),
              SizedBox(height: 16,),
              _buildTextField(
                label: 'Nome',
                hint: 'Digíte seu nome',
                icon: Icons.person,
                controller: nameController,
                stream: _accountBloc.nameStream,
                onChange: _accountBloc.nameSink.add
              ),
              SizedBox(height: 16,),
              _buildTextField(
                label: 'Senha',
                hint: 'Digíte sua senha',
                obscureText: true,
                icon: Icons.lock,
                controller: passwordController,
                stream: _accountBloc.passwordStream,
                onChange: _accountBloc.passwordSink.add
              ),
              SizedBox(height: 16,),
              _buildTextField(
                label: 'Confirmar',
                hint: 'Repita sua senha',
                obscureText: true,
                icon: Icons.lock,
                controller: confirmPasswordController,
                stream: _accountBloc.confirmPasswordStream,
                onChange: _accountBloc.confirmPasswordSink.add
              ),
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
        child: Text('Editar conta', style: TextStyle(color: Colors.white)),
        borderSide: BorderSide(color: Colors.white),
        onPressed: () async {
          FocusScope.of(context).requestFocus(FocusNode());
          _loadingBloc.showLoading(true);
          try {
            await _accountBloc.save(
                nameController.text,
                passwordController.text,
                confirmPasswordController.text
            );
            Fluttertoast.showToast(msg: 'Usuário editado com sucesso', toastLength: Toast.LENGTH_LONG);
          } catch(e) {
            if (e.toString().isNotEmpty) {
              Fluttertoast.showToast(msg: e.toString(), toastLength: Toast.LENGTH_LONG);
            }
          }
          _loadingBloc.showLoading(false);
        },
      ),
    );
  }

  Widget _buildTextField({
    String label,
    String hint,
    bool obscureText = false,
    IconData icon,
    TextInputType inputType,
    TextEditingController controller,
    Stream stream,
    Function(String) onChange
  }) {
    return StreamBuilder<Object>(
      stream: stream,
      builder: (context, snapshot) {
        return TextField(
          onChanged: onChange,
          controller: controller,
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
          keyboardType: inputType,
        );
      }
    );
  }

  @override
  void initState() {
    super.initState();
    nameController.text = _applicationBloc.currentUser.name;
  }


}
