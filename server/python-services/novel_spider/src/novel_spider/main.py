from novel_spider.book_source.qimao_spider import run as run_qimao
from novel_spider.book_source.zongheng_spider import run as run_zongheng
from novel_spider.book_source.shuqi_spider import run as run_shuqi
    
SPIDERS = [
    ("qimao", run_qimao),
    ("zongheng", run_zongheng),
    ("shuqi", run_shuqi),
]


def main():
    print("🚀 爬虫调度开始")

    spiders = [
        ("qimao", run_qimao),
        ("zongheng", run_zongheng),
        ("shuqi", run_shuqi),
    ]

    for name, spider in spiders:
        try:
            print(f"▶ 开始爬取 {name}")
            spider()
            print(f"✅ {name} 爬取完成")
        except Exception as e:
            print(f"❌ {name} 爬取失败")
            print(f"  错误原因：{e}")

    print("🏁 所有站点调度完成")


if __name__ == "__main__":
    main()
