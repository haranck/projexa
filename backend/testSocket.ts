import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
    auth: {
        userId: "testUser123"
    }
});

socket.on("connect", () => {
    console.log("Connected to socket server");
    console.log("Socket ID:", socket.id);
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});