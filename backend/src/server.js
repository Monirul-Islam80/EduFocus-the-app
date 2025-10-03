require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/message");
const userRoutes = require("./routes/user");
const auth = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/chat", auth, chatRoutes);
app.use("/api/message", auth, messageRoutes);
app.use("/api/user", auth, userRoutes);

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
    const roomInfo = io.sockets.adapter.rooms.get(room);
    const userCount = roomInfo ? roomInfo.size : 0;
    console.log(roomInfo);

    socket.to(room).emit("user joined", {
      userCount: userCount,
    });
    console.log("User Joined Room: " + room);
    socket.emit("joined confirmation", { userCount });
  });

  socket.on("typing", (room) => {
    io.to(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    io.to(room).emit("stop typing");
  });
  socket.on("leave room", (room) => {
    console.log(`Socket ${socket.id} left room ${room}`);
    socket.leave(room);
  });

  socket.on("new message", (newMessageRecieved) => {
    const chat = newMessageRecieved.chatModel;

    if (!chat || !chat.users) return console.log("chat.users not defined");
    chat.users.forEach((chatUser) => {
      if (chatUser.user.id === newMessageRecieved.sender.id) return;

      io.to(chatUser.user.id.toString()).emit(
        "new message notification",
        newMessageRecieved
      );

      // io.to(chat.id.toString()).emit("message recieved", newMessageRecieved);
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
