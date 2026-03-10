import { Server, Socket } from 'socket.io'
import { CHAT_EVENTS } from '../../../shared/constant/chat.events'
import { chatHandler } from '../../DI/resolver'
import { ChatHandler } from '../handlers/chat.handler'
import { MessageDTO } from '../../../application/dtos/chat/requestDTOs/MessageDTO'



export class ChatEvents {
    private handler: ChatHandler

    constructor(private socket: Socket, private io: Server) {
        this.handler = chatHandler
        this.handler.setSocket(this.socket, this.io)
    }

    register() {
        this.socket.on(CHAT_EVENTS.JOIN_ROOM, (roomId: string) => {
            this.handler.handleJoinRoom(roomId)
        })

        this.socket.on(CHAT_EVENTS.SEND_MESSAGE,(data:MessageDTO)=>{
            this.handler.handleSendMessage(data)
        })

        this.socket.on(CHAT_EVENTS.TYPING,(roomId:string)=>{
            this.handler.handleTyping(roomId)
        })

        this.socket.on(CHAT_EVENTS.STOP_TYPING,(roomId:string)=>{
            this.handler.handleStopTyping(roomId)
        })
    }


}