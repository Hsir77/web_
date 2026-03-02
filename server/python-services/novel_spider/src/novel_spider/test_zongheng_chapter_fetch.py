import requests

TEST_URL = "https://read.zongheng.com/chapter/1002562/61927740.html"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/144.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
}

COOKIES = {
    "ZHID": "308922F4419BFBBD1A8C69797D286D50",
    "HMACCOUNT": "E3626EDEE7B17CFF",
    "acw_tc": "7b3975b817704559581375353e8a93d0f8093bf9dac1dbcb8835e92d848320",
}

def test_fetch_zongheng_chapter():
    session = requests.Session()
    session.headers.update(HEADERS)
    session.cookies.update(COOKIES)

    resp = session.get(TEST_URL, timeout=10, allow_redirects=True)

    print("status_code:", resp.status_code)
    print("final_url:", resp.url)
    print("content_length:", len(resp.text))
    print(resp.text)

if __name__ == "__main__":
    test_fetch_zongheng_chapter()
