const { ESRCH } = require("constants");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidv4 } = require("uuid");

const port = process.env.PORT || 3000;

app.set("view-engine", "ejs");

app.use(express.static("public"));

app.use("/room/:id", express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/room", (req, res) => {
  res.redirect(`/room/${uuidv4()}`);
});

app.get("/room/:id", (req, res) => {
  let theroomid = req.params.id;
  res.render("room.ejs", { roomId: theroomid, userId: uuidv4() });
});

// app.get('/:room', (req, res) => {
//   res.render('room', { roomId: req.params.room })
// })

userIdlist = [];

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
  });
});

io.on("connection", (socket) => {
  socket.on("join-room", (userId, roomId) => {
    console.log(`User ${userId} Joined room ${roomId}`);

    if (userIdlist.length === 1) {
      let admin = userIdlist[0];
      console.log("admin: ", admin);
    }

    userIdlist.push(userId);
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("new-member", userId);
    theroomid = roomId;
    console.log("roodID: ", theroomid);
  });

  // Recieving updates from user
  socket.on("update_canvas", function (data) {
    //  store all drawings indev*
    const history = [];

    history.push(data);

    // socket.emit('update_canvas',item);

    for (let item of history) socket.to(theroomid).emit("update_canvas", item);

    // send updates to all sockets except sender
    socket.to(theroomid).emit("update_canvas", data);
    //   socket.emit('update_canvas',data);
  });
});

server.listen(port);
