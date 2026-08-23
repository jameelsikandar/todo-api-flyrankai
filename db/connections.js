import dotenv from 'dotenv';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

dotenv.config();

const dbPath = process.env.DB_PATH || './data/tasks.db';

const dir = path.dirname(dbPath);

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(dbPath);

export default db;