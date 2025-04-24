fetch("/api/posts")
  .then(res => res.json())
  .then(posts => {
    const list = document.getElementById("post-list");
    Object.entries(posts).forEach(([key, post]) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="post.html?slug=${key}">${post.title}</a>`;
      list.appendChild(li);
    });
  });
