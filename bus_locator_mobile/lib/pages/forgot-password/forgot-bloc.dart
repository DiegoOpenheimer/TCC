import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/share/utils.dart';
import 'package:rxdart/rxdart.dart';

class ForgotBloc implements BlocBase {

  String email = '';

  final PublishSubject<String> _subject = PublishSubject();
  final PublishSubject<Null> _finishProcess = PublishSubject();

  Observable<String> get streamForm => _subject.stream;
  Observable<Null> get finishProcessStream => _finishProcess.stream;

  Sink<String> get sinkForm => _subject.sink;
  Sink<Null> get finishProcessSink => _finishProcess.sink;

  void handleEmail(String email) {
    this.email = email;
    sinkForm.add(email);
  }

  void setEmail(String email) {
    this.email = email;
  }

  void save(Function success, Function error) {
    if (validate()) {
      success();
    }
  }

  bool validate() {
    if (!regexEmail.hasMatch(email)) {
      _subject.addError('Email inválido');
      return false;
    }
    return true;
  }

  @override
  void addListener(listener) {
  }

  @override
  void dispose() {
    _subject.close();
    _finishProcess.close();
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