import io from "socket.io-client"; // Add this

let socket;

const connectSocket = (userId) => {
  socket = io("http://localhost:6790", {
    query: `userId=${userId}`,
  });
} // Add this -- our server will run on port 4000, so we connect to it from here

export {socket, connectSocket};
