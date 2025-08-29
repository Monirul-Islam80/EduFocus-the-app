require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/message");
const auth = require("./middleware/auth");
const { Server } = require("socket.io");
const http = require("http");
const errorHandler = require("./middleware/errorHandler");
const { connected } = require("process");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/chat", auth, chatRoutes);
app.use("/api/message", auth, messageRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the EduFocus API");
});
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server listening on ${PORT}`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: { origin: "*", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData.id.toString());
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("new message", (newMessageRecieved) => {
    // console.log("New message received:", newMessageRecieved);

    const chat = newMessageRecieved.chatModel;

    if (!chat || !chat.users) {
      return console.log("chat.users not defined");
    }

    chat.users.forEach((chatUser) => {
      if (chatUser.user.id === newMessageRecieved.sender.id) return;
      console.log("sdljkfdkl");

      console.log(chatUser);

      socket
        .in(chatUser.userId.toString())
        .emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData.id);
  });
});
