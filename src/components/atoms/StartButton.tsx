import React, {useContext} from "react";

import {SocketContext} from '../../hooks/Socket'

const StartButton: React.FC<{ response: boolean }> = ({response}) => {
    const socket: any = useContext(SocketContext)

    const startGame = () => {
        socket.emit('start');
    }

    return (
        <button type="button" id="startButton" onClick={startGame} disabled={response}>START</button>
    );
}

export default StartButton