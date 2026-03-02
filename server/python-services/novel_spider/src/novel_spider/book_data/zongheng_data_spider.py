import requests
import re
from html import unescape
from bs4 import BeautifulSoup
from parsel import Selector
from novel_spider.storage import MySQLStorage
from novel_spider.fetcher import fetch_html , fetch_json
from novel_spider.config import MYSQL_CONFIG, SourceEnum, TableEnum


def fetch_zongheng_chapter_catalog(book_id: str) -> dict:
    url = "https://bookapi.zongheng.com/api/chapter/getChapterList"
    headers = {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/x-www-form-urlencoded",
        "origin": "https://www.zongheng.com",
        "referer": "https://www.zongheng.com/",
        "user-agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/144.0.0.0 Safari/537.36"
        )
    }
    return fetch_json(url, params={"bookId": book_id}, headers=headers, method="POST")

def fetch_zongheng_chapter_content(chapter_urls: list[str]) -> list[dict]:
    HEADERS = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "max-age=0",
        "Connection": "keep-alive",
        "Referer": "https://www.zongheng.com/",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-site",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
        "sec-ch-ua": '"Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "Cookie": (
            "ZHID=308922F4419BFBBD1A8C69797D286D50; "
            "zh_visitTime=1770123894859; "
            "v_user=https%3A%2F%2Fwww.doubao.com%2F%7Chttps%3A%2F%2Fhuayu.zongheng.com%2F%7C86188033; "
            "sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%2219c19b8fdf30-09f1a9fd723ee1-26061d51-1327104-19c19b8fdf4b3e%22%2C%22%24device_id%22%3A%2219c19b8fdf30-09f1a9fd723ee1-26061d51-1327104-19c19b8fdf4b3e%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_referrer%22%3A%22%22%2C%22%24latest_referrer_host%22%3A%22%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%7D%7D; "
            "PassportCaptchaId=be2d57f249ae224d02efce64509d5526; "
            "zhffr=0; "
            "acw_tc=276077db17705367257606403e5bfbdbf89cadffa165854a01c3cdf8da020e; "
            "Hm_lvt_c202865d524849216eea846069349eb9=1770292867,1770361741,1770445969,1770536727; "
            "Hm_lpvt_c202865d524849216eea846069349eb9=1770536727; "
            "HMACCOUNT=E3626EDEE7B17CFF"
        ),
    }

    session = requests.Session()
    session.headers.update(HEADERS)

    results = []

    for idx, chapter_url in enumerate(chapter_urls, start=1):
        try:
            resp = session.get(chapter_url, timeout=10, allow_redirects=True)
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


def parse_zongheng_html(html: str) -> dict:
    sel = Selector(text=html)

    book_id = None
    chapter_href = sel.css('a[href*="read.zongheng.com/chapter"]::attr(href)').get()
    if chapter_href:
        m = re.search(r'read\.zongheng\.com/chapter/(\d+)/', chapter_href)
        if m:
            book_id = m.group(1)

    book_name = sel.css('.book-info--title span::text').get()
    author_name = sel.css('.author-info--name::text').get()
    book_status = sel.css('.book-info--tags .serialStatus::text').get()
    category = sel.css('.book-info--tags .cateFineId::text').get()

    def parse_num_with_unit(num_str):
        if not num_str:
            return None
        num_str = num_str.strip()
        multiplier = 1
        if "万" in num_str:
            num_str = num_str.replace("万", "").strip()
            multiplier = 10000
        num_match = re.search(r'(\d+\.?\d*)', num_str)
        if not num_match:
            return None
        try:
            num = float(num_match.group(1)) * multiplier
            return int(num)
        except ValueError:
            return None

    def parse_stat_from_span(span_sel):
        if not span_sel:
            return None

        num = span_sel.xpath("text()").get()
        if not num:
            return None

        num = num.strip()

        sibling_text = span_sel.xpath("following-sibling::*[1]/text()").get()
        if sibling_text and sibling_text.strip().startswith("万"):
            return f"{num}万"

        return num

    spans = sel.css(".book-info--nums div span")

    total_click_str = parse_stat_from_span(spans[0]) if len(spans) > 0 else None
    total_click = parse_num_with_unit(total_click_str)
    
    total_recommend_str = parse_stat_from_span(spans[1]) if len(spans) > 1 else None
    total_recommend = parse_num_with_unit(total_recommend_str)
    
    weekly_recommend_str = parse_stat_from_span(spans[2]) if len(spans) > 2 else None
    weekly_recommend = parse_num_with_unit(weekly_recommend_str)
    
    word_count_str = parse_stat_from_span(spans[3]) if len(spans) > 3 else None
    word_count = parse_num_with_unit(word_count_str)

    raw_intro = sel.css(
        'meta[name="og:description"]::attr(content)'
    ).get()

    book_intro = raw_intro.strip() if raw_intro else None

    cover_url = sel.css(
        '.book-info--coverImage-img::attr(src)'
    ).get()

    return {
        "book_id": book_id,
        "book_name": book_name.strip() if book_name else None,
        "author_name": author_name.strip() if author_name else None,
        "book_status": book_status.strip() if book_status else None,
        "category": category.strip() if category else None,
        "total_click": total_click,
        "total_recommend": total_recommend,
        "weekly_recommend": weekly_recommend,
        "word_count": word_count,
        "book_intro": book_intro,
        "cover_url": cover_url,
    }

def parse_zongheng_chapter_catalog(data: dict) -> dict:
    result = data.get("result", {})
    tome_list = result.get("chapterList", [])

    #只负责统计
    chapter_count = sum(
        int(tome.get("tomeTotalChapterNum") or 0)
        for tome in tome_list
    )

    #单独处理
    chapter_urls = []

    NON_CONTENT_TOME_NAMES = {"作品相关", "作者的话", "作者相关", "番外"}

    def is_story_chapter(ch: dict) -> bool:
        name = ch.get("chapterName", "")
        return name.startswith("第") and "章" in name

    for tome in tome_list:
        if len(chapter_urls) >= 3:
            break

        tome_info = tome.get("tome", {})
        tome_name = tome_info.get("tomeName", "")

        # 跳过非正文卷
        if tome_name in NON_CONTENT_TOME_NAMES:
            continue

        for ch in tome.get("chapterViewList", []):
            if len(chapter_urls) >= 3:
                break

            if not is_story_chapter(ch):
                continue

            chapter_id = ch.get("chapterId")
            book_id = ch.get("bookId")

            if chapter_id and book_id:
                chapter_urls.append(
                    f"https://read.zongheng.com/chapter/{book_id}/{chapter_id}.html"
                )

    return {
        "chapter_count": chapter_count,
        "chapter_catalog": tome_list,
        "chapter_urls": chapter_urls
    }

def parse_zongheng_chapter_content(chapter_html_results: list[dict]) -> dict:
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

        content_div = soup.find("div", class_="content")
        if not content_div:
            continue

        paragraphs = []
        for p in content_div.find_all("p", recursive=False):
            text = p.get_text(strip=True)
            if text:
                paragraphs.append(text)

        if paragraphs:
            result[f"chapter{idx}"] = "\n".join(paragraphs)

    return result

def run(limit: int = 50):
    storage = MySQLStorage(MYSQL_CONFIG)

    books = storage.query_book_source(
        source=SourceEnum.ZONGHENG.value,
        table=TableEnum.BOOK_SOURCE.value,
        limit=limit
    )

    for book in books:
        book_id = book["book_id"]
        url = book["url"]

        # 一
        try:
            html = fetch_html(url)
        except Exception as e:
            print(f" 请求失败 book_id={book_id} err={e}")
            continue

        data = parse_zongheng_html(html)
        storage.insert_book_base_info(data,'zongheng_book_data')
        storage.update_zongheng_extra_fields(book_id,data)

        # 二
        try:
            chapter_json = fetch_zongheng_chapter_catalog(book_id)
        except Exception as e:
            print(f" 章节接口失败 book_id={book_id} err={e}")
            continue

        chapter_data = parse_zongheng_chapter_catalog(chapter_json)
        storage.update_book_chapter_catalog(
            book_id=book_id,
            chapter_count=chapter_data["chapter_count"],
            chapter_catalog=chapter_data["chapter_catalog"],
            table='zongheng_book_data'
        )

        # 三
        chapter_urls = chapter_data["chapter_urls"]
        try:
             chapter_contents = fetch_zongheng_chapter_content(chapter_urls)
        except Exception as e:
            print(f" 章节接口失败 book_id={chapter_urls} err={e}")
            continue

        chapter_contents_data=parse_zongheng_chapter_content(chapter_contents)
        
        storage.update_book_chapter_content(
            book_id=book_id,
            table='zongheng_book_data',
            chapter1=chapter_contents_data["chapter1"],
            chapter2=chapter_contents_data["chapter2"],
            chapter3=chapter_contents_data["chapter3"]
        )


        print(f"✅ 已抓取详情页 book_id={book_id}")
    storage.close()


if __name__ == "__main__":
    run(limit=1000)
