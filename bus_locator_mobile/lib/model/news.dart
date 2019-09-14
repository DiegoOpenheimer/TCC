import 'author.dart';

class DocNews {
    int limit;
    int page;
    int total;
    List<News> docs;

    DocNews({
        this.limit = 0,
        this.page = 0,
        this.total = 1,
        this.docs = const [],
    });

    factory DocNews.fromJson(Map<String, dynamic> json) => DocNews(
        limit: json["limit"],
        page: json["page"],
        total: json["total"],
        docs: List.from(json["docs"].map((news) => News.fromJson(news))),
    );

    Map<String, dynamic> toJson() => {
        "limit": limit,
        "page": page,
        "total": total,
        "docs": List.from(docs.map((news) => news.toJson())),
    };

    @override
    String toString() {
        return 'DocNews{limit: $limit, page: $page, total: $total, docs: $docs}';
    }


}

class News {
    String id;
    Author author;
    String title;
    String message;
    DateTime createdAt;

    News({
        this.id,
        this.author,
        this.title,
        this.message,
        this.createdAt
    });

    factory News.fromJson(Map<String, dynamic> json) => News(
        id: json["_id"],
        author: Author.fromJson(json["author"]),
        title: json["title"],
        message: json["message"],
        createdAt: DateTime.parse(json["createdAt"]).toLocal(),
    );

    Map<String, dynamic> toJson() => {
        "_id": id,
        "author": author.toJson(),
        "title": title,
        "message": message,
        "createdAt": createdAt,
    };
}

