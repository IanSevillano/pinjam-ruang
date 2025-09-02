<<<<<<< HEAD
// // lib/db.ts
// import mysql from 'mysql2/promise';

// const db = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'db_pinjam_ruangan',
// });

// export default db;

=======
>>>>>>> 1b80120d83f0e921abe4ad88e0a4137264d94c5c
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


