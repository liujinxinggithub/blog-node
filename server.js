// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const postsDir = path.join(__dirname, "posts");

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

let comments = [];

app.get("/api/posts", (req, res) => {
  const posts = loadPosts();
  res.json(posts);
});

app.post("/api/comments", (req, res) => {
  comments.push(req.body.text);
  res.json({ success: true });
});

app.get("/api/comments", (req, res) => res.json(comments));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
