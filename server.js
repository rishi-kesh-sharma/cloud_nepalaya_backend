const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const formidableMiddleware = require("express-formidable");
const dotenv = require("dotenv");
const {
  auth,
  user,
  blog,
  misc,
  contact,
  FAQ,
  testimonial,
  service,
  quote,
} = require("./routes");
const { error } = require("./middlewares");
const {
  isAuthenticated,
  isAuthorized,
  authorizeRoles,
} = require("./middlewares/auth");

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the sever due to uncaught exception `);
  process.exit(1);
});

const app = express();

//ERROR MIDDLEWARE
app.use(error);

//CONFIGURE DOTENV
dotenv.config({ path: "./config.env" });
//static files
var moment = require("moment");
var shortDateFormat = "ddd @ h:mmA";
app.locals.moment = moment;
app.locals.shortDateFormat = shortDateFormat;

//using static files
const PORT = process.env.PORT || 4000;
//parse json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
// app.use(formidableMiddleware());
app.use(cors({ origin: "http://cloudnepalaya.com" }));
app.use(cookieParser());
app.use("/public", express.static("public"));
// multer configuration

//database connection
require("./database/conn");

//all the routes

app.use("/api/auth", auth);
app.use("/api/user", isAuthenticated, user);
app.use("/api/blog", blog);
app.use("/api/contact", contact);
app.use("/api/faq", FAQ);
app.use("/api/testimonial", testimonial);
app.use("/api/service", service);
app.use("/api/quote", quote);
app.use(
  "/api/misc",
  isAuthenticated,
  authorizeRoles("superadmin admin guest"),
  misc
);

//listening to the server
app.listen(PORT, () => {
  console.log("server running in port " + PORT);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the sever due to unhandled promise  rejection `);
  app.close(() => {
    process.exit(1);
  });
});
