

import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/model/user.dart';
import 'package:bus_locator_mobile/repository/user-dao.dart';
import 'package:bus_locator_mobile/services/shared-preference.dart';
import 'package:rxdart/rxdart.dart';

class ApplicationBloc extends BlocBase {

  static final ApplicationBloc _instance = ApplicationBloc.internal();
  SharedPreferenceService _sharedPreferenceService = SharedPreferenceService();
  UserDAO _userDAO = UserDAO();
  bool _isDrawerOpen = false;

  User currentUser = User();

  PublishSubject<User> _subjectUser = PublishSubject();

  Observable<User> get listenUser => _subjectUser.stream;

  ApplicationBloc.internal();

  factory ApplicationBloc() => _instance;

  void setUser(User user) {
    currentUser = user;
    _subjectUser.add(user);
  }

  void setIsDrawerOpen(bool value) {
    _isDrawerOpen = value;
  }

  bool get isDrawerOpen => _isDrawerOpen;

  void saveUser(User user) {
    currentUser = user;
    _subjectUser.add(user);
    _userDAO.update(user);
  }

  Future logout() async {
    await _sharedPreferenceService.clear();
    _userDAO.drop();
  }

  @override
  void dispose() {
    super.dispose();
  }
}