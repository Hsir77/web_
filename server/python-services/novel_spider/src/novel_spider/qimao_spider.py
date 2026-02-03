# qimao_spider.py
from datetime import datetime

from novel_spider.config import MYSQL_CONFIG
from novel_spider.fetcher import fetch_json
from novel_spider.storage import MySQLStorage


SITE = "qimao"
API_URL = "https://www.qimao.com/qimaoapi/api/rank/book-list"

IS_GIRL_LIST = [0, 1]
RANK_TYPE_LIST = [1, 3, 6]
PAGE_LIST = range(1, 6)

DATE_TYPE = 1
RANK_DATE = "202601"

HEADERS = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Referer": "https://www.qimao.com/paihang/boy/hot/date/",
    "User-Agent": "Mozilla/5.0"
}


def run():
    storage = MySQLStorage(MYSQL_CONFIG)
    crawl_time = datetime.now()

    for is_girl in IS_GIRL_LIST:
        for rank_type in RANK_TYPE_LIST:
            for page in PAGE_LIST:
                params = {
                    "is_girl": is_girl,
                    "rank_type": rank_type,
                    "date_type": DATE_TYPE,
                    "date": RANK_DATE,
                    "page": page
                }

                data = fetch_json(API_URL, params, HEADERS)
                books = data.get("data", {}).get("table_data", [])

                rows = []
                for book in books:
                    book_id = str(book.get("book_id"))
                    if not book_id:
                        continue

                    if storage.exists_source_book(SITE, book_id):
                        continue

                    rows.append({
                        "name": book.get("title"),
                        "source": SITE,
                        "url": f"https://www.qimao.com/shuku/{book_id}/",
                        "book_id": book_id
                    })

                if rows:
                    storage.insert_book_source(rows)

    storage.close()


if __name__ == "__main__":
    run()
