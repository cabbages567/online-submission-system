// 后端服务器 - 支持多人同时使用
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  port: process.env.DB_PORT || 3306,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'submission_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 初始化数据库
async function initDB() {
  const conn = await pool.getConnection();
  try {
    // 创建投稿表
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(200) NOT NULL,
        author VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        content TEXT NOT NULL,
        category VARCHAR(50),
        status ENUM('pending', 'reviewing', 'accepted', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45)
      )
    `);
    
    // 创建管理员表
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL
      )
    `);
    
    // 创建默认管理员 (密码: admin123)
    await conn.execute(`
      INSERT IGNORE INTO admins (username, password) 
      VALUES ('admin', '$2b$10$7Un/LoB.WHnC1tF6gV.8eOVfZ6nTqL7k8bRcJm9pQwXyZvA0sH1G2C')
    `);
    
    console.log('✅ 数据库初始化完成');
  } finally {
    conn.release();
  }
}

// 1. 提交投稿
app.post('/api/submit', async (req, res) => {
  try {
    const { title, author, email, content, category } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    await pool.execute(
      `INSERT INTO submissions (title, author, email, content, category, ip_address) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, author, email, content, category, ip]
    );
    
    res.json({ success: true, message: '投稿成功！' });
  } catch (err) {
    res.status(500).json({ error: '提交失败' });
  }
});

// 2. 获取投稿列表（公开，只显示已录用的）
app.get('/api/submissions', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, title, author, category, created_at 
       FROM submissions 
       WHERE status = 'accepted'
       ORDER BY created_at DESC 
       LIMIT 50`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: '获取失败' });
  }
});

// 3. 管理员登录
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    res.json({ token: 'admin-token-123', role: 'admin' });
  } else {
    res.status(401).json({ error: '账号或密码错误' });
  }
});

// 4. 管理员获取所有投稿
app.get('/api/admin/submissions', async (req, res) => {
  const token = req.headers.authorization;
  if (token !== 'Bearer admin-token-123') {
    return res.status(401).json({ error: '未授权' });
  }
  
  const [rows] = await pool.execute(
    `SELECT * FROM submissions ORDER BY created_at DESC`
  );
  res.json(rows);
});

// 5. 管理员更新状态
app.put('/api/admin/submissions/:id', async (req, res) => {
  const token = req.headers.authorization;
  if (token !== 'Bearer admin-token-123') {
    return res.status(401).json({ error: '未授权' });
  }
  
  const { status } = req.body;
  await pool.execute(
    `UPDATE submissions SET status = ? WHERE id = ?`,
    [status, req.params.id]
  );
  
  res.json({ success: true });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🚀 服务器运行在端口 ${PORT}`);
  await initDB();
});
