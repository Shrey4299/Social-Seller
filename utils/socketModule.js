const socketIo = require("socket.io");

module.exports = function (httpServer) {
  const io = socketIo(httpServer);

  io.on("connection", (socket) => {
    socket.emit("hello", 1, "2", "hey baby");
    // socket.on("ping", (count) => {
    //   console.log(count);
    // });
    socket.on("update item", (arg1, arg2, callback) => {
      console.log(arg1); // 1
      console.log(arg2); // { name: "updated" }
      callback({
        status: "ok",
      });
    });
    socket.on("paymentSelected", (arg) => {
      console.log(arg); // world
    });

    socket.on("server_initialized", (message) => {
      console.log(message); // This will be executed upon server initialization
    });
  });

  // Emit an event upon initialization
  io.emit("server_initialized", "Socket.io server is initialized");

  return io; // Return the Socket.io server instance
};
