MYSQL_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "040903",
    "database": "novel_data",
    "port": 3306,
    "charset": "utf8mb4",
    "autocommit": False
}


from enum import Enum


class SourceEnum(str, Enum):
    ZONGHENG = "zongheng"
    QIMAO = "qimao"
    SHUQI = "shuqi"


class TableEnum(str, Enum):
    BOOK_SOURCE = "book_source"

