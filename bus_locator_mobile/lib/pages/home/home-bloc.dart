import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/model/device.dart';
import 'package:bus_locator_mobile/model/line.dart';
import 'package:bus_locator_mobile/services/http.dart';
import 'package:dio/dio.dart';
import 'package:flutter/cupertino.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';
import 'package:rxdart/rxdart.dart';

import 'data/home-data.dart';

class HomeBloc extends BlocBase {

  final Http http;
  final Location location = Location();
  bool loadMap = false;
  CameraPosition cameraPosition = CameraPosition(
    target: LatLng(-22.2295935, -45.9434848),
    zoom: 17,
  );

  BehaviorSubject<CurrentInformationDevice> _subjectCurrentDevice = BehaviorSubject();

  BehaviorSubject<List<Device>> _subjectDevices = BehaviorSubject();

  BehaviorSubject<List<Device>> _subjectFilterDevices = BehaviorSubject();

  PublishSubject<CameraPosition> publishSubjectLocationData = PublishSubject();

  PublishSubject<Device> publishSubjectOptions = PublishSubject();

  Observable<List<Device>> get listenerDevices => _subjectDevices.stream;

  Observable<List<Device>> get listenerFilterDevices => _subjectFilterDevices.stream;

  Observable<CurrentInformationDevice> get listenerCurrentDevice => _subjectCurrentDevice.stream;

  List<Device> get currentListDevice => _subjectDevices.value ??= List();

  List<Device> get filterListDevice => _subjectFilterDevices.value ??= List();

  CurrentInformationDevice get currentInformationDevice => _subjectCurrentDevice.value;

  Set<Marker> markers = Set();

  Set<Polyline> polylines = Set();

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

  Future<void> getLineById(Device device) async {
    try {
      Response response = await http.get('/line/${device.line}');
      CurrentInformationDevice currentInformationDevice = CurrentInformationDevice()..device = device;
      currentInformationDevice.line = Line.fromJson(response.data);
      _updateCurrentLocation(latLng: LatLng(device.latitude, device.longitude), zoom: 17);
      _subjectCurrentDevice.add(currentInformationDevice);
      markers.clear();
      markers.add(Marker(
          markerId: MarkerId(device.id),
          position: LatLng(device.latitude, device.longitude),
          infoWindow: InfoWindow(title: '${device.lineNumber} ${device.lineDescription}'),
          icon: await BitmapDescriptor.fromAssetImage(
              ImageConfiguration(size: Size(25, 25)),
              'assets/bus_icon.png'
          )
      ));
      currentInformationDevice.line.points.forEach((point) {
        markers.add(Marker(
            markerId: MarkerId(point.id),
            position: LatLng(point.lat, point.lng),
            infoWindow: InfoWindow(title: '${point.name}'),
        ));
      });
      polylines.add(Polyline(
        polylineId: PolylineId(device.id),
        points: currentInformationDevice.line.directions['routes'].map<LatLng>((route) => LatLng(route['lat'], route['lng'])).toList()
      ));
      _subjectDevices.add(currentListDevice);
    } catch(e) {
      Fluttertoast.showToast(msg: 'Houve uma falha, verifique sua conexão com a internet');
    }
  }

  void init() async {
    if (currentInformationDevice == null) {
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
  }

  Future<void> _handleLocation() async {
    LocationData currentLocation = await location.getLocation();
    cameraPosition = CameraPosition(
      target: LatLng(currentLocation.latitude, currentLocation.longitude),
      zoom: 17,
    );
    publishSubjectLocationData.add(cameraPosition);
  }

  void updateZoom(int value) {
    switch(value + currentInformationDevice.zoom) {
      case 0:
        _subjectCurrentDevice.add(currentInformationDevice..zoom += value);
        _updateCurrentLocation(zoom: 14);
        break;
      case 1:
        _subjectCurrentDevice.add(currentInformationDevice..zoom += value);
        _updateCurrentLocation(zoom: 15);
        break;
      case 2:
        _subjectCurrentDevice.add(currentInformationDevice..zoom += value);
        _updateCurrentLocation(zoom: 17);
        break;
      case 3:
        _subjectCurrentDevice.add(currentInformationDevice..zoom += value);
        _updateCurrentLocation(zoom: 19, bearing: 192.8334901395799, tilt: 59.440717697143555);
        break;
    }
  }

  void _updateCurrentLocation({ double zoom, LatLng latLng, double bearing, double tilt }) {
    cameraPosition = CameraPosition(
      target: latLng ?? cameraPosition.target,
      zoom: zoom ?? cameraPosition.zoom,
      tilt: tilt ?? 0.0,
      bearing: bearing ?? 0.0
    );
    publishSubjectLocationData.add(cameraPosition);
  }

  void removeFilter() async {
    markers.clear();
    polylines.clear();
    _subjectCurrentDevice.add(null);
    await Future.forEach(currentListDevice, (Device device) async {
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
    _updateCurrentLocation(zoom: 17);
    _subjectDevices.add(currentListDevice);
  }

  void search(String value) {
    if (value.isNotEmpty) {
      List<Device> devices = currentListDevice.where((Device device) {
        String content = '${device.lineNumber} - ${device.lineDescription}';
        return content.contains(value);
      }).toList();
      _subjectFilterDevices.add(devices);
    } else {
      _subjectFilterDevices.add([]);
    }
  }

  @override
  void dispose() {
    super.dispose();
    _subjectDevices.close();
    publishSubjectLocationData.close();
    publishSubjectOptions.close();
    _subjectCurrentDevice.close();
    _subjectFilterDevices?.close();
  }

}