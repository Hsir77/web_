import requests
import random
import time
from html import unescape
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import re
from parsel import Selector
from novel_spider.storage import MySQLStorage
from novel_spider.fetcher import fetch_html, fetch_json
from novel_spider.config import MYSQL_CONFIG, SourceEnum, TableEnum


def fetch_shuqi_chapter_catalog(book_id: str) -> str:
    url = "https://www.shuqi.com/chapter"

    headers = {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "referer": f"https://www.shuqi.com/book/{book_id}.html",
        "user-agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/145.0.0.0 Safari/537.36"
        ),
    }

    params = {
        "bid": book_id
    }

    return fetch_html(
        url,
        params=params,
        headers=headers
    )

def parse_shuqi_html(html: str, book_id: str) -> dict:
    sel = Selector(text=html)
    def parse_num_with_unit(num_str, unit_marks=None):
        if not num_str:
            return None
        num_str = num_str.strip().replace("热度：", "")
        unit_marks = unit_marks or ["万", "W"]
        multiplier = 1
        # 先整体判断是否包含万/W，再提取纯数字部分（关键修复）
        has_unit = any(mark in num_str for mark in unit_marks)
        if has_unit:
            multiplier = 10000
            # 移除所有单位标识，只保留数字部分
            for mark in unit_marks:
                num_str = num_str.replace(mark, "").strip()
        # 提取数字（过滤掉非数字字符，如"字"）
        import re
        num_match = re.search(r'(\d+\.?\d*)', num_str)
        if not num_match:
            return None
        num_str = num_match.group(1)
        try:
            num = float(num_str) * multiplier
            return int(num)
        except ValueError:
            return None
    book_name = sel.css(".bname::text").get(default="").strip()
    author_name = sel.css(".bauthor a::text, .bauthor::text").get(default="")
    author_name = sel.css(".bauthor a::text").get()
    if not author_name:
        author_name = sel.css(".bauthor::text").get(default="")
    author_name = author_name.replace("作者：", "").strip()
    categories = sel.css(".tags li a::text").getall()
    category = categories[0].strip() if categories else ""
    word_count = sel.css(".lastchapter li:nth-child(2)::text").get(default="").strip()
    word_count = parse_num_with_unit(word_count, ["万"]) if word_count else None
    book_status = sel.css(".lastchapter li:nth-child(3)::text").get(default="").strip()
    cover_url = (
        sel.css("img.cover::attr(src)").get()
        or sel.css("a.cover img::attr(src)").get()
        or ""
    ).strip()
    book_intro = sel.css(".js-showDesc::attr(data-text)").get()
    if not book_intro:
        book_intro = sel.css(".js-descContent::text").get(default="")

    if not book_intro:
        book_intro = sel.css(".bookDesc::text").get(default="")
    book_intro = book_intro.strip()
    popularity_str = sel.css(".bhot span::text").get(default="").strip()
    popularity = parse_num_with_unit(popularity_str, ["万", "W"])

    return {
        "book_id": book_id,
        "book_name": book_name,
        "author_name": author_name,
        "book_status": book_status,
        "category": category,
        "word_count": word_count,
        "book_intro": book_intro,
        "cover_url": cover_url,
        "popularity": popularity,
    }

def parse_shuqi_chapter_catalog(html: str, book_id: str) -> dict:
    sel = Selector(text=html)

    result = []
    base_url = "https://www.shuqi.com"

    volumes = sel.xpath('//div[@class="vol_name"]')
    for vol in volumes:
        volume_name = vol.xpath('./span/text()').get(default="").strip()
        table = vol.xpath('./following-sibling::table[1]')
        chapter_list = []
        links = table.xpath('.//a')
        for i, a in enumerate(links, start=1):
            name = a.xpath('text()').get(default="").strip()
            href = a.xpath('@href').get()
            if not href or not name:
                continue
            url = urljoin(base_url, href)
            chapter_list.append({
                "name": name,
                "url": url,
                "index": i
            })
        result.append({
            "volumeName": volume_name,
            "chapter_catalog": chapter_list
        })
    return {
        "book_id": book_id,
        "chapter_count": sum(len(v["chapter_catalog"]) for v in result),
        "chapter_catalog": result
    }



def run(limit: int = 50):
    storage = MySQLStorage(MYSQL_CONFIG)

    books = storage.query_book_source(
        source=SourceEnum.SHUQI.value,
        table=TableEnum.BOOK_SOURCE.value,
        limit=limit
    )

    count = 0
    total = len(books)

    for book in books:
        time.sleep(random.uniform(0.5, 1.5))
        count += 1
        book_id = book["book_id"]
        url = book["url"]

        # 一
        try:
            html = fetch_html(url)
        except Exception as e:
            print(f" 请求失败 book_id={book_id} err={e}")
            continue

        data = parse_shuqi_html(html,book_id)
        storage.insert_book_base_info(data, 'shuqi_book_data')
        storage.update_shuqi_extra_fields(book_id, data)

        # 二
        try:
            chapter_json = fetch_shuqi_chapter_catalog(book_id)
        except Exception as e:
            print(f" 章节接口失败 book_id={book_id} err={e}")
            continue

        chapter_data = parse_shuqi_chapter_catalog(chapter_json, book_id)
        storage.update_book_chapter_catalog(
            book_id=book_id,
            chapter_count=chapter_data["chapter_count"],
            chapter_catalog=chapter_data["chapter_catalog"],
            table='shuqi_book_data'
        )
        
        print(f"✅ 第{count}/{total}本 已抓取详情页 book_id={book_id}")

    storage.close()


if __name__ == "__main__":
    run(limit=1000)