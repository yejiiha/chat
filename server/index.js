const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const cors = require("cors");
const mongoose = require("mongoose");
const { merge } = require("./routes/users");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");
const { Chat } = require("./models/Chat");

const app = express();
const httpServer = http.createServer(app);
const io = require("socket.io")(httpServer, { cors: { origin: "*" } });

app.use(cors());
app.get("/products/:id", function (req, res, next) {
  res.json({ msg: "This is CORS-enabled for all origins!" });
});
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

app.listen(80, function () {
  console.log("CORS-enabled web server listening on port 80");
});

app.use("/api/users", require("./routes/users"));
app.use("/api/chat", require("./routes/chat"));

io.on("connection", (app) => {
  app.emit("request" /* … */); // emit an event to the app
  app.on("Input Chat Message", (msg) => {
    connect.then((db) => {
      try {
        let chat = new Chat({
          message: msg.chatMessage,
          sender: msg.userID,
          type: msg.type,
        });
        chat.save((err, doc) => {
          if (err) return res.json({ sucess: false, err });

          Chat.find({ _id: doc._id })
            .populate("sender")
            .exec((err, doc) => {
              return io.emit("Output Chat Message", doc);
            });
        });
      } catch (error) {
        console.log(error);
      }
    });
  });
});

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!~~ "));
app.get("/api/hello", (req, res) => res.send("Hello World!~~ "));

const port = 5000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
