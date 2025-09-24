import express from "express"
import path, {dirname} from "path";
import { fileURLToPath } from "url";
import blogs from "./blogs.js";
import userList from "./users.js";
import fs from "fs"


const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;
var currUser = "";

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index.ejs", {currUser});
})

app.get("/user", (req, res) => {
    res.render("userProfile.ejs", {currUser});
})

app.get("/api/blogs", (req, res) => {
  res.json(blogs);
});


app.get("/createyourpost", (req, res) => {
    res.render("createBlog.ejs", {currUser});
})

app.get("/signup", (req, res) => {
    res.render("signup.ejs");
})

app.get("/login", (req, res) => {
    res.render("login.ejs");
})

app.get("/myBlogs", (req, res) => {
    if (!currUser || !currUser.name) {
     return res.redirect("/login"); 
    }
    const userBlogs = blogs.filter(blog => blog.author === currUser.name);
    res.render("myBlogs.ejs", { currUser, userBlogs });
});

app.delete("/deleteblog/:title", (req, res) => {
    const title = req.params.title;
    const index = blogs.findIndex(b => b.title === title && b.author === currUser.name);
    if (index !== -1) {
        blogs.splice(index, 1);
        const fileContent = `const blogs = ${JSON.stringify(blogs, null, 2)};\n\nexport default blogs;`;
        fs.writeFileSync(path.join(__dirname, "blogs.js"), fileContent);
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, message: "Blog not found" });
    }
});


app.post("/signup", (req, res) => {
    const { username, name, email, password} = req.body;
    userList.push({username, name, email, password});

    let fileContent = `const userList = ${JSON.stringify(userList, null, 2)};\n\nexport default userList;`;
    fs.writeFileSync(path.join(__dirname, "users.js"), fileContent);
    currUser = {username, name, email, password};
    res.redirect('/user');
})

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = userList.find(u => u.username === username && u.password === password);

  if (user) {
    currUser = user;
    res.redirect("/user");
  } else {
    res.status(401).send("Invalid username or password");
  }
});

app.post("/createyourpost", (req, res) => {
    const { author, title, bodyText} = req.body;
    blogs.push({author, title, bodyText});
    console.log("New Blog Added:", { author, title, bodyText });

    let fileContent = `const blogs = ${JSON.stringify(blogs, null, 2)};\n\nexport default blogs;`;
    fs.writeFileSync(path.join(__dirname, "blogs.js"), fileContent);
    res.redirect('/user');
})

app.listen(PORT, () => {
    console.log(`Server listening on Port ${PORT}`);
})

