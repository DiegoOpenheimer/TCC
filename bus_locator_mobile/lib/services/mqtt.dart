import 'package:mqtt_client/mqtt_client.dart';
import 'dart:math';

import 'package:rxdart/rxdart.dart';

class MqttService {

  MqttClient client;
  BehaviorSubject<bool> _subject = BehaviorSubject.seeded(false);

  Observable<bool> get listenerConnectionMqtt => _subject.stream;

  bool get isConnected => _subject.value;

  MqttService() {
    String identifier = 'bus_locator_mobile_' + Random().nextDouble().toString().substring(2, 8);
    client = MqttClient('ec2-18-228-196-51.sa-east-1.compute.amazonaws.com', identifier);
    init();
  }

  void init() {
    keepConnected();
    client
      ..onDisconnected = keepConnected
      ..keepAlivePeriod = 600;
  }

  void keepConnected() async {
    while (true) {
      try {
        MqttClientConnectionStatus status = await client.connect('TCC', 'TCC');
        print(status.state);
        if (status.state == MqttConnectionState.connected ) {
          _subject.add(true);
          break;
        } else {
          _subject.add(false);
        }
        await Future.delayed(const Duration(seconds: 3));
      } catch (e) {
        print('Error mqtt: ${e.toString()}');
        _subject.add(false);
        await Future.delayed(const Duration(seconds: 3));
      }
    }
    print('connected');
  }

  void close() {
    _subject.close();
  }

}