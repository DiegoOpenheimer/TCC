class Line {
  String id;
  int number;
  String description;
  List<Route> routes;
  List<Point> points;
  Map<String, dynamic> directions;
  Horary horary;
  DateTime createdAt;
  DateTime updatedAt;

  Line({
    this.id,
    this.number,
    this.description,
    this.routes,
    this.points,
    this.directions,
    this.horary,
    this.createdAt,
    this.updatedAt,
  });

  factory Line.fromJson(Map<String, dynamic> json) => Line(
    id: json["_id"],
    number: json["number"],
    description: json["description"],
    routes: List<Route>.from(json["routes"].map((x) => Route.fromJson(x))),
    points: List<Point>.from(json["points"].map((x) => Point.fromJson(x))),
    directions: json["directions"],
    horary: Horary.fromJson(json["horary"]),
    createdAt: DateTime.parse(json["createdAt"]).toLocal(),
    updatedAt: DateTime.parse(json["updatedAt"]).toLocal(),
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "number": number,
    "description": description,
    "routes": List<dynamic>.from(routes.map((x) => x.toJson())),
    "points": List<dynamic>.from(points.map((x) => x.toJson())),
    "directions": directions,
    "horary": horary.toJson(),
    "createdAt": createdAt.toIso8601String(),
    "updatedAt": updatedAt.toIso8601String(),
  };
}

class Horary {
  List<dynamic> mondayToSaturday;
  List<dynamic> sundayAndHoliday;
  String id;

  Horary({
    this.mondayToSaturday,
    this.sundayAndHoliday,
    this.id,
  });

  factory Horary.fromJson(Map<String, dynamic> json) => Horary(
    mondayToSaturday: List<dynamic>.from(json["mondayToSaturday"].map((x) => x)),
    sundayAndHoliday: List<dynamic>.from(json["sundayAndHoliday"].map((x) => x)),
    id: json["_id"],
  );

  Map<String, dynamic> toJson() => {
    "mondayToSaturday": List<dynamic>.from(mondayToSaturday.map((x) => x)),
    "sundayAndHoliday": List<dynamic>.from(sundayAndHoliday.map((x) => x)),
    "_id": id,
  };
}

class Point {
  String id;
  double lat;
  double lng;
  String name;

  Point({
    this.id,
    this.lat,
    this.lng,
    this.name,
  });

  factory Point.fromJson(Map<String, dynamic> json) => Point(
    id: json["_id"],
    lat: json["lat"].toDouble(),
    lng: json["lng"].toDouble(),
    name: json["name"],
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "lat": lat,
    "lng": lng,
    "name": name,
  };
}

class Route {
  String id;
  String route;

  Route({
    this.id,
    this.route,
  });

  factory Route.fromJson(Map<String, dynamic> json) => Route(
    id: json["_id"],
    route: json["route"],
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "route": route,
  };
}
