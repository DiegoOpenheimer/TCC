import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/components/loading/loading-bloc.dart';
import 'package:bus_locator_mobile/components/loading/loading.dart';
import 'package:bus_locator_mobile/pages/forgot-password/forgot-bloc.dart';
import 'package:flutter/material.dart';

class ForgotWidget extends StatefulWidget {
  @override
  _ForgotWidgetState createState() => _ForgotWidgetState();
}

class _ForgotWidgetState extends State<ForgotWidget> {

  final ForgotBloc _forgotBloc = BlocProvider.getBloc<ForgotBloc>();
  final LoadingBloc _loadingBloc = BlocProvider.getBloc<LoadingBloc>();

  @override
  Widget build(BuildContext context) {
    return LoadingWidget(
      stream: _loadingBloc.stream,
      child: GestureDetector(
        onTap: () => FocusScope.of(context).requestFocus(FocusNode()),
        child: Scaffold(
          body: Container(
            padding: EdgeInsets.all(16),
            color: Colors.blue,
            height: double.infinity,
            child: _body()
          ),
        ),
      ),
    );
  }

  Widget _body() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        SizedBox(height: 16,),
        IconButton(
          icon: Icon(Icons.close),
          color: Colors.white,
          iconSize: 36,
          onPressed: Navigator.of(context).pop,
        ),
        SizedBox(height: 16,),
        Text('Informe seu email, para procurar sua conta', style: TextStyle(fontSize: 20, color: Colors.white),),
        SizedBox(height: 32,),
        _textField(),
        SizedBox(height: 32,),
        FractionallySizedBox(
          widthFactor: 1,
          child: OutlineButton(
            borderSide: BorderSide(color: Colors.white),
            child: Text('Enviar', style: TextStyle(fontSize: 20, color: Colors.white),),
            onPressed: () {
              _forgotBloc.save(() async {
                FocusScope.of(context).requestFocus(FocusNode());
                _loadingBloc.showLoading(true);
                await Future.delayed(Duration(seconds: 3));
                _loadingBloc.showLoading(false);
                Navigator.of(context).pop();
                _forgotBloc.finishProcessSink.add(null);
              }, print);
            },
          ),
        )
      ],
    );
  }

  Widget _textField() {
    return StreamBuilder<Object>(
      stream: _forgotBloc.streamForm,
      builder: (context, snapshot) {
        return TextField(
          onChanged: _forgotBloc.handleEmail,
          decoration: InputDecoration(
              errorText: snapshot.hasError ? snapshot.error.toString() : null,
              labelText: 'Email',
              hintText: 'Informe email',
              prefixIcon: Icon(Icons.email, color: Colors.white,),
              labelStyle: TextStyle(color: Colors.white),
              hintStyle: TextStyle(color: Colors.white),
              enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.white)),
              focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.white)),
              border: OutlineInputBorder(borderSide: BorderSide(color: Colors.white)),
              errorBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.red))
          ),
          cursorColor: Colors.white,
          style: TextStyle(color: Colors.white),
        );
      }
    );
  }

  @override
  void dispose() {
    super.dispose();
    _forgotBloc.setEmail('');
  }


}
