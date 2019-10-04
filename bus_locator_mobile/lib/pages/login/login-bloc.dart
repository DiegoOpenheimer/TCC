import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/blocs/Application-bloc.dart';
import 'package:bus_locator_mobile/model/user.dart';
import 'package:bus_locator_mobile/repository/user-dao.dart';
import 'package:bus_locator_mobile/services/connection-network.dart';
import 'package:bus_locator_mobile/services/http.dart';
import 'package:bus_locator_mobile/services/shared-preference.dart';
import 'package:bus_locator_mobile/share/utils.dart';
import 'package:corsac_jwt/corsac_jwt.dart';
import 'package:dio/dio.dart';
import 'package:rxdart/rxdart.dart';

class LoginBloc extends BlocBase {

  User user = User();
  Http http;
  UserDAO userDAO;
  SharedPreferenceService sharedPreferenceService;
  ApplicationBloc applicationBloc = ApplicationBloc();

  final BehaviorSubject<bool> _subjectRequest = BehaviorSubject.seeded(false);

  Observable<bool> get listenLoading => _subjectRequest.stream;

  Sink<bool> get sinkLoading => _subjectRequest.sink;

  LoginBloc(this.http, this.userDAO, this.sharedPreferenceService);

  void verifyLogin(Function(bool) userIsLogged) async {
    String token = await sharedPreferenceService.getToken();
    applicationBloc.loadTheme();
    if (token != null) {
      userIsLogged(true);
      var jwtDecoded = JWT.parse(token);
      User userDecoded = User.fromMap(jwtDecoded.claims);
      User foundUser = await userDAO.getUser(userDecoded.id);
      applicationBloc.setUser(foundUser);
    } else {
      userIsLogged(false);
    }
  }

  void setEmail(String email) {
    user.email = email;
  }

  void setPassword(String password) {
    user.password = password;
  }

  void login(Function success, Function(String) error) async {
    if (_validate()) {
      showLoading();
      try {
        Response response = await http.post('/auth/user', user.toMap());
        var jwtDecode = JWT.parse(response.data['token']);
        User userDecoded = User.fromMap(jwtDecode.claims);
        await userDAO.insert(userDecoded);
        await sharedPreferenceService.setToken(response.data['token']);
        applicationBloc.setUser(userDecoded);
        success();
      } on ErrorWithoutConnection catch(e) {
        error(e.message);
        hideLoading();
      } on DioError catch (e) {
        if (e?.type == DioErrorType.DEFAULT) {
          error('Falha ao fazer login');
        } else if (e?.response?.statusCode == Constants.notAuthorized || e?.response?.statusCode != Constants.notFound) {
          error('Usuário e/ou senha incorretos');
        } else {
          error('Falha ao fazer login');
        }
        hideLoading();
      } catch(e) {
        error('Falha ao fazer login');
        hideLoading();
      }
    } else {
      error('Preencha os campos');
    }
  }

  void showLoading() {
    sinkLoading.add(true);
  }

  void hideLoading() {
    sinkLoading.add(false);
  }

  bool _validate() {
    if (
    user.email == null || user.email.trim().isEmpty ||
    user.password == null || user.password.trim().isEmpty) {
      return false;
    }
    return true;
  }

  @override
  void dispose() {
    super.dispose();
    _subjectRequest.close();
  }


}