RegExp regexEmail = new RegExp(r'''[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?''');


class Constants {

  static const String token = 'token';
  static const String messageWithoutConnection = 'Houve uma falha, Verifique sua conexão com a internet';
  static const int conflict = 409;
  static const int notFound = 404;
  static const int notAuthorized = 401;

}