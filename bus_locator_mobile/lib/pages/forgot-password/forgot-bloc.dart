import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/services/connection-network.dart';
import 'package:bus_locator_mobile/services/http.dart';
import 'package:bus_locator_mobile/share/utils.dart';
import 'package:dio/dio.dart';
import 'package:rxdart/rxdart.dart';

class ForgotBloc extends BlocBase {

  String email = '';
  Http http;

  final PublishSubject<String> _subject = PublishSubject();
  final PublishSubject<Null> _finishProcess = PublishSubject();

  Observable<String> get streamForm => _subject.stream;
  Observable<Null> get finishProcessStream => _finishProcess.stream;

  Sink<String> get sinkForm => _subject.sink;
  Sink<Null> get finishProcessSink => _finishProcess.sink;

  ForgotBloc(this.http);

  void handleEmail(String email) {
    this.email = email;
    sinkForm.add(email);
  }

  void setEmail(String email) {
    this.email = email;
  }

  void requestServerToChangePassword(Function success, Function error) async {
    if (_validate()) {
      try {
        await http.post('/user/recover-password', { 'email': email });
        success();
        _finishProcess.add(null);
      } on ErrorWithoutConnection {
        error(Constants.messageWithoutConnection);
      } on DioError catch (e) {
        if (e?.response?.statusCode == Constants.notFound) {
          error('Email não encontrado');
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

  bool _validate() {
    if (!regexEmail.hasMatch(email)) {
      _subject.addError('Email inválido');
      return false;
    }
    return true;
  }

  @override
  void dispose() {
    super.dispose();
    _subject.close();
    _finishProcess.close();
  }


}