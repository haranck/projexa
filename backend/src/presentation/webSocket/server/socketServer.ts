import { Server, Socket } from "socket.io";
import http from "http";
import { socketUserStore } from "../socket.user.store";
import { NotificationEvents } from "../events/notification.events";

let io: Server;

export const initSocket = (server: http.Server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
        },
    });

    console.log("socket server initialized")

    io.on('connection', (socket: Socket) => {

        const userId = socket.handshake.auth?.userId;
        if (!userId) {
            console.log('User not authenticated');
            return;
        }

        if (userId) {
            console.log(`User ${userId} connected with socket ${socket.id}`);
            socket.join(`user:${userId}`);
            socketUserStore.addUser(userId, socket.id);
        } 

        new NotificationEvents(socket, io).register();

        socket.on('disconnect', () => {
            console.log('user disconnected', socket.id);
            socket.leave(`user:${userId}`);
            socketUserStore.removeUser(userId);
        })

    })
    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket not initialized");
    }
    return io;
};