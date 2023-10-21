const { server } = require("../../../../http");
const initializeSocketServer = require("../../../../utils/socketModule"); // Make sure to adjust the path if needed

exports.sendSampleMessage = (req, res) => {
  const io = initializeSocketServer(server);
  io.emit("sampleMessage", "hey baby");
  // io.on("connection", (socket) => {
  //   socket.emit("hello", 1, "2", "hey baby");

  //   socket.on("server_initialized", (message) => {
  //     console.log(message); // This will be executed upon server initialization
  //   });
  // });
  res.send("hii");
};
