import 'package:bus_locator_mobile/model/author.dart';

class Suggestion {

  String id;
  String author;
  String title;
  String name;
  DateTime createdAt;
  List<Message> messages = const [];

  Suggestion({
    this.id,
    this.author,
    this.title,
    this.name,
    this.createdAt,
    this.messages = const []
  });

  Suggestion.fromMap(map) {
    id = map['_id'];
    author = map['author'];
    title = map['title'];
    name = map['name'];
    createdAt = DateTime.parse(map['createdAt']).toLocal();
    messages = map['messages'].map<Message>((message) => Message.fromMap(message)).toList();
  }

  Map<String, dynamic> toJson() => {
    '_id': id,
    'author': author,
    'title': title,
    'name': name,
    'createdAt': createdAt,
    'messages': messages.map((Message message) => message.toJson()).toList(),
  };

}


class Message {

  String id;
  String message;
  Author by;
  String onModel;
  DateTime createdAt;
  bool isLoading = false;

  Message({ this.id, this.message, this.by, this.onModel, this.createdAt });

  Message.fromMap(map) {
    id = map['_id'];
    message = map['message'];
    by = Author.fromJson(map['by']);
    onModel = map['onModel'];
    createdAt = DateTime.parse(map['createdAt']).toLocal();
  }

  Map<String, dynamic> toJson() => {
    'message': message,
    'by': by.toJson(),
    'onModel': onModel,
    'createdAt': createdAt.toUtc().toString(),
  };

  @override
  String toString() {
    return 'Message{id: $id, message: $message, by: $by, onModel: $onModel, createdAt: $createdAt}';
  }


}