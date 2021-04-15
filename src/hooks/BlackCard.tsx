import React, {createContext, useContext, useEffect, useState} from 'react'
import {SocketContext} from "./Socket"
import {BlackCard as BlackCardType, BlackType} from "../types/Card";

export const BlackCardContext = createContext<BlackType>(0)

const BlackCard = (props: { children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined }) => {
    const socket = useContext(SocketContext)
    const [blackType, setBlackType] = useState<BlackType>(0)

    useEffect(() => {
        // @ts-ignore
        socket.on('blackCard', function (card: BlackCardType) {
            //console.log('Blackcard', card)
            setBlackType(card.type)
        });
    }, [socket]);

    return (
        <BlackCardContext.Provider value={blackType}>
            {props.children}
        </BlackCardContext.Provider>
    )
}

export {BlackCard}