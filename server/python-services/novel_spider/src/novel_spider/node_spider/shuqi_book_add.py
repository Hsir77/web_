import sys
import json
import io
import requests
import re
from html import unescape
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from parsel import Selector

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def fetch_html(url: str, params: dict = None, headers: dict = None) -> str:
    headers = headers or {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/145.0.0.0 Safari/537.36"
        ),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
    }
    params = params or {}
    try:
        resp = requests.get(url, params=params, headers=headers, timeout=10, allow_redirects=True)
        resp.raise_for_status()
        resp.encoding = resp.apparent_encoding or 'utf-8'
        return resp.text
    except requests.RequestException as e:
        raise Exception(f"获取HTML失败：{str(e)}")

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
    return fetch_html(url, params=params, headers=headers)

def parse_shuqi_html(html: str, book_id: str) -> dict:
    sel = Selector(text=html)
    
    def parse_num_with_unit(num_str, unit_marks=None):
        if not num_str:
            return None
        num_str = num_str.strip().replace("热度：", "")
        unit_marks = unit_marks or ["万", "W"]
        multiplier = 1
        has_unit = any(mark in num_str for mark in unit_marks)
        if has_unit:
            multiplier = 10000
            for mark in unit_marks:
                num_str = num_str.replace(mark, "").strip()
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
    
    chapter_urls = []
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
            # 只收集前3章URL（和七猫/纵横保持一致）
            if len(chapter_urls) < 3:
                chapter_urls.append(url)
        
        result.append({
            "volumeName": volume_name,
            "chapter_catalog": chapter_list
        })
    
    return {
        "book_id": book_id,
        "chapter_count": sum(len(v["chapter_catalog"]) for v in result),
        "chapter_catalog": result,
        "chapter_urls": chapter_urls
    }

def fetch_shuqi_chapter_content(chapter_urls: list[str]) -> list[dict]:
    HEADERS = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "max-age=0",
        "Connection": "keep-alive",
        "Referer": "https://www.shuqi.com/",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
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

def parse_shuqi_chapter_content(chapter_html_results: list[dict]) -> dict:
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
        content_div = soup.find("div", class_="content") or soup.find("div", class_="chapter-content")
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

        # 从URL解析book_id（书旗URL格式：https://www.shuqi.com/book/xxx.html）
        book_id_match = re.search(r'shuqi\.com/book/(\d+)\.html', url)
        if not book_id_match:
            raise Exception("无法从URL解析出book_id")
        book_id = book_id_match.group(1)

        # 爬取详情页并解析基础信息
        html = fetch_html(url)
        base_info = parse_shuqi_html(html, book_id)
        base_info["source"] = source
        base_info["gender"] = gender
        base_info["original_url"] = url
        result["data"]["base_info"] = base_info

        # 爬取章节目录
        chapter_html = fetch_shuqi_chapter_catalog(book_id)
        chapter_catalog_data = parse_shuqi_chapter_catalog(chapter_html, book_id)
        result["data"]["chapter_catalog"] = chapter_catalog_data

        # 爬取章节内容（补充书旗的章节内容解析，和其他平台对齐）
        chapter_urls = chapter_catalog_data.get("chapter_urls", [])
        if chapter_urls:
            chapter_html_results = fetch_shuqi_chapter_content(chapter_urls)
            chapter_content_data = parse_shuqi_chapter_content(chapter_html_results)
            result["data"]["chapter_content"] = chapter_content_data

    except Exception as e:
        result["code"] = -1
        result["message"] = f"爬取失败：{str(e)}"
    
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main()