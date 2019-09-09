import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/model/news.dart';
import 'package:bus_locator_mobile/services/connection-network.dart';
import 'package:bus_locator_mobile/services/http.dart';
import 'package:dio/dio.dart';
import 'package:rxdart/rxdart.dart';

class NewsBloc extends BlocBase {

  final BehaviorSubject<DocNews> _subject = BehaviorSubject.seeded(DocNews());
  final PublishSubject<String> _subjectMessage = PublishSubject();
  Observable<String> get listenerMessage => _subjectMessage.stream;
  Observable<DocNews> get streamDocNews => _subject.stream;
  Sink<DocNews> get sinkDocNews => _subject.sink;
  DocNews get currentValue => _subject.value;
  Http http;
  CancelToken _cancelToken;
  int limit = 10;
  int page = 1;
  bool isLoading = false;

  NewsBloc(this.http);

  Future getNews({ bool increment = false }) async {
    String messageError = 'Falha ao busca notícias, tente novamente';
    if (currentValue.total >= currentValue.page * currentValue.limit && !isLoading) {
      bool isRefreshing = increment;
      if (isRefreshing) {
        page += 1;
      } else {
        page = 1;
      }
      try {
        _cancelToken = CancelToken();
        isLoading = true;
        Response response = await http.get('/news', query: { 'limit': limit, 'page': page }, cancelToken: _cancelToken);
        if (isRefreshing) {
          DocNews responseDocs = DocNews.fromJson(response.data);
          sinkDocNews.add(currentValue
            ..docs.addAll(responseDocs.docs)
            ..page = responseDocs.page
            ..limit = responseDocs.limit
          );
        }
        else sinkDocNews.add(DocNews.fromJson(response.data));
      } on DioError catch(e) {
        if (isRefreshing) page -= 1;
        if (e.type != DioErrorType.CANCEL && currentValue.docs.isEmpty) {
          _subject.addError(messageError);
        } else if (e.type != DioErrorType.CANCEL) {
          _subjectMessage.add(messageError);
        }
      } on ErrorWithoutConnection catch(e) {
        if (isRefreshing) page -= 1;
        if (currentValue.docs.isEmpty) {
          _subject.addError(e.message);
        } else {
          _subjectMessage.add(e.message);
        }
      } catch (e) {
        if (isRefreshing) page -= 1;
        if (currentValue.docs.isEmpty) {
          _subject.addError(messageError);
        } else {
          _subjectMessage.add(messageError);
        }
      }
      isLoading = false;
    }
  }

  @override
  void dispose() {
    super.dispose();
    _cancelToken.cancel();
    _subject.close();
    _subjectMessage.close();
  }


}