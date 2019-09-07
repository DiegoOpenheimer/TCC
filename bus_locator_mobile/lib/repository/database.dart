import 'package:sembast/sembast.dart';
import 'package:sembast/sembast_io.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';

class ServiceDatabase {

  static final ServiceDatabase _instance = ServiceDatabase.internal();
  static final String dbPath = 'bus-locator.db';
  DatabaseFactory databaseFactory = createDatabaseFactoryIo();

  ServiceDatabase.internal();

  factory ServiceDatabase() => _instance;

  Future openDatabase() async {
    var applicationDirectory = await getApplicationDocumentsDirectory();
    return databaseFactory.openDatabase(join(applicationDirectory.path, dbPath));
  }

}