import React, {createContext, useState} from 'react'
import io from "socket.io-client";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:4001"
//const socketClient = socketIOClient(ENDPOINT)
const client = io()

// @ts-ignore
export const SocketContext = createContext()

const Socket = (props: { children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) => {
    const [socket] = useState(client);//useState(socketClient);

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}

export {Socket}