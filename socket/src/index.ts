import { WebSocketServer,WebSocket } from "ws";

const wss = new WebSocketServer({port:8080});

interface User{
    socket: WebSocket;
    room:string
}

let allsockets:User[] = []

wss.on("connection",(socket)=>{


    socket.on("message",(message)=>{
        const parsedMessage = JSON.parse(message as unknown as string);
        if (parsedMessage.type === "join"){
            allsockets.push({
                socket,
                room:parsedMessage.payload.roomId
            })
        }
        if(parsedMessage.type === "chat"){
            const currentUserRoom = allsockets.find((x)=> x.socket == socket)?.room;
            
            allsockets.forEach(socketObj => {
                if (socketObj.room === currentUserRoom) {
                    socketObj.socket.send(parsedMessage.payload.message);
                }
            });

        }

    })

    

})

