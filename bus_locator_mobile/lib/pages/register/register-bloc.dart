import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/share/utils.dart';
import 'package:rxdart/rxdart.dart';

class RegisterBloc implements BlocBase {

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

  void save(Function success, Function error) {
    if (_validate()) {
      success();
      _finishProcess.add(null);
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
    _emailSubject.close();
    _nameSubject.close();
    _passwordSubject.close();
    _confirmPasswordSubject.close();
    _finishProcess.close();
  }

  @override
  void addListener(listener) {
  }

  @override
  bool get hasListeners => null;

  @override
  void notifyListeners() {
  }

  @override
  void removeListener(listener) {
  }


}