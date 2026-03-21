import { Server, Socket } from "socket.io";
import http from "http";
import { socketUserStore } from "../socket.user.store";
import { NotificationEvents } from "../events/notification.events";
import { ChatEvents } from "../events/chat.events";
import { redisClient } from "../../../infrastructure/cache/redisClient";
import { container } from "tsyringe";
import { IUserActivityRepository } from "../../../domain/interfaces/repositories/UserActivity/IUserActivityRepository";
import { CHAT_EVENTS } from "../../../shared/constant/chat.events";

let io: Server;

export const initSocket = (server: http.Server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
        },
    });

    console.log("socket server initialized")

    io.on('connection', async (socket: Socket) => {

        const userId = await socket.handshake.auth?.userId;
        if (!userId) {
            console.log('User not authenticated');
            return;
        }

        if (userId) {
            console.log(`User ${userId} connected with socket ${socket.id}`);
            socket.join(`user:${userId}`);
            socketUserStore.addUser(userId, socket.id);
            await redisClient.set(`online:${userId}`, "true");
            socket.broadcast.emit(CHAT_EVENTS.USER_ONLINE, { userId });
        }

        new NotificationEvents(socket, io).register();
        new ChatEvents(socket, io).register();

        socket.on('disconnect', async () => {
            console.log('user disconnected', socket.id);
            socket.leave(`user:${userId}`);
            const user = socketUserStore.removeUser(userId);

            if (user) {
                const duration = Date.now() - user.connectedAt;
                const userActivityRepo = container.resolve<IUserActivityRepository>("IUserActivityRepository");
                await userActivityRepo.updateUserActivity(userId, duration);
                await redisClient.del(`online:${userId}`);
                socket.broadcast.emit(CHAT_EVENTS.USER_OFFLINE, { userId });
            }
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