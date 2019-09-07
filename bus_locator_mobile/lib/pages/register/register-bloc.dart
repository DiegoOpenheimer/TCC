import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/services/connection-network.dart';
import 'package:bus_locator_mobile/services/http.dart';
import 'package:bus_locator_mobile/share/utils.dart';
import 'package:dio/dio.dart';
import 'package:rxdart/rxdart.dart';

class RegisterBloc extends BlocBase {

  Http http;

  final Map<String, String> body = {
    'name': '',
    'email': '',
    'password': '',
    'confirmPassword': '',
  };
  final PublishSubject _emailSubject = PublishSubject();
  final PublishSubject _nameSubject = PublishSubject();
  final PublishSubject _passwordSubject = PublishSubject();
  final PublishSubject _confirmPasswordSubject = PublishSubject();
  final PublishSubject _finishProcess = PublishSubject();

  Observable get emailStream => _emailSubject.stream;
  Observable get nameStream => _nameSubject.stream;
  Observable get passwordStream => _passwordSubject.stream;
  Observable get confirmPasswordStream => _confirmPasswordSubject.stream;
  Observable get finishProcessStream => _finishProcess.stream;

  Sink get emailSink => _emailSubject.sink;
  Sink get nameSink => _nameSubject.sink;
  Sink get passwordSink => _passwordSubject.sink;
  Sink get confirmPasswordSink => _confirmPasswordSubject.sink;
  Sink get finishProcessSink => _finishProcess.sink;

  RegisterBloc(this.http);

  void save(Function success, Function error) async {
    if (_validate()) {
      try {
        await http.post('/user', body);
        success();
        _finishProcess.add(null);
      } on ErrorWithoutConnection {
        error(Constants.messageWithoutConnection);
      } on DioError catch (e) {
        if (e.response.statusCode == Constants.conflict) {
          error('Usuário já cadastrado');
        } else {
          error();
        }
      } catch ( e ) {
        error();
      }
    } else {
      error(null, false);
    }
  }

  void populate(String key, String value) {
    body[key] = value;
  }

  bool _validate() {
    bool result = true;
    if (body['email'].trim().isEmpty) {
      _emailSubject.addError('Preencha o campo');
      result = false;
    } else if (!regexEmail.hasMatch(body['email'])) {
      _emailSubject.addError('Email inválido');
      result = false;
    }
    if (body['name'].trim().isEmpty) {
      _nameSubject.addError('Preencha o campo');
      result = false;
    }
    if (body['confirmPassword'].toString().trim().isEmpty) {
      _confirmPasswordSubject.addError('Preencha o campo');
      result = false;
    }
    if (body['password'].toString().trim().isEmpty) {
      _passwordSubject.addError('Preencha o campo');
      result = false;
    } else if (body['confirmPassword'] != body['password']) {
      _passwordSubject.addError('Senhas diferentes');
      result = false;
    }
    return result;
  }

  void clear() {
    body['name'] = '';
    body['email'] = '';
    body['password'] = '';
    body['confirmPassword'] = '';
  }

  @override
  void dispose() {
    super.dispose();
    _emailSubject.close();
    _nameSubject.close();
    _passwordSubject.close();
    _confirmPasswordSubject.close();
    _finishProcess.close();
  }

}