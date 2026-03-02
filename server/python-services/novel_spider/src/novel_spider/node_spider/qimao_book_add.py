import sys
import json
import io
import requests
import re
import random
import time
from html import unescape
from bs4 import BeautifulSoup
from parsel import Selector

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def fetch_html(url: str) -> str:
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/145.0.0.0 Safari/537.36"
        ),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
    }
    try:
        resp = requests.get(url, headers=headers, timeout=10, allow_redirects=True)
        resp.raise_for_status()
        resp.encoding = resp.apparent_encoding or 'utf-8'
        return resp.text
    except requests.RequestException as e:
        raise Exception(f"获取详情页HTML失败：{str(e)}")

def fetch_json(url: str, params: dict = None, headers: dict = None, method: str = "GET") -> dict:
    headers = headers or {}
    params = params or {}
    try:
        if method.upper() == "POST":
            resp = requests.post(url, data=params, headers=headers, timeout=10)
        else:
            resp = requests.get(url, params=params, headers=headers, timeout=10)
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as e:
        raise Exception(f"获取JSON数据失败：{str(e)}")

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
        except requests.RequestException as e:
            results.append({
                "url": chapter_url,
                "success": False,
                "status_code": getattr(e.response, "status_code", None),
                "html": None,
                "error": str(e),
            })
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

def main():
    result = {
        "code": 0,
        "message": "success",
        "data": {
            "base_info": {},
            "chapter_catalog": {},
            "chapter_content": {}
        }
    }
    try:
        if len(sys.argv) < 4:
            raise Exception(f"参数不足，需要3个（url/source/gender），实际收到：{len(sys.argv)-1}个")
        
        url = sys.argv[1]
        source = sys.argv[2]
        gender = sys.argv[3]

        # 从URL解析book_id（七猫URL格式：https://www.qimao.com/shuku/xxx/）
        book_id_match = re.search(r'qimao\.com/shuku/(\d+)/', url)
        if not book_id_match:
            raise Exception("无法从URL解析出book_id")
        book_id = book_id_match.group(1)

        # 爬取详情页并解析基础信息
        html = fetch_html(url)
        base_info = parse_qimao_html(html, book_id)
        base_info["source"] = source
        base_info["gender"] = gender
        base_info["original_url"] = url
        result["data"]["base_info"] = base_info

        # 爬取章节目录
        chapter_json = fetch_qimao_chapter_catalog(book_id)
        chapter_catalog_data = parse_qimao_chapter_catalog(chapter_json, book_id)
        result["data"]["chapter_catalog"] = chapter_catalog_data

        # 爬取章节内容
        chapter_urls = chapter_catalog_data.get("chapter_urls", [])
        if chapter_urls:
            chapter_html_results = fetch_qimao_chapter_content(chapter_urls)
            chapter_content_data = parse_qimao_chapter_content(chapter_html_results)
            result["data"]["chapter_content"] = chapter_content_data

    except Exception as e:
        result["code"] = -1
        result["message"] = f"爬取失败：{str(e)}"
    
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main()