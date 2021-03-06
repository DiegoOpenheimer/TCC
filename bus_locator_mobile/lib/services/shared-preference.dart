import 'package:bus_locator_mobile/blocs/Application-bloc.dart';
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
    } catch(e) {
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
  
  Future<void> setTheme(ThemeApplication theme) async {
    SharedPreferences prefs = await getPreferences();
    prefs?.setString(Constants.theme, theme.toString());
  }

  Future<ThemeApplication> getTheme() async {
    SharedPreferences prefs = await getPreferences();
    String theme = prefs?.getString(Constants.theme);
    if (theme == null) {
      return ThemeApplication.LIGHT;
    }
    return ThemeApplication.values.firstWhere((value) => value.toString() == theme);
  }

  Future<bool> clear() async {
    SharedPreferences prefs = await getPreferences();
    return prefs?.remove(Constants.token);
  }
}