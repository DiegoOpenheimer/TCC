import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/model/suggestion.dart';
import 'package:bus_locator_mobile/services/connection-network.dart';
import 'package:bus_locator_mobile/services/http.dart';
import 'package:dio/dio.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:rxdart/rxdart.dart';
import 'package:rxdart/subjects.dart';

class SuggestionBloc extends BlocBase {

  Http http;
  BehaviorSubject<List<Suggestion>> _subject = BehaviorSubject();
  Observable<List<Suggestion>> get listener => _subject.stream;
  CancelToken cancelToken;

  SuggestionBloc(this.http);

  void getSuggestions() async {
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
      print(e.toString());
      _subject.addError(messageError);
    }
  }


  @override
  void dispose() {
    super.dispose();
    _subject.close();
    cancelToken?.cancel();
  }

}