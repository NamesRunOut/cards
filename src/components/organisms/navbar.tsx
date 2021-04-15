import React, {useContext, useEffect, useState} from "react";

import {SocketContext} from '../../hooks/Socket'
import StartButton from "../atoms/StartButton";
import Points from "../molecules/Points";
import Decks from "../molecules/Decks";
import DragButton from "../atoms/DragButton";

const Navbar = () => {
    const socket: any = useContext(SocketContext)
    const [response, setResponse] = useState(false)

    useEffect(() => {
        socket.on("startEnable", function (data: string) {
            setResponse(false)
        })
        socket.on("startDisable", function (data: string) {
            setResponse(true)
        })
    }, [socket]);

    return (
        <div className="navbar" id="player">
            <StartButton response={response}/>
            <Points response={response}/>
            <Decks response={response}/>
            <DragButton/>
        </div>
    );
}

export default Navbar