import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '1qaz@WSX29',
    database: 'shop',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Успешное подключение к базе данных!');
        connection.release();
    } catch (error) {
        console.error('Ошибка подключения к базе данных:', error);
    }
}

testConnection();
export default pool;
