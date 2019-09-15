

import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/model/user.dart';
import 'package:bus_locator_mobile/repository/user-dao.dart';
import 'package:bus_locator_mobile/services/shared-preference.dart';
import 'package:flutter/material.dart';
import 'package:rxdart/rxdart.dart';

enum ThemeApplication { LIGHT, DARK }

class ApplicationBloc extends BlocBase {

  static final ApplicationBloc _instance = ApplicationBloc.internal();
  SharedPreferenceService _sharedPreferenceService = SharedPreferenceService();
  UserDAO _userDAO = UserDAO();
  bool _isDrawerOpen = false;

  User currentUser = User();

  PublishSubject<User> _subjectUser = PublishSubject();
  BehaviorSubject<ThemeApplication> _subjectTheme = BehaviorSubject();

  Observable<User> get listenUser => _subjectUser.stream;
  Observable<ThemeApplication> get listenerTheme => _subjectTheme.stream;

  ThemeApplication get currentTheme => _subjectTheme.value ??= ThemeApplication.LIGHT;

  ApplicationBloc.internal();

  factory ApplicationBloc() => _instance;

  void updateTheme(ThemeApplication theme) {
    _subjectTheme.add(theme);
    _sharedPreferenceService.setTheme(theme);
  }

  void loadTheme() async {
    ThemeApplication theme = await _sharedPreferenceService.getTheme();
    _subjectTheme.add(theme);
  }

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

  Color getColor(BuildContext context, {Color color}) {
      if (color != null) {
        return currentTheme == ThemeApplication.DARK ? Theme.of(context).primaryColor : color;
      } else {
        return currentTheme == ThemeApplication.DARK ? Theme.of(context).primaryColor : Colors.blue;
      }
  }

  @override
  void dispose() {
    super.dispose();
    _subjectUser.close();
    _subjectTheme.close();
  }
}