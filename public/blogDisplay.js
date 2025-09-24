const boxes = document.querySelectorAll(".box");

async function loadBlogs() {
  try {
    const res = await fetch("/api/blogs");
    const blogs = await res.json();
    const shuffledUsers = blogs.sort(() => 0.5 - Math.random());

    const n = Math.min(boxes.length, shuffledUsers.length);
    for (let i = 0; i < n; i++) {
      const blog = shuffledUsers[i];
      boxes[i].innerHTML = `
        <p class="title">${blog.title}</p>
        <p class="body">${blog.bodyText}</p>
        <span class="author">- By ${blog.author}</span>
      `;
    }
  } catch (err) {
    console.error("Error fetching blogs:", err);
  }
}

loadBlogs();
