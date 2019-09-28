import 'package:mqtt_client/mqtt_client.dart';
import 'dart:math';

import 'package:rxdart/rxdart.dart';

class MqttModel {
  String topic;
  String message;

  MqttModel({ this.topic, this.message });

  @override
  String toString() {
    return 'MqttModel{topic: $topic, message: $message}';
  }


}

class MqttService {

  MqttClient client;
  BehaviorSubject<bool> _subject = BehaviorSubject.seeded(false);

  PublishSubject<MqttModel> _publishSubject = PublishSubject();

  Observable<bool> get listenerConnectionMqtt => _subject.stream;

  Observable<MqttModel> get listenerMessages => _publishSubject.stream;

  Map<String, bool> topics = Map();

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

  void receiveMessage() {
    client.updates.listen((List<MqttReceivedMessage<MqttMessage>> c) {
      final MqttPublishMessage recMess = c[0].payload;
      final String value = MqttPublishPayload.bytesToStringAsString(recMess.payload.message);
      _publishSubject.add(MqttModel(topic: c[0].topic, message: value));
    });
  }

  void keepConnected() async {
    while (true) {
      try {
        MqttClientConnectionStatus status = await client.connect('TCC', 'TCC');
        if (status.state == MqttConnectionState.connected ) {
          _subject.add(true);
          subscribesAgain();
          receiveMessage();
          break;
        } else {
          _subject.add(false);
          markWithFalseSubscribers();
        }
        await Future.delayed(const Duration(seconds: 3));
      } catch (e) {
        _subject.add(false);
        markWithFalseSubscribers();
        await Future.delayed(const Duration(seconds: 3));
      }
    }
  }

  void subscribe(String topic) {
    if (isConnected) {
      client.subscribe(topic, MqttQos.atMostOnce);
      topics[topic] = true;
    } else {
      topics[topic] = false;
    }
  }

  void unsubscribe(String topic) {
    topics.remove(topic);
    client.unsubscribe(topic);
  }

  void subscribesAgain() {
    topics.forEach((key, value) {
      if (!value)
        client.subscribe(key, MqttQos.atMostOnce);
    });
  }

  void markWithFalseSubscribers() {
    topics.forEach((key, value) {
      topics[key] = false;
    });
  }

  void close() {
    _subject.close();
    _publishSubject.close();
  }

}