import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/model/device.dart';
import 'package:bus_locator_mobile/services/http.dart';
import 'package:dio/dio.dart';
import 'package:flutter/cupertino.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';
import 'package:rxdart/rxdart.dart';

class HomeBloc extends BlocBase {

  final Http http;
  final Location location = Location();
  bool loadMap = false;
  CameraPosition cameraPosition = CameraPosition(
    target: LatLng(-22.2295935, -45.9434848),
    zoom: 17,
  );

  BehaviorSubject<List<Device>> _subjectDevices = BehaviorSubject();

  PublishSubject<CameraPosition> publishSubjectLocationData = PublishSubject();

  PublishSubject<Device> publishSubjectOptions = PublishSubject();

  Observable<List<Device>> get listenerDevices => _subjectDevices.stream;

  List<Device> get currentListDevice => _subjectDevices.value ??= List();

  Set<Marker> markers = Set();

  HomeBloc(this.http);

  Future<void> getDevices() async {
    try {
      Response response = await http.get('/device', query: { 'all': true });
      _subjectDevices.add(await _parseData(response.data));
    } catch (e) {
      Fluttertoast.showToast(msg: 'Houve uma falha, verifique sua conexão com a internet');
    }
  }

  Future<List<Device>> _parseData(data) async {
    markers.clear();
    List<Device> devices = data.map<Device>((value) => Device.fromJson(value)).toList();
    await Future.forEach(devices, (Device device) async {
      markers.add(Marker(
        onTap: () => publishSubjectOptions.add(device),
        markerId: MarkerId(device.id),
        position: LatLng(device.latitude, device.longitude),
        infoWindow: InfoWindow(title: '${device.lineNumber} ${device.lineDescription}'),
        icon: await BitmapDescriptor.fromAssetImage(
          ImageConfiguration(size: Size(25, 25)),
          'assets/bus_icon.png'
        )
      ));
    });
    return devices;
  }

  void init() async {
    try {
      bool hasPermission = await location.hasPermission();
      if (!hasPermission) {
        hasPermission = await location.requestPermission();
        if (hasPermission) {
          loadMap = true;
          await _handleLocation();
        } else {
          loadMap = false;
        }
      } else {
        loadMap = true;
        _handleLocation();
      }
    } catch (e) { }
    finally {
      _subjectDevices.add(currentListDevice);
    }

  }

  Future<void> _handleLocation() async {
    LocationData currentLocation = await location.getLocation();
    cameraPosition = CameraPosition(
      target: LatLng(currentLocation.latitude, currentLocation.longitude),
      zoom: 17,
    );
    publishSubjectLocationData.add(cameraPosition);
  }

  @override
  void dispose() {
    super.dispose();
    _subjectDevices.close();
    publishSubjectLocationData.close();
    publishSubjectOptions.close();
  }

}