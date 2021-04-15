import React, {createContext, useContext, useEffect, useState} from 'react'
import {SocketContext} from "./Socket";
import {BlackCardContext} from "./BlackCard";
import {handleHighlight, handlePlayedCards} from "../functions/playedCards";

import {BlackType, CardPlayed} from '../types/Card'

export const CardsPlayedContext = createContext<any>([[],])

const CardsPlayed = (props: { children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) => {
    const socket: any = useContext(SocketContext)
    const blackType: BlackType = useContext(BlackCardContext)

    const [cards, setCards] = useState<Array<CardPlayed>>([])
    const [tmpcards, settmpcards] = useState<Array<CardPlayed>>([])

    useEffect(() => {
        setCards([...tmpcards])
    }, [tmpcards])

    useEffect(() => {
        socket.off('highlightCard').on('highlightCard', (cardid: number, players: any) => handleHighlight(cardid, players, cards, setCards, settmpcards, blackType))
    }, [cards])

    useEffect(() => {
        socket.on('playedCards', (playedCards: any, type: BlackType) => handlePlayedCards(playedCards, type, cards, setCards, settmpcards, blackType))
        //socket.on('highlightCard', (cardid, players) => handleHighlight(cardid, players))
    }, [])

    return (
        <CardsPlayedContext.Provider value={[cards, setCards]}>
            {props.children}
        </CardsPlayedContext.Provider>
    )
}

export {CardsPlayed}