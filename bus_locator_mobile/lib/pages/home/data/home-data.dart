import 'package:bus_locator_mobile/model/device.dart';
import 'package:bus_locator_mobile/model/line.dart';

class CurrentInformationDevice {

  Line line;
  Device device;
  int zoom;

  CurrentInformationDevice({ this.line, this.device, this.zoom = 2 });

}