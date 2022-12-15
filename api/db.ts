import mysql from 'mysql'

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "mnhquy2802@",
    database: process.env.DB_NAME || "JWTNodeJS"
});

export default db
