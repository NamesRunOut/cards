import React, {useContext, useState} from "react"

import {SocketContext} from '../../hooks/Socket'

const BlackCard = () => {
    const socket: any = useContext(SocketContext)
    const [canSkip, setCanSkip] = useState(true)

    const reroll = () => {
        socket.emit('reroll');
    }

    const vote = () => {
        socket.emit('vote');
    }

    const skip = () => {
        if (!canSkip) return;
        setCanSkip(false)
        socket.emit('skipBlack');
        setTimeout(function () {
            setCanSkip(true)
        }, 30000)
    }

    return (
        <>
            <div className="info_actions_action">
                <div>
                    <button type="button" onClick={reroll}>Reroll cards</button>
                </div>
                <div>Once per game you can reroll all your cards (it has to be on your turn and you can't be the tzar)
                </div>
            </div>
            <hr/>
            <div className="info_actions_action">
                <div>
                    <button type="button" onClick={vote}>Points to all!</button>
                </div>
                <div>(Usable on tzar turn) If everybody in the lobby presses this button (tzar included), everyone who
                    commited a card will be given a point
                </div>
            </div>
            <hr/>
            <div className="info_actions_action">
                <div>
                    <button type="button" onClick={skip} id="skipButton">Skip black</button>
                </div>
                <div>Skip the current black card (30s cooldown per person)</div>
            </div>
        </>
    );
}

export default BlackCard