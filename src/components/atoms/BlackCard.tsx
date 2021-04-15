import React, {useContext, useEffect, useState} from "react"
import {SocketContext} from '../../hooks/Socket'
import {BlackCard as BlackCardType} from "../../types/Card";

const BlackCard = () => {
    const socket: any = useContext(SocketContext)
    const [black, setBlack] = useState<BlackCardType>({
        id: 0,
        text: 'Questions will appear here, answer with one (or more) of your cards',
        type: 0
    })

    useEffect(() => {
        socket.on('blackCard', (card: BlackCardType) => {
            setBlack({
                id: card.id,
                text: card.text,
                type: card.type
            })
        });
    }, [socket]);

    return (
        <div id="blackCard">
            <div className="biggerCard blackCard">
                {black.text}
            </div>
        </div>
    );
}

export default BlackCard