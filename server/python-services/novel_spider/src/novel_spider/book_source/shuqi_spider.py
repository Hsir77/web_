from datetime import datetime
import requests
from bs4 import BeautifulSoup

from novel_spider.storage import MySQLStorage
from novel_spider.config import MYSQL_CONFIG


SITE = "shuqi"
BASE_URL = "https://www.shuqi.com/store"

GENDER_MAP = {
    1: "male",
    2: "female"
}

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/144.0.0.0 Safari/537.36"
    ),
    "Referer": "https://www.shuqi.com/store"
}


def run():
    storage = MySQLStorage(MYSQL_CONFIG)

    inserted = 0
    skipped = 0

    for sz, gender in GENDER_MAP.items():
        for page in range(1, 7):
            resp = requests.get(
                BASE_URL,
                params={"sz": sz, "page": page},
                headers=HEADERS,
                timeout=10
            )
            resp.raise_for_status()

            soup = BeautifulSoup(resp.text, "lxml")
            ul = soup.select_one("ul.store-ul")
            if not ul:
                continue

            for li in ul.find_all("li"):
                a = li.find("a", href=True)
                if not a:
                    continue

                href = a["href"]
                if "/book/" not in href:
                    continue

                book_id = href.split("/")[-1].replace(".html", "")

                if storage.exists_source_book(SITE, book_id):
                    skipped += 1
                    continue

                storage.insert_book_source([{
                    "name": a.get_text(strip=True),
                    "source": SITE,
                    "url": f"https://www.shuqi.com{href}",
                    "book_id": book_id,
                    "gender": gender
                }])

                inserted += 1

            print(f"[{gender}] page {page} done")

    storage.close()
    print(f"✅ inserted={inserted}, skipped={skipped}")


if __name__ == "__main__":
    run()
