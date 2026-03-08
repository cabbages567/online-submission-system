# 🌐 多人投稿系统

一个完整的在线投稿系统，支持多人同时使用。

## 🚀 功能特性
- 📝 用户在线投稿
- 👥 支持多人同时使用
- 🔧 管理员后台审核
- 📱 响应式设计
- 💾 数据库存储
- 🌍 全球可访问

## 📁 项目结构
online-submission-system/

├── README.md           # 项目说明（本文件）

├── .gitignore         # Git忽略配置

├── frontend/          # 前端页面

│   ├── index.html     # 用户投稿页面

│   └── admin.html     # 管理后台

└── backend/           # 后端服务

├── server.js      # 服务器代码

├── package.json   # 依赖配置

└── .env.example   # 环境变量示例
## 🚀 快速开始

### 1. 安装Node.js
如果没有安装，先访问 https://nodejs.org 下载安装

### 2. 安装依赖
bash

cd backend

npm install
### 3. 配置数据库
1. 安装MySQL数据库
2. 创建数据库：`submission_db`
3. 复制 `.env.example` 为 `.env`
4. 修改 `.env` 中的数据库信息

### 4. 启动服务
bash

启动后端

cd backend

node server.js

前端直接在浏览器打开

frontend/index.html
### 5. 访问系统
- 🌐 用户投稿：http://localhost:3000
- 🔧 管理后台：http://localhost:3000/admin.html
- 🔑 管理员账号：admin / admin123

## ☁️ 在线部署

### 后端部署（Railway）
1. 访问 https://railway.app
2. 连接GitHub账号
3. 导入项目
4. 部署 `backend` 文件夹
5. 配置环境变量

### 前端部署（Vercel）
1. 访问 https://vercel.com
2. 导入项目
3. 部署 `frontend` 文件夹
4. 修改API地址

### 数据库（免费）
- Railway Database
- PlanetScale
- Supabase

## 📱 使用说明

### 用户投稿
1. 访问投稿页面
2. 填写标题、作者、内容
3. 点击提交
4. 等待审核结果

### 管理员操作
1. 访问管理后台
2. 输入密码：admin123
3. 查看所有投稿
4. 审核稿件（录用/退稿）

## 🔧 技术栈
- 前端：HTML5, CSS3, JavaScript, Bootstrap
- 后端：Node.js, Express
- 数据库：MySQL
- 部署：GitHub, Railway, Vercel

## 📞 支持
如有问题，请：
1. 检查控制台错误
2. 查看服务器日志
3. 提交Issue

## 📄 许可证
MIT License - 可自由使用和修改
