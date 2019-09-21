import 'dart:async';
import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/blocs/Application-bloc.dart';
import 'package:bus_locator_mobile/components/drawer/drawer.dart';
import 'package:bus_locator_mobile/model/device.dart';
import 'package:bus_locator_mobile/pages/home/home-bloc.dart';
import 'package:bus_locator_mobile/share/utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class HomeWidget extends StatefulWidget {

  final PageController pageController;

  HomeWidget({ this.pageController });

  @override
  _HomeWidgetState createState() => _HomeWidgetState();
}

class _HomeWidgetState extends State<HomeWidget> with AutomaticKeepAliveClientMixin {

  final GlobalKey<ScaffoldState> _scaffoldState = GlobalKey();
  Future<GoogleMapController> get controllerGoogleMap => _completer.future;

  final HomeBloc _homeBloc = BlocProvider.getBloc<HomeBloc>();
  final ApplicationBloc _applicationBloc = BlocProvider.getBloc<ApplicationBloc>();
  Completer<GoogleMapController> _completer = Completer();
  StreamSubscription _listener;
  StreamSubscription _listenerToShowOptions;
  StreamSubscription _listenerTheme;

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return Scaffold(
      key: _scaffoldState,
      drawer: DrawerWidget(pageController: widget.pageController, scaffoldState: _scaffoldState,),
      body: Container(
        width: double.infinity,
        height: double.infinity,
        child: Stack(
          children: <Widget>[
            Container(
              height: MediaQuery.of(context).size.height,
              width: MediaQuery.of(context).size.width,
              child: _buildMap(),
            )
          ],
        )
      ),
    );
  }

  Widget _buildMap() {
    return StreamBuilder<Object>(
      stream: _homeBloc.listenerDevices,
      builder: (context, _) {
        return GoogleMap(
          markers: _homeBloc.markers,
          trafficEnabled: true,
          myLocationButtonEnabled: _homeBloc.loadMap,
          myLocationEnabled: _homeBloc.loadMap,
          initialCameraPosition: _homeBloc.cameraPosition,
          onMapCreated: _completer.complete
        );
      }
    );
  }

  @override
  void initState() {
    super.initState();
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      statusBarIconBrightness: Brightness.dark
    ));
    _homeBloc.init();
    _homeBloc.getDevices();
    _homeBloc.publishSubjectOptions.listen(showOptions);
    _listener = _homeBloc.publishSubjectLocationData.listen((CameraPosition position) async {
      GoogleMapController googleMapController = await controllerGoogleMap;
      googleMapController.animateCamera(CameraUpdate.newCameraPosition(position));
    });
    _listenerTheme = _applicationBloc.listenerTheme.listen((ThemeApplication theme) async {
      if (theme == ThemeApplication.DARK) {
        (await controllerGoogleMap).setMapStyle(Constants.mapDark);
        if (widget.pageController.page.toInt() == 0) {
          SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
              statusBarIconBrightness: Brightness.light
          ));
        }
      } else {
        (await controllerGoogleMap).setMapStyle(Constants.mapLight);
        if (widget.pageController.page.toInt() == 0) {
          SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
              statusBarIconBrightness: Brightness.dark
          ));
        }
      }
    });
  }

  void showOptions(Device device) {
    showModalBottomSheet(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.only(
          topLeft: Radius.circular(15),
          topRight: Radius.circular(15)
      )),
      context: context,
      builder: (BuildContext context) {
        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Text('${device.lineNumber} - ${device.lineDescription}', style: TextStyle(fontSize: 28),),
              SizedBox(height: 16,),
              OutlineButton.icon(
                icon: Icon(Icons.location_on),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(10))),
                onPressed: () {},
                label: Text('Acompanhar'),
              ),
              SizedBox(height: 16,),
              OutlineButton.icon(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(10))),
                icon: Icon(Icons.star),
                onPressed: () {},
                label: Text('Avaliar linha'),
              ),
            ],
          ),
        );
      }
    );
  }

  @override
  void dispose() {
    super.dispose();
    _listener?.cancel();
    _listenerToShowOptions?.cancel();
    _listenerTheme?.cancel();
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
        statusBarIconBrightness: Brightness.light
    ));
  }

  @override
  bool get wantKeepAlive => true;

}



