import {useQuery} from '@tanstack/react-query'
import { getChatRoom, getMessages } from '../../services/Chat/ChatService'

export const useChatRoom = (projectId:string) => {
    return useQuery({
        queryKey: ["chat-room", projectId],
        queryFn: () => getChatRoom(projectId),
        enabled: !!projectId
    })
}

export const useMessages = (roomId:string) => {
    return useQuery({
        queryKey: ["messages", roomId],
        queryFn: () => getMessages(roomId),
        enabled: !!roomId
    })
}
