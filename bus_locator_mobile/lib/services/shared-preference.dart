import 'package:bus_locator_mobile/share/utils.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SharedPreferenceService {


  SharedPreferenceService.internal();

  factory SharedPreferenceService() => _instance;


  static SharedPreferenceService _instance = SharedPreferenceService.internal();

  SharedPreferences _preferences;

  Future<SharedPreferences> getPreferences() async {
    try {
      if (_preferences == null) {
        _preferences = await SharedPreferences.getInstance();
        return _preferences;
      } else {
        return _preferences;
      }
    } on Exception catch(e) {
      print(e.toString());
      return null;
    }
  }

  Future<void> setToken(String token) async {
    SharedPreferences prefs = await getPreferences();
    prefs?.setString(Constants.token, token);
  }

  Future<String> getToken() async {
    SharedPreferences prefs = await getPreferences();
    return prefs?.getString(Constants.token);
  }
}