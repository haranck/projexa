import mongoose, { Document } from "mongoose";

export interface ChatDocument extends Document {
    projectId: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
    lastMessage?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const chatRoomSchema = new mongoose.Schema<ChatDocument>({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        required: true
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        required: false
    }
}, { timestamps: true });

export const ChatRoomModel = mongoose.model<ChatDocument>("ChatRoom", chatRoomSchema);
