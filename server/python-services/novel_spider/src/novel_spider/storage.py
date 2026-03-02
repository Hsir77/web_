import pymysql
import json
from typing import List, Dict
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
            "book_id": "",
            "gender": "male|female"
          }
        ]
        """
        sql = """
        INSERT INTO book_source (name, source, url, book_id, gender)
        VALUES (%s, %s, %s, %s, %s)
        """
        values = [
            (
                r["name"],
                r["source"],
                r["url"],
                r["book_id"],
                r["gender"]
            )
            for r in rows
        ]
        self.cursor.executemany(sql, values)
        self.conn.commit()

    def close(self):
        self.cursor.close()
        self.conn.close()

    def query_book_source(
        self,
        source: str,
        table: str,
        limit: int = 100
    ) -> List[Dict]:
        """
        根据 source 从指定表中查询 book_id + url
        """
        sql = f"""
        SELECT book_id, url
        FROM {table}
        WHERE source = %s
        LIMIT %s
        """
        self.cursor.execute(sql, (source, limit))
        rows = self.cursor.fetchall()

        return [
            {
                "book_id": row[0],
                "url": row[1]
            }
            for row in rows
        ]
   
    # book_data表的重复性校验
    def exists_book_data(self, book_id: str, book_name: str) -> bool:
        sql = """
        SELECT 1 FROM zongheng_book_data
        WHERE book_id = %s AND book_name = %s
        LIMIT 1
        """
        self.cursor.execute(sql, (book_id, book_name))
        return self.cursor.fetchone() is not None

    # book_data表 存储通用字段
    def insert_book_base_info(self, data: dict, table: str):
        sql = f"""
        INSERT INTO {table} (
            book_id,
            book_name,
            author_name,
            book_status,
            category,
            word_count,
            book_intro,
            cover_url
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            book_name   = VALUES(book_name),
            author_name = VALUES(author_name),
            book_status = VALUES(book_status),
            category    = VALUES(category),
            word_count  = VALUES(word_count),
            book_intro  = VALUES(book_intro),
            cover_url   = VALUES(cover_url)
        """
        self.cursor.execute(sql, (
            data["book_id"],
            data["book_name"],
            data["author_name"],
            data["book_status"],
            data["category"],
            data["word_count"],
            data["book_intro"],
            data["cover_url"]
        ))
        self.conn.commit()

    # book_data表 存储章节字段
    def update_book_chapter_catalog(
        self,
        book_id: str,
        chapter_count: int,
        chapter_catalog: dict,
        table: str
    ):
        sql = f"""
        UPDATE {table}
        SET
            chapter_count = %s,
            chapter_catalog = %s
            WHERE book_id = %s
        """
        self.cursor.execute(sql, (
            chapter_count,
            json.dumps(chapter_catalog, ensure_ascii=False),
            book_id
        ))
        self.conn.commit()

    # book_data表 存储章节内容字段
    def update_book_chapter_content(
        self,
        book_id: str,
        table: str,
        chapter1: str = None,
        chapter2: str = None,
        chapter3: str = None
    ):
        fields = []
        values = []

        if chapter1 is not None:
            fields.append("chapter1_content = %s")
            values.append(chapter1)

        if chapter2 is not None:
            fields.append("chapter2_content = %s")
            values.append(chapter2)

        if chapter3 is not None:
            fields.append("chapter3_content = %s")
            values.append(chapter3)

        if not fields:
            return

        sql = f"""
        UPDATE {table}
        SET {", ".join(fields)}
        WHERE book_id = %s
        """
        values.append(book_id)
        self.cursor.execute(sql, tuple(values))
        self.conn.commit()

    # book_data表 存储纵横特有字段
    def update_zongheng_extra_fields(self, book_id: str, data: dict):
        """
        data = {
            "total_click": 0,
            "total_recommend": 0,
            "weekly_recommend": 0
        }
        """
        sql = """
        UPDATE zongheng_book_data
        SET
            total_click = %s,
            total_recommend = %s,
            weekly_recommend = %s
        WHERE book_id = %s
        """
        self.cursor.execute(sql, (
            data.get("total_click", 0),
            data.get("total_recommend", 0),
            data.get("weekly_recommend", 0),
            book_id
        ))
        self.conn.commit()
    
    # book_data表 存储七猫特有字段
    def update_qimao_extra_fields(self, book_id: str, data: dict):
        sql = """
        UPDATE qimao_book_data
        SET
            score = %s,
            read_count = %s,
            popularity = %s
        WHERE book_id = %s
        """
        self.cursor.execute(sql, (
            data.get("score", 0),
            data.get("read_count", 0),
            data.get("popularity", 0),
            book_id
        ))
        self.conn.commit()
    
    # book_data表 存储书旗特有字段
    def update_shuqi_extra_fields(self, book_id: str, data: dict):
        sql = """
        UPDATE shuqi_book_data
        SET
            popularity = %s
        WHERE book_id = %s
        """
        self.cursor.execute(sql, (
            data.get("popularity", 0),
            book_id
        ))
        self.conn.commit()