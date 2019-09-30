import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/blocs/Application-bloc.dart';
import 'package:bus_locator_mobile/model/score.dart';
import 'package:bus_locator_mobile/services/http.dart';
import 'package:dio/dio.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:rxdart/rxdart.dart';

class EvaluateBloc extends BlocBase {

  Http http;
  ApplicationBloc _applicationBloc = ApplicationBloc();
  BehaviorSubject<Score> _subject = BehaviorSubject();

  PublishSubject<bool> _subjectLoading = PublishSubject();

  Observable<Score> get listener => _subject.stream;

  Observable<bool> get listenerLoading => _subjectLoading.stream;

  Score get currentScore => _subject.value;

  EvaluateBloc(this.http);

  Future<Score> getScore(String line) async {
    _subject.add(null);
    try {
      Response response = await http.get('/line/$line/score/user');
      if (response.data != null && response.data != '') {
        _subject.add(Score.fromJson(response.data));
      } else {
        _subject.add(Score()..star = 5);
      }
      return currentScore;
    } catch (e) {
      _subject.addError('Houve uma falha, verifique sua conexão');
    }
    return null;
  }

  void executeOperation(String message, String line) {
    if (currentScore?.line != null) {
      editEvaluate(message);
    } else {
      saveEvaluate(message, line);
    }
  }

  void saveEvaluate(String message, String line) async {
    var body = {
      "user": _applicationBloc.currentUser.id,
      "line": line,
      "description": message,
      "star": currentScore.star
    };
    _subjectLoading.add(true);
    try {
      Response response = await http.post('/line/score', body);
      _subject.add(Score.fromJson(response.data));
      Fluttertoast.showToast(msg: 'Avaliação Salva com sucesso, Obrigado');
    } catch (e) {
      Fluttertoast.showToast(msg: 'Falha ao salvar avaliação, verifique sua conexão');
    } finally {
      _subjectLoading.add(false);
    }
  }

  void editEvaluate(String message) async {
    _subjectLoading.add(true);
    try {
      await http.put('/line/score', (currentScore..description = message).toJson());
      Fluttertoast.showToast(msg: 'Avaliação editada com sucesso, Obrigado');
    } catch (e) {
      Fluttertoast.showToast(msg: 'Falha ao editar avaliação, verifique sua conexão');
    } finally {
      _subjectLoading.add(false);
    }
  }

  void setStar(int value) {
    _subject.add(currentScore..star = value == 0 ? 1 : value);
  }

  @override
  void dispose() {
    super.dispose();
    _subject.close();
    _subjectLoading.close();
  }

}