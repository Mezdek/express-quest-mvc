const connection = require("./db-config");
const express = require("express");
const app = express();

const moviesRouter = require("./controllers/movies");
const usersRouter = require("./controllers/users");

const port = process.env.PORT || 3000;

connection.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
  } else {
    console.log("connected as id " + connection.threadId);
  }
});

app.use(express.json());

app.use("/api/movies", moviesRouter);
app.use("/api/users", usersRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
