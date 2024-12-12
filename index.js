import express from "express";

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("main");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
