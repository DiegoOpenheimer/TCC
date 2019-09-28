import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/blocs/Application-bloc.dart';
import 'package:bus_locator_mobile/model/user.dart';
import 'package:bus_locator_mobile/services/connection-network.dart';
import 'package:bus_locator_mobile/services/http.dart';
import 'package:bus_locator_mobile/share/utils.dart';
import 'package:dio/dio.dart';
import 'package:rxdart/rxdart.dart';

class AccountBloc extends BlocBase {

  final Http http;
  ApplicationBloc _applicationBloc = ApplicationBloc();

  final PublishSubject _nameSubject = PublishSubject();
  final PublishSubject _passwordSubject = PublishSubject();
  final PublishSubject _confirmPasswordSubject = PublishSubject();

  Observable get nameStream => _nameSubject.stream;
  Observable get passwordStream => _passwordSubject.stream;
  Observable get confirmPasswordStream => _confirmPasswordSubject.stream;

  Sink get nameSink => _nameSubject.sink;
  Sink get passwordSink => _passwordSubject.sink;
  Sink get confirmPasswordSink => _confirmPasswordSubject.sink;


  AccountBloc(this.http);

  Future save(String name, String password, String confirmPassword) async {
      if (_validate(name, password, confirmPassword)) {
        try {
          User user = User(name: name, password: password)
              ..id = _applicationBloc.currentUser.id
              ..email = _applicationBloc.currentUser.email;
          await http.put('/user', user.toMap());
          _applicationBloc.saveUser(user);
        } on DioError catch(e) {
          if (e?.response?.statusCode == Constants.notAuthorized) {
            throw 'Sem permissão';
          }
          throw 'Falha ao editar conta, verifique sua conexão';
        } on ErrorWithoutConnection catch (e) {
          throw e.message;
        } catch (e) {
          throw 'Falha ao editar conta, verifique sua conexão';
        }
      } else {
        throw '';
      }
  }

  bool _validate(String name, String password, String confirmPassword) {
    bool result = true;
    if (name == null || name.trim().isEmpty) {
      result = false;
      _nameSubject.addError('Preencha campo');
    }
    if (password == null || password.trim().isEmpty) {
      result = false;
      _passwordSubject.addError('Preencha campo');
    } else if (password != confirmPassword) {
      result = false;
      _confirmPasswordSubject.addError('Senhas diferentes');
      _passwordSubject.addError('Senhas diferentes');
    }
    return result;
  }

  @override
  void dispose() {
    super.dispose();
    _nameSubject.close();
    _passwordSubject.close();
    _confirmPasswordSubject.close();
  }


}