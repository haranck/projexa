import mongoose, { Document } from "mongoose";

export interface MessageDocument extends Document {
    roomId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    messageType: "text" | "image" | "video";
    content: string;
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
        enum: ["text", "image", "video"],
        default: "text"
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