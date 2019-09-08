
class User {

  String id;
  String name;
  String email;
  String password;
  String entity;

  User({ this.name, this.email, this.password });

  User.fromMap(Map value) {
    id = value['_id'];
    name = value['name'];
    email = value['email'];
    password = value['password'];
    entity = value['entity'];
  }

  Map<String, dynamic> toMap() {
    return {
      '_id': id,
      'name': name,
      'email': email,
      'password': password,
      'entity': entity
    };
  }

  @override
  String toString() {
    return 'User{id: $id, name: $name, email: $email, password: $password, entity: $entity}';
  }


}