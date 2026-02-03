# storage.py
import pymysql
from typing import List, Dict


class MySQLStorage:
    def __init__(self, config: dict):
        self.conn = pymysql.connect(**config)
        self.cursor = self.conn.cursor()

    def exists_source_book(self, source: str, book_id: str) -> bool:
        sql = """
        SELECT 1 FROM book_source
        WHERE source = %s AND book_id = %s
        LIMIT 1
        """
        self.cursor.execute(sql, (source, book_id))
        return self.cursor.fetchone() is not None

    def insert_book_source(self, rows: List[Dict]):
        """
        rows: [
          {
            "name": "",
            "source": "",
            "url": "",
            "book_id": ""
          }
        ]
        """
        sql = """
        INSERT INTO book_source (name, source, url, book_id)
        VALUES (%s, %s, %s, %s)
        """
        values = [
            (r["name"], r["source"], r["url"], r["book_id"])
            for r in rows
        ]
        self.cursor.executemany(sql, values)
        self.conn.commit()

    def close(self):
        self.cursor.close()
        self.conn.close()
