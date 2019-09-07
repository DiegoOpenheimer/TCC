import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:rxdart/rxdart.dart';

class LoadingBloc implements BlocBase {

  final BehaviorSubject<bool> _behaviorSubject = BehaviorSubject.seeded(false);

  Observable<bool> get stream => _behaviorSubject.stream;

  void showLoading(bool value) => _behaviorSubject.add(value);

  @override
  void addListener(listener) {
  }

  @override
  void dispose() {
    _behaviorSubject.close();
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