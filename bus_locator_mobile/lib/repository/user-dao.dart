import 'package:bus_locator_mobile/model/model-dao.dart';
import 'package:bus_locator_mobile/model/user.dart';
import 'package:bus_locator_mobile/repository/database.dart';
import 'package:sembast/sembast.dart';

class UserDAO {

  static const String UsersStoreName = 'users';
  static final UserDAO _instance = UserDAO.internal(); 

  final _userStore = intMapStoreFactory.store(UsersStoreName);
  final ServiceDatabase database = ServiceDatabase();

  UserDAO.internal();

  factory UserDAO() => _instance;

  Future insert(User user) async => _userStore.add(await database.openDatabase(), user.toMap());

  Future update(User user) async {
    final Finder finder = Finder(filter: Filter.byKey(user.id));
    await _userStore.update(await database.openDatabase(), user.toMap(), finder: finder);
  }

  Future delete(User user) async {
    final Finder finder = Finder(filter: Filter.byKey(user.id));
    await _userStore.delete(await database.openDatabase(), finder: finder);
  }

  Future<List<T>> getUsers<T extends Model>() async {
    final recordSnaphots = await _userStore.find(await database.openDatabase());
    return recordSnaphots.map((snapshot) => (T as Model).fromMap(snapshot.value));
  }

}