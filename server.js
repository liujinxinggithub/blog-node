// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const posts = {
  "hello-world": { title: "你好，世界", content: "# 欢迎来到我的博客\n\n这是我写的第一篇文章，使用 **Markdown** 撰写，支持标题、列表、代码等格式。\n\n## 小节\n- 点1\n- 点2\n\n> 喜欢就评论一条吧！" },
  "qt-performance": { title: "Qt 性能优化技巧", content: "# Qt 性能优化技巧\n\n整理 Qt 开发中常用的优化方法，包括 UI 渲染、事件处理、多线程使用等。\n\n## 优化点\n1. 使用 setUpdatesEnabled\n2. 减少频繁重绘\n3. 使用 QTimer 批处理事件" }
};

let comments = [];

app.get("/api/posts", (req, res) => res.json(posts));

app.post("/api/comments", (req, res) => {
  comments.push(req.body.text);
  res.json({ success: true });
});

app.get("/api/comments", (req, res) => res.json(comments));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
