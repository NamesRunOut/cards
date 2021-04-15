import React, {useContext} from "react";

import {SocketContext} from '../../hooks/Socket'

const Points: React.FC<{ response: boolean }> = ({response}) => {
    const socket: any = useContext(SocketContext)

    const setPoints = () => {
        // @ts-ignore
        let number = document.getElementById("pointsInput")?.value || 5
        if (number) socket.emit('setPoints', number)
    }

    return (
        <div className="navbar_points">
            Score limit:
            <select id="pointsInput" defaultValue='5'>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
            </select>
            <div>
                <button type="button" id="pointsButton" onClick={setPoints} disabled={response}>Select</button>
            </div>
        </div>
    );
}

export default Points