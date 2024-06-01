const express = require("express");
const path = require("path");
const userRoute = require("./routes/user");
const mongoose = require("mongoose");
const cookiePaser = require("cookie-parser");
const { checkForAuthCookie } = require("./middleware/auth");
const userBlog = require("./routes/blog");
const Blog = require("./models/blog");

const app = express();
const PORT = 8000;
app.use(express.urlencoded({ extended: false }));
app.use(cookiePaser());
app.use(checkForAuthCookie("token"));

mongoose
  .connect("mongodb://127.0.0.1:27017/blogify")
  .then((e) => console.log("DataBase is Connected Sucessfully"));

app.set("view engine", "ejs");
app.set("views", path.resolve("views"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});

  res.render("home.ejs", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", userBlog);

app.listen(PORT, () => console.log(`server is started on ${PORT}`));
