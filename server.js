// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ================= DATABASE =================
const DB_DIR = path.join(__dirname, 'db');
const DB_FILE = path.join(DB_DIR, 'tools.db');

if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR);
}

const db = new sqlite3.Database(DB_FILE);

// Run SQL file
function runSqlFile(filePath) {
    const sql = fs.readFileSync(filePath, 'utf8');
    return new Promise((resolve, reject) => {
        db.exec(sql, err => (err ? reject(err) : resolve()));
    });
}

// Init DB
(async () => {
    if (!fs.existsSync(DB_FILE)) {
        console.log('Creating database...');
        await runSqlFile(path.join(DB_DIR, 'migration.sql'));
        await runSqlFile(path.join(DB_DIR, 'seed.sql'));
        console.log('Database ready.');
    } else {
        console.log('Using existing database.');
    }
})();

// ================= STATIC FILES =================
app.use(express.static(path.join(__dirname, 'public')));

// ================= API =================
app.get('/api/tools', (req, res) => {
    const q = req.query.q || '';
    const category = req.query.category || '';

    let sql = `SELECT * FROM tools`;
    const params = [];
    const where = [];

    if (q) {
        where.push('(name LIKE ? OR description LIKE ? OR tags LIKE ?)');
        params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    if (category) {
        where.push('category = ?');
        params.push(category);
    }

    if (where.length) {
        sql += ' WHERE ' + where.join(' AND ');
    }

    sql += ' ORDER BY name';

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

app.get('/api/categories', (req, res) => {
    db.all(
        'SELECT DISTINCT category FROM tools ORDER BY category',
        [],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            res.json(rows.map(r => r.category));
        }
    );
});

// ================= START SERVER =================
/*const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
*/
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
