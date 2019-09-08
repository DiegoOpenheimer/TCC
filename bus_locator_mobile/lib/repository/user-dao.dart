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
    final Finder finder = Finder(filter: Filter.equals('_id', user.id));
    await _userStore.update(await database.openDatabase(), user.toMap(), finder: finder);
  }

  Future delete(User user) async {
    final Finder finder = Finder(filter: Filter.equals('_id', user.id));
    await _userStore.delete(await database.openDatabase(), finder: finder);
  }

  Future<User> getUser(String id) async {
    final Finder finder = Finder(filter: Filter.equals('_id', id));
    var record = await _userStore.findFirst(await database.openDatabase(), finder: finder);
    return User.fromMap(record.value);
  }

  Future<List<User>> getUsers() async {
    final recordSnapshots = await _userStore.find(await database.openDatabase());
    return recordSnapshots.map((snapshot) => User.fromMap(snapshot.value)).toList();
  }

  Future drop() async {
    return _userStore.drop(await database.openDatabase());
  }

}

