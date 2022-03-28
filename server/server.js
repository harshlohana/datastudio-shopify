require('dotenv').config();
const con = require("./connection/sqlConnector");
const express = require("express");
var session = require("express-session");
const next = require("next");
var cors = require("cors");
var morgan = require("morgan");
var path = require("path");
const passport = require("passport");
var rfs = require("rotating-file-stream");
var shopifyRouter = require("./routers/shopifyRouter");
var webhookRouter = require("./routers/webhookRouter");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(cors());
    server.use(express.json());
    server.use(
      express.urlencoded({
        extended: true,
      })
    );

        // required for passport
    server.use(
      session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
      })
    );

    server.use(passport.initialize());
    server.use(passport.session());

    var accessLogStream = rfs.createStream("data", {
      interval: "1d", // rotate daily
      path: path.join(__dirname, "logs"),
    });

    server.use(morgan("combined", { stream: accessLogStream }));

    server.use("/shopify",shopifyRouter);
    server.use("/webhook",webhookRouter);


    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, (err) => {
      if (err) throw err;
      console.log(`server ready on 3000`);
    });
  })
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  });
