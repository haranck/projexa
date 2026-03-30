class SocketUserStore {
    private users : Map<string,{socketId:string,connectedAt:number}> = new Map();

    addUser(userId:string,socketId:string) {
        this.users.set(userId,{socketId,connectedAt: Date.now()})
    }

    removeUser(userId:string) {
        const user = this.users.get(userId);
        this.users.delete(userId)
        return user
    }

    getSocketId(userId:string) {
        return this.users.get(userId)
    }

}

export const socketUserStore = new SocketUserStore()