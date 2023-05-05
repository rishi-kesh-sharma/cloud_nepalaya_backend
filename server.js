const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const { authRouter, blogRouter, miscRouter } = require("./routes");
const { errorMiddlware } = require("./middlewares");
const { isAuthenticatedUser } = require("./middlewares/auth");

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the sever due to uncaught exception `);
  process.exit(1);
});

const app = express();

//ERROR MIDDLEWARE
app.use(errorMiddlware);

//CONFIGURE DOTENV
dotenv.config({ path: "./config.env" });
//static files

var moment = require("moment");
const SeedUser = require("./utils/SeedUser");
var shortDateFormat = "ddd @ h:mmA";
app.locals.moment = moment;
app.locals.shortDateFormat = shortDateFormat;

//using static files
const PORT = process.env.PORT || 4000;

//parse json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
app.use(cors());
app.use(cookieParser());

//database connection
require("./database/conn");

//all the routes

app.use("/api/auth", authRouter);
app.use("/api/blog", blogRouter);
app.use("/api/misc", isAuthenticatedUser, miscRouter);

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
