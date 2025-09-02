
// // lib/db.ts
// import mysql from 'mysql2/promise';

// const db = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'db_pinjam_ruangan',
// });

// export default db;

import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, // wajib kalau pakai Aiven
  },
});

export default db;


