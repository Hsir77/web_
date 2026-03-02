const mysql = require('mysql2/promise');

const MYSQL_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "040903",
    "database": "novel_data",
    "port": 3306,
    "charset": "utf8mb4",
};

const pool = mysql.createPool(MYSQL_CONFIG);

async function testDBConnection() {
    try {
        const [rows] = await pool.execute('SELECT 1');
        console.log(' MySQL 数据库连接成功！');
    } catch (error) {
        console.error(' MySQL 连接失败：', error.message);
        process.exit(1); // 连接失败则退出进程
    }
}

testDBConnection();

module.exports = pool;