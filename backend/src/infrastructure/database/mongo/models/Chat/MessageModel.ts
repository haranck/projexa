import mongoose, { Document } from "mongoose";

export interface MessageDocument extends Document {
    roomId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    messageType: "text" | "image" | "video" | "document";
    content: string;
    readBy: mongoose.Types.ObjectId[];
    isDeleted: boolean;
    createdAt: Date;
    updatedAt:Date;
}

const MessageSchema = new mongoose.Schema<MessageDocument>(
{
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatRoom",
        required: true
    },

    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    messageType: {
        type: String,
        enum: ["text", "image", "video", "document"],
        default: "text"
    },

    readBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },

    content: {
        type: String,
        required: true
    },

    isDeleted: {
        type: Boolean,
        default: false
    }

},
{ timestamps: true }
);

export const MessageModel = mongoose.model<MessageDocument>(
    "Message",
    MessageSchema
);