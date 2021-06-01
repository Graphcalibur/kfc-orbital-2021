require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
//var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var passport = require("passport");
var session = require("express-session");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var apiRouter = require("./routes/api");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors({ credentials: true, origin: true }))
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.static(path.join(__dirname, "..", "client", "build")));

app.use(session({secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true, cookie: {secure: false}}));
app.use(passport.initialize());
app.use(passport.session());

/* Middleware for panic debugging when sessions go wrong
app.use(function(req, res, next) {
    console.log(req.sessionID);
    console.log(req.cookies);
    console.log(req.headers.cookie);
    next();
});
*/

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", apiRouter);

app.get("*", (req, res) => 
    {res.sendFile(path.join(__dirname,  "..", "client", "build", "index.html"));}
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

