class Author {

    String id;
    String name;
    String email;

    Author({
        this.name,
        this.email,
        this.id
    });

    factory Author.fromJson(Map<String, dynamic> json) => Author(
        name: json["name"],
        email: json["email"],
        id: json["_id"],
    );

    Map<String, dynamic> toJson() => {
        "name": name,
        "email": email,
        "_id": id
    };
}