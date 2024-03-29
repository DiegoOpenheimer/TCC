import 'dart:async';

import 'package:bus_locator_mobile/share/utils.dart';
import 'package:connectivity/connectivity.dart';

typedef OnListenConnection(ConnectivityResult result);
class ErrorWithoutConnection {
  String message;

  ErrorWithoutConnection({ this.message = Constants.messageWithoutConnection });
}
class ConnectionNetwork {

  static final ConnectionNetwork _instance = ConnectionNetwork.internal();

  ConnectivityResult _connectivityResult;

  Future<ConnectivityResult> get connectivityResult async {
   if (_connectivityResult == null) {
    _connectivityResult = await _connectivity.checkConnectivity();
   }
   return _connectivityResult;
  }

  Connectivity _connectivity;

  ConnectionNetwork.internal() {
    initialize();
  }

  factory ConnectionNetwork() => _instance;

  StreamSubscription<ConnectivityResult> onListenConnection({ OnListenConnection listener }) {
    return _connectivity.onConnectivityChanged.listen(listener);
  }

  void initialize(){
    _connectivity = Connectivity();
    _connectivity.onConnectivityChanged.listen((ConnectivityResult connection) {
      _connectivityResult = connection;
    });
  }

}