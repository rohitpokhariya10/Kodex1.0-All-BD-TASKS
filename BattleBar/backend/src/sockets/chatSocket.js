// This function handles all chat-related Socket.IO events.
// We receive `io` from server.js so we can listen for socket connections
// and broadcast messages to all connected users.
const chatSocket = (io) => {
  // This array stores chat messages temporarily in server memory.
  // Important: If the backend server restarts, this array will become empty.
  // For now, this is okay because we are not using MongoDB for chat history.
  let messages = [];

  // This event runs whenever a new user connects to the Socket.IO server.
  io.on("connection", (socket) => {
    console.log("User came in chat", socket.id);

    // Send previous chat messages only to the newly connected user.
    // Example: If user joins late, they can still see old messages.
    socket.emit("chatHistory", messages);

    // This event listens when frontend sends a new chat message.
    // Frontend will send data like:
    // {
    //   text: "GG",
    //   team: "blue"
    // }
    socket.on("sendMessage", (messageData) => {
      console.log("messageData comes from frontend -->", messageData);

      // Safely get the message text and remove extra spaces.
      // Optional chaining prevents backend crash if text is missing.
      const text = messageData?.text?.trim();

      // Get the team of the sender.
      // Example: "blue" or "red"
      const team = messageData?.team;

      // If message text is empty, do not save or send anything.
      if (!text) return;

      // Create a proper message object.
      // This object will be stored in messages array
      // and sent to all connected users.
      const newMessage = {
        id: `${Date.now()}-${socket.id}`, // Unique message id
        text, // Actual message text
        team, // Sender team: blue/red
        senderId: socket.id, // Socket id of the user who sent the message
        createdAt: new Date().toISOString(), // Message created time
      };

      // Save the new message in temporary server memory.
      messages.push(newMessage);

      // Keep only the latest 50 messages.
      // If messages become more than 50, remove the oldest message.
      if (messages.length > 50) {
        messages.shift();
      }

      // Send this new message to all connected users.
      // Everyone will receive this message in real time.
      io.emit("chatMessage", newMessage);
    });

    // This event runs when a user disconnects from the socket server.
    socket.on("disconnect", (reason) => {
      console.log("User left from chat", reason, socket.id);
    });
  });
};

module.exports = chatSocket;