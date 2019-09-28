

class Device {
  String id;
  String uuid;
  String name;
  String line;
  double latitude;
  double longitude;
  DateTime createdAt;
  DateTime updatedAt;
  String lineDescription;
  int lineNumber;

  Device({
    this.id,
    this.uuid,
    this.name,
    this.line,
    this.latitude,
    this.longitude,
    this.createdAt,
    this.updatedAt,
    this.lineDescription,
    this.lineNumber,
  });

  factory Device.fromJson(Map<String, dynamic> json) => Device(
    id: json["_id"],
    uuid: json["uuid"],
    name: json["name"],
    line: json["line"],
    latitude: json["latitude"]?.toDouble(),
    longitude: json["longitude"]?.toDouble(),
    createdAt: DateTime.parse(json["createdAt"]).toLocal(),
    updatedAt: DateTime.parse(json["updatedAt"]).toLocal(),
    lineDescription: json["lineDescription"],
    lineNumber: json["lineNumber"],
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "uuid": uuid,
    "name": name,
    "line": line,
    "latitude": latitude,
    "longitude": longitude,
    "createdAt": createdAt.toUtc().toString(),
    "updatedAt": updatedAt.toUtc().toString(),
    "lineDescription": lineDescription,
    "lineNumber": lineNumber,
  };
}
