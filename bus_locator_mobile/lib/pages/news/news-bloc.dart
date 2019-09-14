import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/model/news.dart';
import 'package:bus_locator_mobile/services/connection-network.dart';
import 'package:bus_locator_mobile/services/http.dart';
import 'package:dio/dio.dart';
import 'package:rxdart/rxdart.dart';

class NewsBlocModel {

  DocNews data;
  bool isLoading;
  String error;

  NewsBlocModel({ this.data, this.isLoading = false }) {
    if (data == null) {
      data = DocNews();
    }
  }

  @override
  String toString() {
    return 'NewsBlocModel{data: $data, isLoading: $isLoading, error: $error}';
  }


}

class NewsBloc extends BlocBase {

  final BehaviorSubject<NewsBlocModel> _subject = BehaviorSubject.seeded(NewsBlocModel());
  final PublishSubject<String> _subjectMessage = PublishSubject();
  Observable<String> get listenerMessage => _subjectMessage.stream;
  Observable<NewsBlocModel> get streamDocNews => _subject.stream;
  Sink<NewsBlocModel> get sinkDocNews => _subject.sink;
  NewsBlocModel get currentValue => _subject.value ??= NewsBlocModel();
  Http http;
  CancelToken _cancelToken;
  int limit = 10;
  int page = 1;

  NewsBloc(this.http);

  Future getNews({ bool increment = false, bool isRefresh = false }) async {
    String messageError = 'Falha ao buscar notícias, tente novamente';
    if ((currentValue.data.total > currentValue.data.page * currentValue.data.limit && !currentValue.isLoading) || (isRefresh && !currentValue.isLoading)) {
      if (increment) {
        page += 1;
      } else {
        page = 1;
      }
      if (isRefresh) {
        limit = 10;
        page = 1;
      }
      try {
        await _callServiceHttp(increment: increment, isRefresh: isRefresh);
      } on DioError catch(e) {
        if (increment) page -= 1;
        if (e.type != DioErrorType.CANCEL && currentValue.data.docs.isEmpty) {
          _subject.add(currentValue..error = messageError..isLoading = false);
        } else if (e.type != DioErrorType.CANCEL) {
          _hideLoading();
          _subjectMessage.add(messageError);
        }
      } on ErrorWithoutConnection catch(e) {
        if (increment) page -= 1;
        if (currentValue.data.docs.isEmpty) {
          _subject.add(currentValue..error = e.message..isLoading = false);
        } else {
          _hideLoading();
          _subjectMessage.add(e.message);
        }
      } catch (e) {
        if (increment) page -= 1;
        if (currentValue.data.docs.isEmpty) {
          _subject.add(currentValue..error = messageError..isLoading = false);
        } else {
          _hideLoading();
          _subjectMessage.add(messageError);
        }
      }
    }
  }

  void _hideLoading() {
    if (currentValue.isLoading) {
      _subject.add(currentValue..isLoading = false);
    }
  }

  Future _callServiceHttp({ bool increment = false, bool isRefresh = false }) async {
      NewsBlocModel model = currentValue;
      _cancelToken = CancelToken();
      if (!isRefresh) _subject.add(model..isLoading = true..error = null);
      Response response = await http.get('/news', query: { 'limit': limit, 'page': page }, cancelToken: _cancelToken);
      if (increment) {
        DocNews responseDocs = DocNews.fromJson(response.data);
        model.data
        ..docs.addAll(responseDocs.docs)
        ..page = responseDocs.page
        ..limit = responseDocs.limit;
        sinkDocNews.add(model..isLoading = false);
      }
      else sinkDocNews.add(NewsBlocModel(data: DocNews.fromJson(response.data)));
  }

  @override
  void dispose() {
    super.dispose();
    _cancelToken.cancel();
    _subject.close();
    _subjectMessage.close();
  }


}