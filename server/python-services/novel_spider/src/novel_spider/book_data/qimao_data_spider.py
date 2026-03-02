import requests
import re
import random
import time
from html import unescape
from bs4 import BeautifulSoup
from parsel import Selector
from novel_spider.storage import MySQLStorage
from novel_spider.fetcher import fetch_html, fetch_json
from novel_spider.config import MYSQL_CONFIG, SourceEnum, TableEnum


def fetch_qimao_chapter_catalog(book_id: str) -> dict:
    url = "https://www.qimao.com/qimaoapi/api/book/chapter-list"

    headers = {
        "accept": "application/json, text/plain, */*",
        "referer": f"https://www.qimao.com/shuku/{book_id}/",
        "user-agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/145.0.0.0 Safari/537.36"
        ),
    }

    params = {
        "book_id": book_id
    }

    return fetch_json(url, params=params, headers=headers, method="GET")

def fetch_qimao_chapter_content(chapter_urls: list[str]) -> list[dict]:
    HEADERS = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "max-age=0",
        "Connection": "keep-alive",
        "Referer": "https://www.qimao.com/",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
        "Cookie": (
            "sensorsdata2015jssdkcross=xxx; "
            "Hm_lvt_1b6d0fc94c391c78c2fbeda715896432=xxx; "
            "Hm_lpvt_1b6d0fc94c391c78c2fbeda715896432=xxx; "
            "acw_tc=xxx; "
            "HMACCOUNT=xxx"
        ),
    }

    session = requests.Session()
    session.headers.update(HEADERS)

    results = []

    for idx, chapter_url in enumerate(chapter_urls, start=1):
        try:
            resp = session.get(chapter_url, timeout=10)
            resp.raise_for_status()

            results.append({
                "url": chapter_url,
                "success": True,
                "status_code": resp.status_code,
                "html": resp.text,
                "error": None,
            })
            print(f"📖 第 {idx} 章抓取成功")

        except requests.RequestException as e:
            results.append({
                "url": chapter_url,
                "success": False,
                "status_code": getattr(e.response, "status_code", None),
                "html": None,
                "error": str(e),
            })
            print(f"❌ 第 {idx} 章抓取失败 url={chapter_url} err={e}")

    return results

def parse_qimao_html(html: str, book_id: str) -> dict:
    sel = Selector(text=html)
    book_name = sel.css('.title .txt::text').get(default='').strip()
    author_name = sel.css('.sub-title a::text').get(default='').strip()
    book_status = sel.css('.tags-wrap .qm-tag.green::text, .tags-wrap .qm-tag.orange::text').get(default='').strip()    
    categories = sel.css('.tags-wrap a::text').getall()
    category = categories[0].strip() if categories else ''
    book_intro = sel.css('.book-introduction .intro::text').get(default='').strip()
    cover_url = sel.css('.wrap-pic img::attr(src)').get(default='').strip()
    score = sel.css('.score::text').get()
    score = score.strip() if score else None
    stats = sel.css('.statistics-wrap .txt')
    def parse_stat(span):
        if not span:
            return None
        num_str = span.css('em::text').get()
        unit_desc = span.xpath('text()').get(default="")
        if not num_str:
            return None
        num_str = num_str.strip()
        unit_desc = unit_desc.strip()
        try:
            num = float(num_str)
        except ValueError:
            return None
        if "万" in unit_desc:
            num = num * 10000
        num = int(num)

        return num

    word_count = parse_stat(stats[0]) if len(stats) > 0 else None
    read_count = parse_stat(stats[1]) if len(stats) > 1 else None
    popularity = parse_stat(stats[2]) if len(stats) > 2 else None

    return {
        "book_id": book_id,
        "book_name": book_name,
        "author_name": author_name,
        "book_status": book_status,
        "category": category,
        "word_count": word_count,
        "book_intro": book_intro,
        "cover_url": cover_url,
        "score": score,
        "read_count": read_count,
        "popularity": popularity,
    }

def parse_qimao_chapter_catalog(data: dict, book_id: str) -> dict:
    chapters = data.get("data", {}).get("chapters", [])
    chapter_count = len(chapters)
    chapter_catalog = chapters
    chapter_urls = []
    for ch in chapters[:3]:
        chapter_id = ch.get("id")
        if chapter_id:
            chapter_urls.append(
                f"https://www.qimao.com/shuku/{book_id}-{chapter_id}/"
            )
    return {
        "chapter_count": chapter_count,
        "chapter_catalog": chapter_catalog,
        "chapter_urls": chapter_urls
    }

def parse_qimao_chapter_content(chapter_html_results: list[dict]) -> dict:
    result = {
        "chapter1": None,
        "chapter2": None,
        "chapter3": None,
    }

    for idx, item in enumerate(chapter_html_results[:3], start=1):
        if not item.get("success") or not item.get("html"):
            continue

        html = item["html"]
        soup = BeautifulSoup(html, "lxml")

        # 七猫正文位置
        content_div = soup.find("div", class_="article")
        if not content_div:
            continue

        paragraphs = []
        for p in content_div.find_all("p"):
            text = p.get_text(strip=True)
            if text:
                paragraphs.append(text)

        if paragraphs:
            result[f"chapter{idx}"] = "\n".join(paragraphs)

    return result


def run(limit: int = 50):
    storage = MySQLStorage(MYSQL_CONFIG)

    books = storage.query_book_source(
        source=SourceEnum.QIMAO.value,
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

        data = parse_qimao_html(html,book_id)
        storage.insert_book_base_info(data, 'qimao_book_data')
        storage.update_qimao_extra_fields(book_id, data)

        # 二
        try:
            chapter_json = fetch_qimao_chapter_catalog(book_id)
        except Exception as e:
            print(f" 章节接口失败 book_id={book_id} err={e}")
            continue

        chapter_data = parse_qimao_chapter_catalog(chapter_json, book_id)
        storage.update_book_chapter_catalog(
            book_id=book_id,
            chapter_count=chapter_data["chapter_count"],
            chapter_catalog=chapter_data["chapter_catalog"],
            table='qimao_book_data'
        )

        # 三
        chapter_urls = chapter_data["chapter_urls"]
        try:
            chapter_contents = fetch_qimao_chapter_content(chapter_urls)
        except Exception as e:
            print(f" 章节接口失败 book_id={chapter_urls} err={e}")
            continue

        chapter_contents_data = parse_qimao_chapter_content(chapter_contents)

        storage.update_book_chapter_content(
            book_id=book_id,
            table='qimao_book_data',
            chapter1=chapter_contents_data["chapter1"],
            chapter2=chapter_contents_data["chapter2"],
            chapter3=chapter_contents_data["chapter3"]
        )
        
        print(f"✅ 第{count}/{total}本 已抓取详情页 book_id={book_id}")

    storage.close()


if __name__ == "__main__":
    run(limit=1000)