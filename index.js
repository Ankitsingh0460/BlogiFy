const express = require("express");
const path = require("path");
const userRoute = require("./routes/user");
const mongoose = require("mongoose");

const app = express();
const PORT = 8000;
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect("mongodb://127.0.0.1:27017/blogify")
  .then((e) => console.log("DataBase is Connected Sucessfully"));

app.set("view engine", "ejs");
app.set("views", path.resolve("views"));
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.use("/user", userRoute);

app.listen(PORT, () => console.log(`server is started on ${PORT}`));
