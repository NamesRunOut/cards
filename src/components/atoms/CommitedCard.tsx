import React, {useContext} from "react"
import {SocketContext} from "../../hooks/Socket";

const CommitedCard: React.FC<{ card: any, player: string, playerName: string, chosen: boolean, revealed: boolean }> = ({
                                                                                                                           card,
                                                                                                                           player,
                                                                                                                           playerName,
                                                                                                                           chosen,
                                                                                                                           revealed
                                                                                                                       }) => {
    const socket: any = useContext(SocketContext)

    const tzarPicked = (cardid: number) => {
        if (revealed) return
        socket.emit('tzarPicked', cardid);
    }

    if (card.card.type === 0 || card.card.type === 2) {
        return <div
            key={card.matchid}
            className="biggerCard"
            onClick={() => tzarPicked(card.matchid)}
            style={{opacity: chosen ? '1' : '0.5'}}>
            {card.card.text} {revealed ? `[${playerName}]` : ''}
        </div>
    } else if (card.card.type === 1) {
        return <div
            key={card.matchid}
            className="biggerCard"
            onClick={() => tzarPicked(card.matchid)}
            style={{backgroundImage: `url(${card.card.text})`, opacity: chosen ? '1' : '0.5'}}>
            {revealed ? `[${playerName}]` : ''}
        </div>
    }
    return <></>
}

export default CommitedCard