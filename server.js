const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const marked = require("marked");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const postsDir = path.join(__dirname, "posts");
const commentsFile = path.join(__dirname, "comments.json");

// 加载帖子
function loadPosts() {
  const files = fs.readdirSync(postsDir).filter(file => file.endsWith(".md"));
  const posts = {};

  files.forEach(file => {
    const slug = path.basename(file, ".md");
    const content = fs.readFileSync(path.join(postsDir, file), "utf-8");
    const title = content.split("\n")[0].replace(/^# /, "") || slug;
    posts[slug] = { title, content };
  });

  return posts;
}

// 加载评论数据
function loadComments() {
  if (fs.existsSync(commentsFile)) {
    const data = fs.readFileSync(commentsFile, "utf-8");
    return JSON.parse(data);
  }
  return {};  // 如果没有评论数据文件，则返回空对象
}

// 保存评论数据
function saveComments(comments) {
  fs.writeFileSync(commentsFile, JSON.stringify(comments, null, 2), "utf-8");
}

// 获取所有帖子
app.get("/api/posts", (req, res) => {
  const posts = loadPosts();
  res.json(posts);
});

// 获取评论
app.get("/api/comments/:slug", (req, res) => {
  const comments = loadComments();
  const slug = req.params.slug;
  res.json(comments[slug] || []);
});

// 添加评论
app.post("/api/comments/:slug", (req, res) => {
  const comments = loadComments();
  const slug = req.params.slug;
  const { text, username } = req.body;

  // 检查是否有该帖子评论记录，如果没有则创建
  if (!comments[slug]) {
    comments[slug] = [];
  }

  // 添加新的评论
  const comment = {
    username: username || "Anonymous",
    text,
    timestamp: new Date().toISOString(),
  };
  comments[slug].push(comment);

  // 保存更新后的评论数据
  saveComments(comments);

  res.json({ success: true });
});

// 渲染首页
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 启动服务器
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
