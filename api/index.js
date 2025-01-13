const express = require("express");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const authRoute = require("../routes/auth.route");
const telegramRoute = require("../routes/telegram.route");
const UserRoute = require("../routes/users.route");
const UnitRoute = require("../routes/units.route");
const PositionRoute = require("../routes/positions.route");
const connect = require("../db/connect");
const bodyParser = require('body-parser');
require("dotenv").config(); // Load .env
require("dotenv").config({ path: ".env.development.local" }); // Override with .env.development.local

app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use a secure secret key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }, // Configure cookie options
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), // Optionally store sessions in MongoDB
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(passport.initialize());
// app.use(passport.session());
// var GoogleStrategy = require('passport-google-oauth20').Strategy;
// passport.use(new GoogleStrategy({
//     clientID: GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://www.example.com/auth/google/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));
app.get('/',(req,res) => {
  res.json({msg: 'welcome to unit api'})
})
app.use("/api/v1", [
  authRoute,
  telegramRoute,
  UserRoute,
  UnitRoute,
  PositionRoute,
]);
const port = process.env.PORT || 3000;

// a function to start the server  and listen to the port defined
const start = async () => {
  try {
    await connect(process.env.MONGO_URI).then(() =>
      console.log("mongodb started")
    );
    app.listen(port, () => console.log(`server is running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

// call the start function
start();

module.exports = app;
