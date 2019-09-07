import 'package:bus_locator_mobile/model/model-dao.dart';

class User extends Model {

  String id;
  String name;
  String email;

  User({ this.name, this.email });

  @override
  void fromMap(Map value) {
    // TODO: implement fromMap
  }

  @override
  Map<String, dynamic> toMap() {
    // TODO: implement toMap
    return null;
  }

}