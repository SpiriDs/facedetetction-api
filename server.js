const express = require("express");
const bodyParser = require("body-parser");
const knex = require("knex");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  client: "pg",
  connection: {
    host: "postgresql-globular-18448",
    user: "spirids",
    password: "P12345",
    database: "smartbrain",
  },
});

db.select("*")
  .from("users")
  .then((data) => {
    console.log(data);
  });

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("it is working!");
});

/* Sign In Post*/
app.post("/signin", signin.handleSignin(db, bcrypt)); //Andere Art des Aufrufs, es wird die funktion mit db, bcrypt aufgerufen und in signin.js ruft dies funktion die funktion mit (req,res aufgerufen)

/* Register Post */
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

/* Profile mit user id */
app.get("/profile/:id", (req, res) => {
  profile.handleGetProfile(req, res, db);
});

/* /image --> PUT = user :update */
app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});
app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("====================================");
  console.log("app is running on port 3000");
  console.log("====================================");
});
