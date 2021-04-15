import React, {createContext, useContext, useEffect, useState} from 'react'
import {SocketContext} from "./Socket";
import {BlackCardContext} from "./BlackCard";
import {Card, CardSauce, WhiteCard} from "../types/Card";

export const PlayerCardsContext = createContext<any>([])

const PlayerCards = (props: { children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) => {
    const blackType: number = useContext(BlackCardContext)
    const socket: any = useContext(SocketContext)

    const [whiteCards, setWhiteCards] = useState<Array<WhiteCard>>([])
    const [message, setMessage] = useState<string | null>(null)
    const [loader, setLoader] = useState<boolean>(false)

    const [commit, setCommit] = useState({
        canCommit: true,
        commitCount: 0
    })

    const [tmp, setTmp] = useState<WhiteCard>({
        card: {
            cardid: -1,
            matchid: -1
        },
        sauce: {
            id: -1,
            text: "Example Card",
            type: 0
        }
    })

    const cardCommited = (cardid: number, cardSauceid: number) => {
        //console.log(commit.commitCount, commit.canCommit, blackType)

        let tmpWhite = [...whiteCards]
        if (tmpWhite.length === 0 || !commit.canCommit) return

        switch (blackType) {
            case 0:
                if (commit.commitCount >= 0)
                    setCommit({
                        canCommit: false,
                        commitCount: commit.commitCount
                    })
                else
                    setCommit({
                        canCommit: commit.canCommit,
                        commitCount: commit.commitCount + 1
                    })
                break;
            case 2:
                if (commit.commitCount >= 1)
                    setCommit({
                        canCommit: false,
                        commitCount: commit.commitCount
                    })
                else
                    setCommit({
                        canCommit: commit.canCommit,
                        commitCount: commit.commitCount + 1
                    })
                break;
            case 3:
                if (commit.commitCount >= 2)
                    setCommit({
                        canCommit: false,
                        commitCount: commit.commitCount
                    })
                else
                    setCommit({
                        canCommit: commit.canCommit,
                        commitCount: commit.commitCount + 1
                    })
                break;
        }

        for (let i = 0; i < tmpWhite.length; i++) {
            if (tmpWhite[i].card === undefined) {
                tmpWhite.splice(i, 1)
                continue
            }
            if (cardid === tmpWhite[i].card.matchid)
                tmpWhite.splice(i, 1)
        }
        setWhiteCards([...tmpWhite])
        socket.emit('cardCommited', cardid, cardSauceid);
    }

    // TODO cards block on commit, confirm selection

    useEffect(() => {
        tmp.card.matchid !== -1 && setWhiteCards([...whiteCards, tmp])
    }, [tmp]);

    useEffect(() => {
        socket.on('recieveWhite', function (id: number, card: Card, cardSauce: CardSauce) {
            setTmp({card: card, sauce: cardSauce})
        })

        socket.on('loadloader', function (number: string) {
            setLoader(true)
            setMessage(null)
        })

        socket.on('unloadloader', function (number: string) {
            setLoader(false)
        })

        socket.on('tzarTurn', function () {
            setMessage('You are the tzar, pick a card')
            setCommit({
                canCommit: false,
                commitCount: commit.commitCount
            })
        })

        socket.on('playerWait', function () {
            setMessage('Tzar is picking a card')
            setCommit({
                canCommit: false,
                commitCount: commit.commitCount
            })
        })

        socket.on('blockTzar', function (tzarid: string) {
            setMessage('You are the tzar')
            setCommit({
                canCommit: false,
                commitCount: commit.commitCount
            })
        })

        socket.on('enableCards', function () {
            setMessage(null)
            setCommit({
                canCommit: true,
                commitCount: 0
            })
        })

        socket.on('clearBoard', function () {
            setWhiteCards([])
        })

        socket.on("startDisable", function (data: string) {
            setCommit({
                canCommit: true,
                commitCount: 0
            })
        })
    }, [socket]);

    return (
        <PlayerCardsContext.Provider value={[whiteCards, setWhiteCards, loader, message, cardCommited]}>
            {props.children}
        </PlayerCardsContext.Provider>
    )
}

export {PlayerCards}