const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const compression = require("compression");
const morgan = require("morgan");
const helmet = require("helmet");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const { Server } = require("socket.io");
const socket = require("./socket");

const adminRoute = require("./routes/admin");
const productRoute = require("./routes/products");
const authRoute = require("./routes/auth");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/orders");
const chatRoute = require("./routes/chat");
const User = require("./models/user");
dotenv.config();
const app = express();
app.set("trust proxy", 1);

const MONGODB_URI = process.env.MONGODB_URI;
mongoose.set("strictQuery", true);

app.use(
  cors({
    origin: [
      process.env.FRONTEND_ADMIN,
      process.env.FRONTEND_CLIENT,
      process.env.FRONTEND_LOCAL3000,
      process.env.FRONTEND_LOCAL3001,
    ],
    credentials: true,
  })
);

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flag: "a" }
);

app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));

//session
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      secure: true, //tắt đi test local,bật lên cho deployment
      maxAge: 1000 * 60 * 60,
      sameSite: 'none', //tắt đi test local,bật lên cho deployment
    },
  })
);

app.use((req, res, next) => {
  console.log("----------sessions.app.js71-------", req.session.userId);
  if (!req.session.userId) {
    return next();
  }
  User.findById(req.session.userId)
    .then((user) => {
      req.user = user;
      // console.log(req.user)
      next();
    })
    .catch((err) => console.log(err));
});

app.use(authRoute);
app.use(productRoute);
app.use("/cart", cartRoute);
app.use("/order", orderRoute);
app.use("/admin", adminRoute);
app.use("/chat", chatRoute);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    const server = app.listen(process.env.PORT || 5000);
    const io = new Server(server);
    socket(io);
  })
  .catch((err) => console.log(err));
