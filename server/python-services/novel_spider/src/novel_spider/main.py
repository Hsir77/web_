import requests
import pymysql
from datetime import datetime


# ======================
# 配置区
# ======================

API_URL = "https://www.qimao.com/qimaoapi/api/rank/book-list"

PARAMS = {
    "is_girl": 0,
    "rank_type": 3,
    "date_type": 1,
    "date": "202601",
    "page": 1
}

SITE = "qimao"

MYSQL_CONFIG = {
    "host": "localhost",    
    "user": "root",
    "password": "040903",
    "database": "novel_test",
    "port": 3306,
    "charset": "utf8mb4"
}


# ======================
# 主逻辑
# ======================

def main():
    resp = requests.get(API_URL, params=PARAMS, timeout=10)
    resp.raise_for_status()

    json_data = resp.json()
    books = json_data["data"]["table_data"]

    conn = pymysql.connect(**MYSQL_CONFIG)
    cursor = conn.cursor()

    insert_sql = """
    INSERT INTO test_articles (
        site, rank_type, date_type, rank_date, rank_page, rank_position,
        book_id, title, author,
        category1_name, category2_name,
        is_over, is_new, is_sign,
        words_num, latest_chapter_title, update_time,
        number, unit,
        crawl_time
    ) VALUES (
        %s, %s, %s, %s, %s, %s,
        %s, %s, %s,
        %s, %s,
        %s, %s, %s,
        %s, %s, %s,
        %s, %s,
        %s
    )
    ON DUPLICATE KEY UPDATE
        number = VALUES(number),
        update_time = VALUES(update_time),
        crawl_time = VALUES(crawl_time)
    """

    now = datetime.now()

    for idx, book in enumerate(books, start=1):
        cursor.execute(insert_sql, (
            SITE,
            PARAMS["rank_type"],
            PARAMS["date_type"],
            PARAMS["date"],
            PARAMS["page"],
            idx,

            book["book_id"],
            book["title"],
            book.get("author"),

            book.get("category1_name"),
            book.get("category2_name"),

            int(book.get("is_over", 0)),
            int(book.get("is_new", 0)),
            int(book.get("is_sign", 0)),

            book.get("words_num"),
            book.get("latest_chapter_title"),
            book.get("update_time"),

            float(book.get("number", 0)),
            book.get("unit"),

            now
        ))

    conn.commit()
    cursor.close()
    conn.close()

    print(f"✅ 成功入库 {len(books)} 条数据")


if __name__ == "__main__":
    main()
