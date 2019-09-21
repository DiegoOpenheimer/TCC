import 'package:bus_locator_mobile/components/drawer/drawer.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class HomeWidget extends StatefulWidget {

  final PageController pageController;

  HomeWidget({ this.pageController });

  @override
  _HomeWidgetState createState() => _HomeWidgetState();
}

class _HomeWidgetState extends State<HomeWidget> {

  final GlobalKey<ScaffoldState> _scaffoldState = GlobalKey();
  final CameraPosition _cameraPosition = CameraPosition(
      target: LatLng(-22.2295935, -45.9434848),
      zoom: 17,
  );
  GoogleMapController _googleMapController;

  @override
  Widget build(BuildContext context) {
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
    return GoogleMap(

      trafficEnabled: true,
      myLocationButtonEnabled: true,
      myLocationEnabled: true,
      initialCameraPosition: _cameraPosition,
      onMapCreated: (GoogleMapController googleMapController) {
        _googleMapController = googleMapController;
      },
    );
  }

  @override
  void initState() {
    super.initState();
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      statusBarIconBrightness: Brightness.dark
    ));
  }

  @override
  void dispose() {
    super.dispose();
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
        statusBarIconBrightness: Brightness.light
    ));
  }

}



