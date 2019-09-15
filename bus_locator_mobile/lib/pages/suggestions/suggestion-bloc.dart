import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/blocs/Application-bloc.dart';
import 'package:bus_locator_mobile/model/author.dart';
import 'package:bus_locator_mobile/model/suggestion.dart';
import 'package:bus_locator_mobile/model/user.dart';
import 'package:bus_locator_mobile/services/connection-network.dart';
import 'package:bus_locator_mobile/services/http.dart';
import 'package:dio/dio.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:rxdart/rxdart.dart';
import 'package:rxdart/subjects.dart';

class SuggestionBloc extends BlocBase {

  Http http;
  BehaviorSubject<List<Suggestion>> _subject = BehaviorSubject();
  PublishSubject<bool> _subjectLoading = PublishSubject();
  PublishSubject<void> _createdSuggestion = PublishSubject();
  Observable<List<Suggestion>> get listener => _subject.stream;
  Observable<bool> get listenerLoading => _subjectLoading.stream;
  Observable<void> get listenerCreatedSuggestion => _createdSuggestion.stream;
  CancelToken cancelToken;
  ApplicationBloc _applicationBloc = ApplicationBloc();

  SuggestionBloc(this.http);

  Future getSuggestions() async {
    String messageError = 'Houve uma falha, verifique sua conexão e tente novamente';
    try {
      cancelToken = CancelToken();
      Response response = await http.get('/suggestion/user', cancelToken: cancelToken);
      _subject.add(response.data.map<Suggestion>((dynamic map) => Suggestion.fromMap(map)).toList());
    } on DioError catch(e) {
      if (e.type != DioErrorType.CANCEL && _subject.value != null) {
        Fluttertoast.showToast(msg: e.message);
      } else {
        _subject.addError(messageError);
      }
    } on ErrorWithoutConnection catch (e) {
      if (_subject.value != null) {
        Fluttertoast.showToast(msg: e.message);
      } else {
        _subject.addError(e.message);
      }
    } catch (e) {
      _subject.addError(messageError);
    }
  }

  void registerSuggestion(String title, String text, { Function callbackSuccess }) async {
    _subjectLoading.add(true);
    try {
      if (title.isNotEmpty && text.isNotEmpty) {
        User user = _applicationBloc.currentUser;
        Author author = Author(name: user.name, email: user.email, id: user.id);
        Message message = Message(by: author, message: text, onModel: user.entity, createdAt: DateTime.now());
        Suggestion suggestion = Suggestion(author: user.id, name: user.name, title: title, messages: [message]);
        await http.post('/suggestion', suggestion.toJson());
        Fluttertoast.showToast(msg: 'Mensagem registrada com sucesso');
        _createdSuggestion.add(null);
        if (callbackSuccess != null) {
          callbackSuccess();
        }
      } else Fluttertoast.showToast(msg: 'Preencha todos os campos');
    } on DioError catch (e) {
      if (e.type != DioErrorType.CANCEL) {
        Fluttertoast.showToast(msg: 'Não foi possível registrar a mensagem, tente novamente mais tarde');
      }
    } catch (e) {
      Fluttertoast.showToast(msg: 'Houve uma falha, verifique sua conexão');
    } finally {
      _subjectLoading.add(false);
    }
  }

  Future removeSuggestion(Suggestion suggestion) async {
    try {
        await http.delete('/suggestion', data: { 'id': suggestion.id });
        List<Suggestion> list = _subject.value;
        list.removeWhere((Suggestion sug) => sug.id == suggestion.id);
        _subject.add(list);
    } on DioError catch (e) {
      if (e.type != DioErrorType.CANCEL) {
        Fluttertoast.showToast(msg: 'Não foi possível remover, tente novamente mais tarde');
      }
    } catch (e) {
      Fluttertoast.showToast(msg: 'Houve uma falha, verifique sua conexão');
    }
  }

  void cancelRequest() {
    cancelToken?.cancel();
  }

  @override
  void dispose() {
    super.dispose();
    _subject.close();
    _subjectLoading.close();
    _createdSuggestion.close();
    cancelToken?.cancel();
  }

}