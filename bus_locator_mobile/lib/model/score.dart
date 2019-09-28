
class Score {
  String id;
  String user;
  String line;
  String description;
  int star;
  DateTime createdAt;
  DateTime updatedAt;

  Score({
    this.id,
    this.user,
    this.line,
    this.description,
    this.star,
    this.createdAt,
    this.updatedAt,
  });

  factory Score.fromJson(Map<String, dynamic> json) => Score(
    id: json["_id"],
    user: json["user"],
    line: json["line"],
    description: json["description"],
    star: json["star"],
    createdAt: DateTime.parse(json["createdAt"]).toLocal(),
    updatedAt: DateTime.parse(json["updatedAt"]).toLocal(),
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "user": user,
    "line": line,
    "description": description,
    "star": star,
    "createdAt": createdAt.toUtc().toString(),
    "updatedAt": updatedAt.toUtc().toString(),
  };
}
