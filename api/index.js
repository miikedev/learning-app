const express = require("express");
const app = express();
const welcomeRoute = require("../routes/welcome.route");
const authRoute = require("../routes/auth.route");
const connect = require('../db/connect')
require('dotenv').config()
app.use(express.json())

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
app.use("/", welcomeRoute);
app.use("/api/v1", authRoute)
const port = process.env.PORT || 3000
// a function to start the server  and listen to the port defined
const start = async () => {
  try {
    await connect(process.env.MONGO_URI).then(() => console.log('mongodb started'));
    app.listen(port, () => console.log(`server is running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

// call the start function
start();