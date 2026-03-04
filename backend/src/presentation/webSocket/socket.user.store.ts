class SocketUserStore {
    private users : Map<string,string> = new Map();

    addUser(userId:string,socketId:string) {
        this.users.set(userId,socketId)
    }

    removeUser(userId:string) {
        this.users.delete(userId)
    }

    getSocketId(userId:string) {
        return this.users.get(userId)
    }

}

export const socketUserStore = new SocketUserStore()