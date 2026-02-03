import requests


def fetch_json(url: str, params: dict, headers: dict, cookies: dict = None):
    resp = requests.get(
        url,
        params=params,
        headers=headers,
        cookies=cookies,
        timeout=10
    )
    resp.raise_for_status()
    return resp.json()
