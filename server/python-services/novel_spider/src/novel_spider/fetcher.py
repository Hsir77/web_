import requests


def fetch_json(url, params=None, headers=None, method="GET"):
    if method.upper() == "POST":
        resp = requests.post(url, data=params, headers=headers, timeout=10)
    else:
        resp = requests.get(url, params=params, headers=headers, timeout=10)

    resp.raise_for_status()
    return resp.json()

def fetch_html(url, params=None, headers=None):
    resp = requests.get(url, params=params, headers=headers, timeout=10)
    resp.raise_for_status()
    return resp.text
