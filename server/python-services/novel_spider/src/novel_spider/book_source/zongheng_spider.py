from datetime import datetime

from novel_spider.fetcher import fetch_json
from novel_spider.storage import MySQLStorage
from novel_spider.config import MYSQL_CONFIG


SITE = "zongheng"
API_URL = "https://www.zongheng.com/api/rank/details"

RANK_TYPE_LIST = [5, 6, 8]
PAGE_LIST = range(1, 11)
CATE_TYPE_LIST = [0, 1]

GENDER_MAP = {
    0: "male",
    1: "female"
}

HEADERS = {
    "Accept": "application/json, text/plain, */*",
    "Content-Type": "application/x-www-form-urlencoded",
    "Origin": "https://www.zongheng.com",
    "Referer": "https://www.zongheng.com/rank",
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/144.0.0.0 Safari/537.36"
    )
}


def run():
    storage = MySQLStorage(MYSQL_CONFIG)

    total_inserted = 0
    total_skipped = 0
    crawl_time = datetime.now()

    for cate_type in CATE_TYPE_LIST:
        gender = GENDER_MAP[cate_type]

        for rank_type in RANK_TYPE_LIST:
            for page in PAGE_LIST:
                data = {
                    "cateFineId": 0,
                    "cateType": cate_type,
                    "pageNum": page,
                    "pageSize": 20,
                    "period": 0,
                    "rankNo": "",
                    "rankType": rank_type
                }

                result = fetch_json(API_URL, data, HEADERS, method="POST")
                books = result.get("result", {}).get("resultList", [])

                if not books:
                    continue

                to_insert = []

                for book in books:
                    book_id = str(book.get("bookId"))
                    if not book_id:
                        continue

                    if storage.exists_source_book(SITE, book_id):
                        total_skipped += 1
                        continue

                    to_insert.append({
                        "name": book.get("bookName"),
                        "source": SITE,
                        "url": f"https://www.zongheng.com/detail/{book_id}",
                        "book_id": book_id,
                        "gender": gender
                    })

                if to_insert:
                    storage.insert_book_source(to_insert)
                    total_inserted += len(to_insert)

    storage.close()

    return {
        "inserted": total_inserted,
        "skipped": total_skipped,
        "time": crawl_time
    }


if __name__ == "__main__":
    run()
