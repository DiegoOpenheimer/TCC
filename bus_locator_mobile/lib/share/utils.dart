RegExp regexEmail = new RegExp(r'''[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?''');


class Constants {

  static final String token = 'token';
  static final String messageWithoutConnection = 'Houve uma falha, Verifique sua conexão com a internet';
  static final int conflict = 409;
  static final int notFound = 404;

}