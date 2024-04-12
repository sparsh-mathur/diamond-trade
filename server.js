const express = require("express");
const cors = require("cors");

const app = express();
require("dotenv").config();
var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database
const db = require("./app/models");

// db.sequelize.sync();
//force: true will drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and Resync Database with { force: true }");
//   initial();
// });

// simple route
app.get("/health", (req, res) => {
  res.json({ message: "Welcome to diamond application." });
});

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// routes
require("./app/routes/user.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/diamond.routes")(app);
require("./app/routes/news.routes")(app);

// set port, listen for requests
const PORT = process.env.SERVER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  var bcrypt = require("bcryptjs");

  db.user.create({
    username: "admin",
    email: "admin@gmail.com",
    password: bcrypt.hashSync("admin", 8),
  });
}
