from novel_spider.qimao_spider import run as qimao_run

SPIDERS = [
    ("qimao", qimao_run),

]


def main():
    print("🚀 爬虫调度开始\n")

    for name, spider_func in SPIDERS:
        try:
            spider_func()
            print(f"✅ {name} 爬取成功")
        except Exception as e:
            print(f"❌ {name} 爬取失败")
            print(f"  错误原因：{e}")

    print("\n🏁 所有站点调度完成")


if __name__ == "__main__":
    main()
